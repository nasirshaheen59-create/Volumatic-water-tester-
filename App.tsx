import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, Info, ChevronDown, Droplet, Sparkles, AlertCircle } from 'lucide-react';
import { CITIES_DATA, WaterData } from './constants';
import { calculateDistance } from './utils/distance';
import { findNearestCityByName, getWaterQualityAnalysis } from './services/geminiService';
import type { AnalysisResult } from './services/geminiService';
import ResultCard from './components/ResultCard';
import LiveAnalysisCard from './components/LiveAnalysisCard';

interface Suggestion {
  name: string;
  type: 'City' | 'Area';
  parentCity?: string;
}

const App: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCity, setSelectedCity] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ data: WaterData; distance: number; isExactMatch: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<boolean>(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (value.trim().length > 0) {
      const query = value.toLowerCase();
      const newSuggestions: Suggestion[] = [];

      CITIES_DATA.forEach(city => {
        if (city.name.toLowerCase().includes(query)) {
          newSuggestions.push({ name: city.name, type: 'City' });
        }
        if (city.samplePoints) {
          city.samplePoints.forEach(point => {
            if (point.name.toLowerCase().includes(query)) {
              newSuggestions.push({ name: point.name, type: 'Area', parentCity: city.name });
            }
          });
        }
      });
      setSuggestions(newSuggestions.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchInput(suggestion.name);
    setShowSuggestions(false);
    
    if (suggestion.type === 'City') {
      handleCitySelect(suggestion.name);
    } else if (suggestion.type === 'Area' && suggestion.parentCity) {
      const cityData = CITIES_DATA.find(c => c.name === suggestion.parentCity);
      if (cityData) {
        setResult({ data: cityData, distance: 0, isExactMatch: true });
        setSelectedCity(cityData.name);
        setError(null);
        triggerLiveAnalysis(suggestion.name + " in " + cityData.name);
      }
    }
  };

  const handleCitySelect = (cityName: string) => {
    setSearchInput(''); 
    setSelectedCity(cityName); 
    const cityData = CITIES_DATA.find(c => c.name === cityName);
    if (cityData) {
      setResult({ data: cityData, distance: 0, isExactMatch: true });
      setError(null);
      triggerLiveAnalysis(cityName);
    }
  };

  const triggerLiveAnalysis = async (location: string) => {
    setAnalysisResult(null);
    setAnalysisError(false);
    setAnalysisLoading(true);
    
    try {
      const searchContext = location.toLowerCase().includes('pakistan') ? location : `${location}, Pakistan`;
      const analysis = await getWaterQualityAnalysis(searchContext);
      if (analysis) {
        setAnalysisResult(analysis);
      } else {
        setAnalysisError(true);
      }
    } catch (e) {
      console.error(e);
      setAnalysisError(true);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setShowSuggestions(false);

    setLoading(true);
    setAnalysisResult(null);
    setAnalysisError(false);
    setError(null);
    setResult(null);

    const query = searchInput.trim().toLowerCase();
    let liveQuery = searchInput;

    try {
      // 1. Direct match in local data
      let match = CITIES_DATA.find(c => c.name.toLowerCase() === query);
      if (!match) {
        match = CITIES_DATA.find(city => 
          city.samplePoints?.some(point => point.name.toLowerCase().includes(query))
        );
      }

      if (match) {
        setResult({ data: match, distance: 0, isExactMatch: true });
        setSelectedCity(match.name);
        liveQuery = match.name;
      } else {
        // 2. AI Resolution (Landmarks/Universities)
        const resolverContext = selectedCity ? `${searchInput} in ${selectedCity}` : searchInput;
        const aiCityName = await findNearestCityByName(resolverContext);
        
        if (aiCityName) {
          const cityData = CITIES_DATA.find(c => c.name === aiCityName);
          if (cityData) {
            setResult({ data: cityData, distance: 0, isExactMatch: false });
            setSelectedCity(cityData.name);
            liveQuery = `${searchInput} in ${cityData.name}`;
          }
        } else if (selectedCity) {
          // 3. FALLBACK: Use selected city if everything else fails
          const cityData = CITIES_DATA.find(c => c.name === selectedCity);
          if (cityData) {
            setResult({ data: cityData, distance: 0, isExactMatch: false });
            // Do not clear selectedCity
            liveQuery = `${searchInput} in ${selectedCity}`;
          }
        } else {
          // 4. ABSOLUTE FALLBACK: Custom Unknown Location
          const customData: WaterData = {
            id: 'custom',
            name: searchInput,
            nameUrdu: searchInput,
            lat: 0, lng: 0,
            safePercentage: 0, unsafePercentage: 0,
            status: 'Unknown',
            contaminants: [],
            description: 'No historical record found. Performing live database scan...',
            samplePoints: []
          };
          setResult({ data: customData, distance: 0, isExactMatch: true });
        }
      }
      
      triggerLiveAnalysis(liveQuery);

    } catch (err) {
      setError("Analysis system busy. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setAnalysisResult(null);
    setAnalysisError(false);
    setError(null);
    setResult(null);
    setSelectedCity('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        let nearestCity: WaterData | null = null;
        let minDistance = Infinity;

        CITIES_DATA.forEach(city => {
          const dist = calculateDistance(userLat, userLng, city.lat, city.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearestCity = city;
          }
        });

        if (nearestCity) {
          const city = nearestCity as WaterData;
          setResult({ data: city, distance: minDistance, isExactMatch: minDistance <= 20 });
          if (minDistance <= 20) setSelectedCity(city.name);
          triggerLiveAnalysis(city.name);
        }
        setLoading(false);
      },
      () => {
        setError("Location access denied. Please select a city manually.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Droplet className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 leading-none tracking-tight">Volumatic</h1>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">Water Tester</p>
            </div>
          </div>
          <button onClick={() => window.open('https://pcrwr.gov.pk/', '_blank')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <Info className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Is Your Water Safe?</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-[260px] mx-auto">
            Check the quality of drinking water in your area instantly with <span className="font-semibold text-blue-600">Volumatic</span>.
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/60 border border-white mb-6 space-y-4 relative z-10" ref={searchContainerRef}>
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             </div>
             <select 
               className="block w-full pl-10 pr-10 py-3.5 text-sm border-2 border-slate-100 focus:outline-none focus:border-blue-500 focus:ring-0 rounded-xl bg-slate-50 text-slate-700 appearance-none cursor-pointer font-medium transition-all"
               onChange={(e) => handleCitySelect(e.target.value)}
               value={selectedCity}
             >
                <option value="" disabled>Select City directly...</option>
                {CITIES_DATA.map(city => (
                  <option key={city.id} value={city.name}>{city.name}</option>
                ))}
             </select>
             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
               <ChevronDown className="h-4 w-4 text-slate-400" />
             </div>
          </div>

          <div className="relative flex items-center justify-center">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
             <span className="relative bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">or search area</span>
          </div>

          <div className="relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="e.g. BZU, DHA, Mandi Morr..."
                className="w-full pl-12 pr-14 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 outline-none text-slate-800 font-medium placeholder-slate-400 transition-all shadow-inner"
                value={searchInput}
                onChange={handleInputChange}
                onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                disabled={loading}
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-20">
                {suggestions.map((item, idx) => (
                  <li 
                    key={idx}
                    onClick={() => handleSuggestionClick(item)}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-0 group transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">{item.name}</span>
                      {item.type === 'Area' && <span className="text-[10px] text-slate-400">in {item.parentCity}</span>}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-blue-300">{item.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button 
            onClick={handleGeolocation}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors border-2 border-blue-100 border-dashed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
            Auto-Detect Location
          </button>
        </div>

        {loading && !result && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-600" />
            <p className="text-sm font-medium">Connecting to Water Report Database...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center text-sm font-medium">
            {error}
          </div>
        )}

        {result && (
          <>
            <ResultCard 
              data={result.data} 
              distance={result.distance} 
              isExactMatch={result.isExactMatch} 
            />
            
            {analysisLoading ? (
              <div className="w-full max-w-md mx-auto mt-4 p-6 bg-white/50 rounded-3xl border border-indigo-100 flex flex-col items-center justify-center text-center">
                <Sparkles className="w-6 h-6 text-indigo-400 mb-2 animate-spin-slow" />
                <p className="text-xs font-semibold text-indigo-400">Consulting Live Analyst Reports...</p>
              </div>
            ) : analysisError ? (
               <div className="w-full max-w-md mx-auto mt-4 p-4 bg-slate-100 rounded-3xl border border-slate-200 flex items-center gap-3 text-slate-500">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-xs">Live verification unavailable. Check API Key or Network.</p>
               </div>
            ) : (
              analysisResult && (
                <LiveAnalysisCard analysis={analysisResult} locationName={result.data.name} />
              )
            )}
          </>
        )}

        <div className="mt-auto pt-8 pb-4 text-center">
          <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
            © 2024 Volumatic Water Tester • v2.0
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;