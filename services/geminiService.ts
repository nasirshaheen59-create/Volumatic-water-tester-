import { GoogleGenAI } from "@google/genai";
import { CITIES_DATA } from "../constants";

/**
 * Safely initializes the GoogleGenAI client.
 * Static hosts like Vercel/Netlify sometimes don't shim 'process' in the browser.
 */
const getAIClient = () => {
  try {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    if (!apiKey) {
      console.warn("API Key is not defined in the environment. AI features will be limited.");
      return null;
    }
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI:", e);
    return null;
  }
};

export const findNearestCityByName = async (userInput: string): Promise<string | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  try {
    const cityNames = CITIES_DATA.map(c => c.name).join(", ");
    
    const prompt = `
      You are a smart location resolver for a Water Safety App in Pakistan.
      
      Supported Cities Database:
      [${cityNames}]
      
      User Search Query: "${userInput}"
      
      Task:
      1. Determine if the search query refers to a location, landmark, university, hospital, colony, or area inside or very close to one of the Supported Cities.
      2. If yes, return the exact name of that City from the Supported Cities list.
      3. Handles abbreviations: "BZ University" or "BZU" -> "Multan". "LUMS" -> "Lahore". "NUST" -> "Islamabad".
      4. If the query is unrelated to Pakistan or these cities, return "null".
      
      Return ONLY the City Name or "null". No punctuation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim();
    if (!text || text.toLowerCase() === 'null') return null;
    
    const match = CITIES_DATA.find(c => c.name.toLowerCase() === text.toLowerCase());
    return match ? match.name : null;

  } catch (error) {
    console.error("Gemini API Error (Location Resolve):", error);
    return null;
  }
};

export interface AnalysisResult {
  text: string;
  sources: { title: string; uri: string }[];
}

export const getWaterQualityAnalysis = async (location: string): Promise<AnalysisResult | null> => {
  const ai = getAIClient();
  if (!ai) return null;
  
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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned");

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ title: web.title, uri: web.uri }));

    const uniqueSources = Array.from(new Map(sources.map((item: any) => [item.uri, item])).values()) as { title: string; uri: string }[];

    return { text, sources: uniqueSources };

  } catch (error: any) {
    if (error.toString().includes('403') || error.toString().includes('PERMISSION_DENIED')) {
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt + "\n\n(Note: Live search is unavailable, please provide analysis based on your internal knowledge base.)",
        });

        if (fallbackResponse.text) {
          return { text: fallbackResponse.text, sources: [] };
        }
      } catch (fallbackError) {
        return null;
      }
    }
    return null;
  }
};