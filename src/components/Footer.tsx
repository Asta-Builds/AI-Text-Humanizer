import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 py-12 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
              HumanFlow Architect © 2026
            </span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#terms" className="text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Conditions</a>
            <a href="#privacy" className="text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Confidentialité</a>
            <a href="#support" className="text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Support Technique</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
