import React from 'react';
import { WaterData } from '../constants';
import { Droplet, AlertTriangle, CheckCircle, Navigation, Activity, MapPin, Building2, HelpCircle } from 'lucide-react';

interface ResultCardProps {
  data: WaterData;
  distance?: number;
  isExactMatch?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ data, distance, isExactMatch = true }) => {
  const isSafe = data.status === 'Safe';
  const isModerate = data.status === 'Moderate';
  const isUnknown = data.status === 'Unknown';
  
  // Default text and icon colors for status indication
  let icon = <AlertTriangle className="w-14 h-14 text-red-500 mb-2" />;
  let statusText = 'UNSAFE';
  let badgeClass = 'bg-red-100 text-red-700 border-red-200';

  if (isSafe) {
    icon = <CheckCircle className="w-14 h-14 text-green-500 mb-2" />;
    statusText = 'SAFE';
    badgeClass = 'bg-green-100 text-green-700 border-green-200';
  } else if (isModerate) {
    icon = <Activity className="w-14 h-14 text-yellow-500 mb-2" />;
    statusText = 'MODERATE';
    badgeClass = 'bg-yellow-100 text-yellow-700 border-yellow-200';
  } else if (isUnknown) {
    icon = <HelpCircle className="w-14 h-14 text-slate-400 mb-2" />;
    statusText = 'UNKNOWN';
    badgeClass = 'bg-slate-100 text-slate-600 border-slate-200';
  }

  return (
    <div className="w-full max-w-md mx-auto mt-6 bg-slate-50 rounded-3xl border border-blue-200 shadow-xl shadow-blue-100/50 relative overflow-hidden">
      
      {/* Header / Main Status */}
      <div className="p-8 pb-6 flex flex-col items-center text-center bg-gradient-to-b from-blue-100/60 to-slate-50 rounded-t-3xl">
        
        {!isExactMatch && !isUnknown && (
          <div className="mb-6 p-3 bg-white/60 rounded-xl border border-blue-200 text-blue-700 text-xs font-medium flex items-center gap-2">
            {distance && distance > 0 ? (
              <>
                <Navigation className="w-3.5 h-3.5 shrink-0" />
                <span>Nearest monitored city ({distance.toFixed(1)} km)</span>
              </>
            ) : (
              <>
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>Showing general city data for {data.name}</span>
              </>
            )}
          </div>
        )}

        {icon}
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">{data.name}</h2>
        <div className={`mt-2 px-6 py-1.5 rounded-full border text-sm font-bold tracking-widest ${badgeClass}`}>
          {statusText}
        </div>
      </div>

      <div className="px-6 pb-6 relative z-10">
        {/* Stats Grid - Hide for Unknown */}
        {!isUnknown && (
            <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
                <span className="block text-2xl font-black text-slate-800">{data.safePercentage}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Safe Sources</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
                <span className="block text-2xl font-black text-slate-800">{data.unsafePercentage}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Unsafe Sources</span>
            </div>
            </div>
        )}

        {/* Contaminants - Hide if unknown or empty */}
        {(!isUnknown || data.contaminants.length > 0) && (
            <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2 pl-1">
                <Droplet className="w-3.5 h-3.5" /> Detected Contaminants
            </h3>
            <div className="flex flex-wrap gap-2">
                {data.contaminants.length > 0 ? (
                    data.contaminants.map((c, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-sm">
                        {c}
                    </span>
                    ))
                ) : (
                    <span className="text-sm text-slate-400 italic pl-1">None reported</span>
                )}
            </div>
            </div>
        )}

        {/* Description */}
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 mb-6 relative">
            <p className="text-slate-700 text-sm leading-relaxed relative z-10">
              {data.description}
            </p>
        </div>

        {/* Detailed Sample Points List */}
        {data.samplePoints && data.samplePoints.length > 0 && (
            <div>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" /> Monitored Points
                    </h3>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden max-h-64 overflow-y-auto shadow-sm">
                    {data.samplePoints.map((point, index) => {
                        const isPointSafe = point.status === 'Safe';
                        return (
                            <div key={index} className="p-3 border-b border-slate-100 last:border-0 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-slate-700 text-xs">{point.name}</p>
                                    {!isPointSafe && point.contaminants.length > 0 && (
                                        <p className="text-[10px] text-red-500 mt-0.5">
                                            {point.contaminants.join(', ')}
                                        </p>
                                    )}
                                </div>
                                {isPointSafe ? (
                                   <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                ) : (
                                   <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
      </div>
      
      <div className="bg-slate-100 p-4 text-center border-t border-slate-200 rounded-b-3xl">
         <p className="text-[10px] text-slate-400 font-medium">Data Source: {isUnknown ? 'Live Analysis (Experimental)' : 'PCRWR Report 2021'}</p>
      </div>
    </div>
  );
};

export default ResultCard;