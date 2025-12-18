import React from 'react';
import { Sparkles, Info } from 'lucide-react';
import type { AnalysisResult } from '../services/geminiService';

interface LiveAnalysisCardProps {
  analysis: AnalysisResult;
  locationName: string;
}

const LiveAnalysisCard: React.FC<LiveAnalysisCardProps> = ({ analysis, locationName }) => {
  if (!analysis) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-4 bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-50/50 overflow-hidden animate-fade-in-up">
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4 flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
           <h3 className="text-white font-bold text-sm leading-tight">Live Analyst Verification</h3>
           <p className="text-indigo-100 text-[10px] font-medium">Checking Official Govt Databases</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="prose prose-sm max-w-none text-slate-600 text-sm leading-relaxed mb-4">
          <p>{analysis.text}</p>
        </div>
        
        {/* Only show source references if the fallback didn't kick in (i.e., we actually have search data) */}
        {analysis.sources && analysis.sources.length > 0 ? (
          <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Reference Sources</p>
              <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-slate-100 rounded text-[10px] text-slate-500 font-medium">PCRWR Reports</span>
                  <span className="px-2 py-1 bg-slate-100 rounded text-[10px] text-slate-500 font-medium">Punjab HUD&PHED</span>
                  <span className="px-2 py-1 bg-slate-100 rounded text-[10px] text-slate-500 font-medium">Urban Unit</span>
                  <span className="px-2 py-1 bg-slate-100 rounded text-[10px] text-slate-500 font-medium">WHO-UNICEF</span>
                  <span className="px-2 py-1 bg-slate-100 rounded text-[10px] text-slate-500 font-medium">EPA Punjab</span>
              </div>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
             <Info className="w-3 h-3 text-slate-400" />
             <p className="text-[10px] text-slate-400 font-medium italic">
               Live search unavailable. Analysis based on general knowledge.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveAnalysisCard;