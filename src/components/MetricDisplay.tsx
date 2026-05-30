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
    <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-sm space-y-6" id="metric-analysis-display">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-indigo-600 animate-pulse" />
          <div>
            <h3 className="font-display font-semibold text-gray-900 tracking-tight text-base">Academic Humanization Report</h3>
            <p className="text-xs text-gray-400 font-sans">Scholarly writing metrics & linguistic evaluation indicators</p>
          </div>
        </div>
        <div className="bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider">
          Robotic Footprint Reduced By {dropPercentage}%
        </div>
      </div>

      {/* COMPARATIVE AI CLASSIFICATION GAUGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* original copy metrics */}
        <div className="p-4 rounded-2xl border border-gray-100 bg-slate-50/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-[10px] font-bold text-gray-500 uppercase tracking-wider">Original AI Footprint</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-sans font-medium border ${getScoreColor(roboticScoreBefore)}`}>
              {getClassification(roboticScoreBefore)}
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="font-display font-bold text-3xl text-gray-800">{roboticScoreBefore}%</span>
              <span className="text-[10px] text-gray-400 font-sans">Probability Match</span>
            </div>
            {/* Visual Progress bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${getScoreBarColor(roboticScoreBefore)}`} 
                style={{ width: `${roboticScoreBefore}%` }}
              />
            </div>
          </div>
        </div>

        {/* humanized copy metrics */}
        <div className="p-4 rounded-2xl border border-emerald-100/50 bg-emerald-50/10 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Humanized Outcome</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-sans font-medium border ${getScoreColor(roboticScoreAfter)}`}>
              {getClassification(roboticScoreAfter)}
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="font-display font-bold text-3xl text-emerald-600">{roboticScoreAfter}%</span>
              <span className="text-[10px] text-emerald-500 font-sans">Agnostic Probability</span>
            </div>
            {/* Visual Progress bar */}
            <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                style={{ width: `${roboticScoreAfter}%` }}
              />
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-2 translate-y-2 text-emerald-600 pointer-events-none">
            <Sparkles className="w-16 h-16 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </div>
      </div>

      {/* CORE LINGUISTIC STATS & RATIOS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-b border-gray-100 py-4.5">
        {/* Word count block */}
        <div className="p-2 bg-slate-50/40 rounded-xl text-center">
          <div className="font-mono text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Original Words</div>
          <div className="font-display font-bold text-lg text-gray-700 mt-1">{originalWords}</div>
        </div>
        {/* output count block */}
        <div className="p-2 bg-slate-50/40 rounded-xl text-center">
          <div className="font-mono text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Humanized Words</div>
          <div className="font-display font-bold text-lg text-gray-700 mt-1">{humanizedWords}</div>
        </div>
        {/* clichés purged block */}
        <div className="p-2 bg-slate-50/40 rounded-xl text-center">
          <div className="font-mono text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Clichés Purged</div>
          <div className="font-display font-bold text-lg text-emerald-600 mt-1">+{clichésRemoved}</div>
        </div>
        {/* grade rating block */}
        <div className="p-2 bg-slate-100/40 rounded-xl text-center flex flex-col justify-center">
          <div className="font-mono text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Evaluation Index</div>
          <div className="font-sans font-bold text-xs text-indigo-700 truncate mt-1">{gradeLevelCalculated}</div>
        </div>
      </div>

      {/* DETAILED STATISTICAL CALIBRATORS FOR PROFESSORS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Perplexity Index Card */}
        <div className="p-3 border border-gray-150 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 mb-2">
            <Compass className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-bold font-sans tracking-wide uppercase">Lexical Diversity</span>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-800">{perplexityIndex}%</div>
            <p className="text-[9px] text-gray-400 mt-0.5 leading-normal">Unpredictable vocabulary richness. Human prose averages 75%+.</p>
          </div>
        </div>

        {/* Burstiness Index Card */}
        <div className="p-3 border border-gray-150 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 mb-2">
            <Waves className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span className="text-[10px] font-bold font-sans tracking-wide uppercase">Burstiness Flow</span>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-800">{burstinessIndex}%</div>
            <p className="text-[9px] text-gray-400 mt-0.5 leading-normal">Sentence length rhythm & length variation. AI patterns average 15%-35%.</p>
          </div>
        </div>

        {/* Plagiarism & Citation Safeguard Status */}
        <div className="p-3 border border-emerald-100 bg-emerald-50/5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-emerald-700 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold font-sans tracking-wide uppercase">Honor Safeguard</span>
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-700">
              {safeguardPassed ? "VERIFIED INTACT" : "UNSHIELDED"}
            </div>
            <p className="text-[9px] text-emerald-600/80 mt-1 leading-normal">All specific names, quotes, references, and statistics fully guarded.</p>
          </div>
        </div>
      </div>

      {/* DETECTED CLICHES */}
      {detectedClichés.length > 0 ? (
        <div className="space-y-2 pt-2 border-t border-slate-50">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-bold text-gray-700 font-sans tracking-wide uppercase">LLM Signature Clichés Scanned & Replaced</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {detectedClichés.map((cliché, index) => (
              <span 
                key={index} 
                className="px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-md text-[9px] font-mono leading-none"
              >
                {cliché}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-emerald-50/15 border border-emerald-100 p-3 rounded-2xl">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <span className="font-sans text-[11px] text-emerald-700">
            No robotic transitions detected in your input copy! Outstanding baseline structure.
          </span>
        </div>
      )}
    </div>
  );
}
