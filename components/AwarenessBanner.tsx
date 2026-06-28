import React, { useState } from 'react';
import { Heart, Share2, Check } from 'lucide-react';

const AwarenessBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText('https://volumatic-water-tester.vercel.app/');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-lg shadow-rose-50/50 hover:shadow-xl hover:shadow-rose-100/40 transition-all duration-300">
      {/* Visual Image Section with Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src="https://as2.ftcdn.net/jpg/08/10/54/45/1000_F_810544579_EusoNpMlXB0yDQEGjsYoOey16LWMoe0E.jpg"
          alt="Pakistani village girl drinking water from a community hand pump"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
        />
        {/* Soft elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        {/* NGO Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-rose-600/90 backdrop-blur-sm text-white rounded-full border border-rose-400/30 shadow-md">
          <Heart className="w-3.5 h-3.5 fill-white animate-pulse" />
          <span className="text-[10px] font-black tracking-wider uppercase">Safe Water Initiative</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-black text-slate-800 tracking-tight leading-snug mb-2">
          Saaf Paani, Har Bachay Ka Haq
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">
          Over 53,000 Pakistani children die annually from diarrhea caused by contaminated water. 
          Your awareness and action can help protect the next generation from preventable waterborne illnesses.
        </p>

        {/* Action Button & Stats Row */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleShare}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              copied 
                ? 'bg-emerald-600 text-white shadow-emerald-200' 
                : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 shadow-rose-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Link Copied! Share with Others</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share App to Spread Awareness</span>
              </>
            )}
          </button>
          
          <div className="flex items-center justify-around py-2 border-t border-slate-100 mt-1">
            <div className="text-center">
              <span className="block text-sm font-black text-rose-600">53,000+</span>
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Lives Saved Goal</span>
            </div>
            <div className="w-px h-6 bg-slate-100" />
            <div className="text-center">
              <span className="block text-sm font-black text-blue-600">100%</span>
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Advocacy Focus</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwarenessBanner;
