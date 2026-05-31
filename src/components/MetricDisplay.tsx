import React from "react";
import { 
  CheckCircle, 
  BookOpen, 
  AlertTriangle,
  Sparkles,
  TrendingDown,
  Percent,
  Compass,
  Waves,
  ShieldCheck,
  Scale
} from "lucide-react";

interface MetricDisplayProps {
  metrics: {
    originalWords: number;
    humanizedWords: number;
    roboticScoreBefore: number;
    roboticScoreAfter: number;
    clichésRemoved: number;
    detectedClichés: string[];
    perplexityIndex: number;
    burstinessIndex: number;
    gradeLevelCalculated: string;
    safeguardPassed: boolean;
  };
}

export default function MetricDisplay({ metrics }: MetricDisplayProps) {
  const {
    originalWords,
    humanizedWords,
    roboticScoreBefore,
    roboticScoreAfter,
    clichésRemoved,
    detectedClichés = [],
    perplexityIndex = 75,
    burstinessIndex = 70,
    gradeLevelCalculated = "Undergraduate Degree",
    safeguardPassed = true,
  } = metrics;

  const dropPercentage = roboticScoreBefore - roboticScoreAfter;

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-rose-600 bg-rose-50 border-rose-100";
    if (score >= 40) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-emerald-700 bg-emerald-50 border-emerald-100";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 70) return "bg-rose-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getClassification = (score: number) => {
    if (score >= 75) return "AI Generated footprint Flagged";
    if (score >= 40) return "Moderate AI Hybrid Signatures";
    return "Human Grade (Organic Quality)";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-5" id="metric-analysis-display">
      {/* Before/After scores */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Empreinte IA (Avant)</span>
            <span className="text-xs font-bold text-red-500">{roboticScoreBefore}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 bg-red-500`} style={{ width: `${roboticScoreBefore}%` }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Empreinte IA (Après)</span>
            <span className="text-xs font-bold text-indigo-600">{roboticScoreAfter}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${roboticScoreAfter}%` }} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mots</div>
          <div className="text-base font-bold text-slate-900 mt-0.5">{humanizedWords}</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Diversité</div>
          <div className="text-base font-bold text-slate-900 mt-0.5">{perplexityIndex}%</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Flux</div>
          <div className="text-base font-bold text-slate-900 mt-0.5">{burstinessIndex}%</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Clichés</div>
          <div className="text-base font-bold text-red-500 mt-0.5">{clichésRemoved}</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Niveau</div>
          <div className="text-xs font-bold text-indigo-600 mt-0.5 truncate">{gradeLevelCalculated}</div>
        </div>
      </div>

      {/* Detailed stats */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analyse Détaillée</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[9px] font-bold tracking-wide uppercase">Diversité Lexicale</span>
            </div>
            <div className="text-base font-bold text-slate-800">{perplexityIndex}%</div>
          </div>
          <div className="p-3 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
              <Waves className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[9px] font-bold tracking-wide uppercase">Rythme Phrastique</span>
            </div>
            <div className="text-base font-bold text-slate-800">{burstinessIndex}%</div>
          </div>
          <div className="p-3 border border-emerald-100 bg-emerald-50/5 rounded-xl">
            <div className="flex items-center gap-1.5 text-emerald-700 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[9px] font-bold tracking-wide uppercase">Protection</span>
            </div>
            <div className="text-xs font-bold text-emerald-700">
              {safeguardPassed ? "INTACTE" : "DÉSACTIVÉE"}
            </div>
          </div>
        </div>
      </div>

      {/* Clichés */}
      {detectedClichés.length > 0 ? (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[9px] font-bold text-amber-600 tracking-wide uppercase">Clichés détectés</span>
          <div className="flex flex-wrap gap-1.5">
            {detectedClichés.map((cliché, index) => (
              <span key={index} className="px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-md text-[9px] leading-none">{cliché}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-emerald-50/15 border border-emerald-100 p-3 rounded-xl">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-[11px] text-emerald-700">Aucun cliché détecté.</span>
        </div>
      )}

      {dropPercentage > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-center">
          <span className="text-xs font-bold text-indigo-700">Empreinte Robotique Réduite de {dropPercentage}%</span>
        </div>
      )}
    </div>
  );
}
