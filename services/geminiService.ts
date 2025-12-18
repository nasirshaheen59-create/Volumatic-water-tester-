import { GoogleGenAI } from "@google/genai";
import { CITIES_DATA } from "../constants";

// Moved client initialization inside functions to prevent top-level execution crashes
// if process.env is not immediately available during module loading.

export const findNearestCityByName = async (userInput: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const cityNames = CITIES_DATA.map(c => c.name).join(", ");
    
    // We ask Gemini to map the user input to one of our specific cities.
    // Updated prompt to handle landmarks, universities, and abbreviations better.
    const prompt = `
      You are a smart location resolver for a Water Safety App in Pakistan.
      
      Supported Cities Database:
      [${cityNames}]
      
      User Search Query: "${userInput}"
      
      Task:
      1. Determine if the search query refers to a location, landmark, university, hospital, colony, or area inside or very close to one of the Supported Cities.
      2. If yes, return the exact name of that City.
      3. Handles abbreviations: "BZ University" or "BZU" -> "Multan". "LUMS" -> "Lahore". "NUST" -> "Islamabad".
      4. If the query is unrelated to Pakistan or these cities, return "null".
      
      Return ONLY the City Name or "null". Do not add any punctuation or extra text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim();
    if (!text || text.toLowerCase() === 'null') return null;
    
    // Validate if the returned text matches one of our cities
    const match = CITIES_DATA.find(c => c.name.toLowerCase() === text.toLowerCase());
    return match ? match.name : null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export interface AnalysisResult {
  text: string;
  sources: { title: string; uri: string }[];
}

export const getWaterQualityAnalysis = async (location: string): Promise<AnalysisResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are a Water Quality Data Analyst for Pakistan.
    
    Task: Search for the latest available drinking water quality data for "${location}".
    
    MANDATORY: You must prioritize and strictly reference information from these OFFICIAL sources if available:
    1. PCRWR Drinking Water Quality Reports (2021, 2023, or later)
    2. Punjab HUD&PHED Water Quality Dashboard (hudpunjab.gov.pk)
    3. Urban Unit Punjab Water Reports (urbanunit.gov.pk)
    4. WHO-UNICEF JMP WASH Data for Pakistan
    5. EPA Punjab Quarterly Bulletins
    
    Output Requirements:
    - Provide a concise 2-3 sentence summary of the water safety status.
    - Specifically mention latest values for TDS, Arsenic, pH, or Bacteria if found in these live sources.
    - If recent data confirms the water is unsafe, clearly state why.
    - Do not provide generic advice; provide data-backed analysis.
  `;

  try {
    // Attempt 1: Try WITH Google Search Grounding
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned");

    // Extract sources from grounding metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ title: web.title, uri: web.uri }));

    // Deduplicate sources by URI
    const uniqueSources = Array.from(new Map(sources.map((item: any) => [item.uri, item])).values()) as { title: string; uri: string }[];

    return {
      text,
      sources: uniqueSources
    };

  } catch (error: any) {
    // Check for 403 Permission Denied or other tool-related errors
    if (
      error.toString().includes('403') || 
      error.toString().includes('PERMISSION_DENIED') || 
      error.status === 403
    ) {
      console.warn("Search Grounding unavailable (403). Falling back to basic model knowledge.");
      
      try {
        // Attempt 2: Fallback WITHOUT tools (Pure LLM knowledge)
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt + "\n\n(Note: Live search is unavailable, please provide analysis based on your internal knowledge base up to your cutoff.)",
        });

        if (fallbackResponse.text) {
          return {
            text: fallbackResponse.text,
            sources: [] // No live sources available in fallback
          };
        }
      } catch (fallbackError) {
        console.error("Gemini Fallback Analysis Error:", fallbackError);
        return null;
      }
    }
    
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};