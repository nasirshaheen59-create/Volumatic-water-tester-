import React, { useState } from 'react';
import { WaterData } from '../constants';
import { 
  Droplet, 
  AlertTriangle, 
  CheckCircle, 
  Navigation, 
  Activity, 
  MapPin, 
  Building2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  ShieldCheck 
} from 'lucide-react';

interface ResultCardProps {
  data: WaterData;
  distance?: number;
  isExactMatch?: boolean;
}

interface SafetyTip {
  title: string;
  action: string;
  method: string;
  kit: string;
}

const CONTAMINANT_TIPS: Record<string, SafetyTip> = {
  Bacteria: {
    title: 'Biological Contamination (Bacteria)',
    action: 'Water must be disinfected before consumption.',
    method: 'Boil water vigorously for at least 1–3 minutes, or use ultraviolet (UV) purification or chlorination.',
    kit: 'Coliform Bacteria home testing kit.'
  },
  Arsenic: {
    title: 'Arsenic Contamination',
    action: 'Heavy metal present. WARNING: Do NOT boil water as it concentrates Arsenic levels.',
    method: 'Use an Activated Alumina filter, Reverse Osmosis (RO) system, or specialized Arsenic-removal filter cartridges.',
    kit: 'Arsenic Quick Test Kit.'
  },
  Fluoride: {
    title: 'High Fluoride Levels',
    action: 'Excess fluoride can cause skeletal and dental fluorosis. WARNING: Do NOT boil water.',
    method: 'Requires Reverse Osmosis (RO), activated alumina filters, or water distillation.',
    kit: 'Fluoride reagent photometer or colorimetric test kit.'
  },
  Iron: {
    title: 'High Iron Content',
    action: 'Causes metallic taste, rust discoloration, and plumbing stains.',
    method: 'Use iron-removal filters (manganese greensand), catalytic carbon filters, or water softeners.',
    kit: 'Iron colorimetric test strips.'
  },
  TDS: {
    title: 'High TDS (Total Dissolved Solids)',
    action: 'Indicates high salinity or heavily mineralized water.',
    method: 'Use a Reverse Osmosis (RO) system or water distillation to reduce dissolved mineral concentration.',
    kit: 'Handheld digital TDS meter (highly recommended).'
  },
  Chloride: {
    title: 'High Chloride/Salinity',
    action: 'Gives water a salty taste and accelerates pipe and appliance corrosion.',
    method: 'Reverse Osmosis (RO) or distillation is necessary to remove dissolved salt ions.',
    kit: 'Chloride titrator strips.'
  },
  Nitrate: {
    title: 'Nitrate Contamination',
    action: 'Dangerous for infants. WARNING: Do NOT boil water, as this increases nitrate concentration.',
    method: 'Use an ion-exchange water softener or a Reverse Osmosis (RO) system.',
    kit: 'Nitrate/Nitrite test strips.'
  },
  Turbidity: {
    title: 'High Turbidity (Cloudy Water)',
    action: 'Water is cloudy with suspended particles, which can shield harmful pathogens.',
    method: 'Use sediment pre-filtration (5-micron or lower) followed by activated carbon filtration.',
    kit: 'Turbidity tube test or Secchi disk.'
  },
  Hardness: {
    title: 'Water Hardness (Calcium/Magnesium)',
    action: 'Causes scale buildup in pipes, heating elements, and reduces soap lather.',
    method: 'Install an ion-exchange water softener or a comprehensive Reverse Osmosis system.',
    kit: 'Hardness (calcium carbonate) liquid reagent test.'
  }
};

const GENERAL_SAFE_TIPS = {
  title: 'Safe Drinking Water Tips',
  action: 'Maintain strict hygiene of water storage and distribution systems.',
  method: 'Clean and sanitize overhead/underground storage tanks every 6 months. Keep storage containers tightly covered.',
  kit: 'Annual basic chemical and bacterial screening is recommended to detect pipe leakage issues.'
};

const getContaminantTip = (contaminant: string): SafetyTip | null => {
  const norm = contaminant.trim().toLowerCase();
  if (norm.includes('bacteria') || norm.includes('bacterial') || norm.includes('coliform') || norm.includes('microbial')) {
    return CONTAMINANT_TIPS.Bacteria;
  }
  if (norm.includes('arsenic')) {
    return CONTAMINANT_TIPS.Arsenic;
  }
  if (norm.includes('fluoride')) {
    return CONTAMINANT_TIPS.Fluoride;
  }
  if (norm.includes('iron')) {
    return CONTAMINANT_TIPS.Iron;
  }
  if (norm.includes('tds') || norm.includes('solids') || norm.includes('salinity') || norm.includes('saline')) {
    return CONTAMINANT_TIPS.TDS;
  }
  if (norm.includes('chloride')) {
    return CONTAMINANT_TIPS.Chloride;
  }
  if (norm.includes('nitrate')) {
    return CONTAMINANT_TIPS.Nitrate;
  }
  if (norm.includes('turbidity') || norm.includes('cloudy') || norm.includes('suspended')) {
    return CONTAMINANT_TIPS.Turbidity;
  }
  if (norm.includes('hardness') || norm.includes('calcium') || norm.includes('magnesium')) {
    return CONTAMINANT_TIPS.Hardness;
  }
  return null;
};

interface WaterSafetyGaugeProps {
  safe: number;
  unsafe: number;
  isSafeStatus: boolean;
  isModerateStatus: boolean;
  isUnknownStatus: boolean;
}

const WaterSafetyGauge: React.FC<WaterSafetyGaugeProps> = ({
  safe,
  unsafe,
  isSafeStatus,
  isModerateStatus,
  isUnknownStatus,
}) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const safeStroke = isUnknownStatus ? 0 : (safe / 100) * circumference;

  // Dynamically determine dominant percentage to show in the center for clarity
  const showUnsafeInCenter = !isUnknownStatus && (unsafe > safe);
  const displayPercentage = showUnsafeInCenter ? unsafe : safe;
  const displayLabel = showUnsafeInCenter ? 'Unsafe' : 'Safe';
  
  const textGradient = isUnknownStatus
    ? 'from-slate-500 to-slate-400'
    : showUnsafeInCenter
    ? 'from-rose-600 to-red-500'
    : isModerateStatus
    ? 'from-amber-500 to-yellow-500'
    : 'from-emerald-600 to-teal-500';

  const glowColor = isUnknownStatus
    ? 'bg-slate-300'
    : showUnsafeInCenter
    ? 'bg-rose-400'
    : isModerateStatus
    ? 'bg-amber-400'
    : 'bg-emerald-400';

  return (
    <div className="relative flex flex-col items-center justify-center p-2 mb-2">
      {/* Container holding gauge + overlays */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Decorative ambient glowing aura behind the gauge */}
        <div className={`absolute w-28 h-28 rounded-full opacity-10 blur-xl ${glowColor}`} />

        <svg className="w-full h-full transform -rotate-90 select-none drop-shadow-md" viewBox="0 0 100 100">
          {/* Base Ring representing the Unsafe (Red) track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={`${isUnknownStatus ? 'stroke-slate-200/50' : 'stroke-rose-500'} fill-none`}
            strokeWidth="7"
            strokeDasharray={isUnknownStatus ? '4 4' : undefined}
          />
          
          {/* Overlay Ring representing the Safe (Green) portion */}
          {!isUnknownStatus && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
              strokeWidth="7"
              strokeDasharray={`${safeStroke} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Central Text/Percentage Badge */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          {isUnknownStatus ? (
            <HelpCircle className="w-10 h-10 text-slate-400 animate-pulse" />
          ) : (
            <>
              <span className={`text-3xl font-black tracking-tighter bg-gradient-to-r ${textGradient} bg-clip-text text-transparent`}>
                {displayPercentage}%
              </span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">
                {displayLabel}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Modern Horizontal Label Legend */}
      {!isUnknownStatus && (
        <div className="flex gap-3 mt-2 justify-center text-[9px] font-bold tracking-wider uppercase text-slate-450">
          <div className="flex items-center gap-1 bg-emerald-50/70 px-2 py-0.5 rounded-full border border-emerald-100/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-700">{safe}% Safe</span>
          </div>
          <div className="flex items-center gap-1 bg-rose-50/70 px-2 py-0.5 rounded-full border border-rose-100/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span className="text-rose-700">{unsafe}% Unsafe</span>
          </div>
        </div>
      )}
    </div>
  );
};

const ResultCard: React.FC<ResultCardProps> = ({ data, distance, isExactMatch = true }) => {
  const isSafe = data.status === 'Safe';
  const isModerate = data.status === 'Moderate';
  const isUnknown = data.status === 'Unknown';
  const [isTipsExpanded, setIsTipsExpanded] = useState(false);

  // Collect unique safety tips for all detected contaminants
  const uniqueTips: SafetyTip[] = [];
  const seenTitles = new Set<string>();

  data.contaminants.forEach(c => {
    const tip = getContaminantTip(c);
    if (tip && !seenTitles.has(tip.title)) {
      uniqueTips.push(tip);
      seenTitles.add(tip.title);
    }
  });

  const GENERAL_UNSAFE_TIPS = {
    title: 'General Water Purification Advice',
    action: 'Treat all tap water before drinking.',
    method: 'Boil water vigorously for 1–3 minutes, or install a sediment + multi-stage activated carbon filter system.',
    kit: 'Complete 10-in-1 home water quality testing kit.'
  };
  
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

        <WaterSafetyGauge 
          safe={data.safePercentage} 
          unsafe={data.unsafePercentage} 
          isSafeStatus={isSafe} 
          isModerateStatus={isModerate} 
          isUnknownStatus={isUnknown} 
        />
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

        {/* Safety Tips Accordion */}
        <div className="mb-6">
          <button
            id="safety-tips-toggle"
            onClick={() => setIsTipsExpanded(!isTipsExpanded)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
              isSafe 
                ? 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 text-emerald-950' 
                : 'bg-amber-50/50 border-amber-100 hover:bg-amber-50 hover:border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${isSafe ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                {isSafe ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wide uppercase text-slate-400">Treatment Guide</p>
                <h4 className="text-sm font-bold text-slate-850">Actionable Safety Tips</h4>
              </div>
            </div>
            {isTipsExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </button>

          {isTipsExpanded && (
            <div className={`mt-2 p-5 rounded-2xl border bg-white shadow-sm space-y-4 ${
              isSafe ? 'border-emerald-100' : 'border-amber-100'
            }`}>
              {uniqueTips.length > 0 ? (
                uniqueTips.map((tip, index) => {
                  const isBoilingUnsafe = tip.title.includes('Arsenic') || tip.title.includes('Nitrate') || tip.title.includes('Fluoride');
                  return (
                    <div key={index} className="pb-4 last:pb-0 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2 h-2 rounded-full ${isBoilingUnsafe ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                        <h5 className="font-bold text-slate-850 text-xs">{tip.title}</h5>
                      </div>
                      
                      <div className="space-y-2 pl-4">
                        {/* Action step */}
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 text-xs">
                          <span className="font-semibold text-slate-400 min-w-[70px]">Action:</span>
                          <span className={`font-medium ${isBoilingUnsafe ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                            {tip.action}
                          </span>
                        </div>
                        
                        {/* Method step */}
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 text-xs">
                          <span className="font-semibold text-slate-400 min-w-[70px]">Method:</span>
                          <span className="text-slate-600 leading-relaxed font-medium">{tip.method}</span>
                        </div>
                        
                        {/* Testing kit */}
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="font-semibold text-slate-400 min-w-[70px]">Test Kit:</span>
                          <span className="text-slate-600 font-semibold italic">{tip.kit}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* No specific contaminant tips mapped or safe */
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${isSafe ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    <h5 className="font-bold text-slate-850 text-xs">
                      {isSafe ? GENERAL_SAFE_TIPS.title : GENERAL_UNSAFE_TIPS.title}
                    </h5>
                  </div>
                  
                  <div className="space-y-2 pl-4">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 text-xs">
                      <span className="font-semibold text-slate-400 min-w-[70px]">Action:</span>
                      <span className="text-slate-700 font-medium">
                        {isSafe ? GENERAL_SAFE_TIPS.action : GENERAL_UNSAFE_TIPS.action}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 text-xs">
                      <span className="font-semibold text-slate-400 min-w-[70px]">Method:</span>
                      <span className="text-slate-600 leading-relaxed font-medium">
                        {isSafe ? GENERAL_SAFE_TIPS.method : GENERAL_UNSAFE_TIPS.method}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-400 min-w-[70px]">Test Kit:</span>
                      <span className="text-slate-600 font-semibold italic">
                        {isSafe ? GENERAL_SAFE_TIPS.kit : GENERAL_UNSAFE_TIPS.kit}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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