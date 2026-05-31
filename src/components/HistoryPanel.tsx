import React, { useState } from "react";
import {
  History,
  Trash2,
  ChevronRight,
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  Sparkles
} from "lucide-react";
import { HumanizeHistoryItem } from "../types";

interface HistoryPanelProps {
  history: HumanizeHistoryItem[];
  onSelectItem: (item: HumanizeHistoryItem) => void;
  onClearHistory: () => void;
}

export default function HistoryPanel({ history, onSelectItem, onClearHistory }: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  if (history.length === 0) {
    return null;
  }

  const filteredHistory = history.filter(item => {
    const matchesSearch =
      item.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.humanizedText.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "academic_only") {
      return matchesSearch && ["academic", "grant_proposal", "lecture_notes", "recommendation"].includes(item.options.profile);
    }
    return matchesSearch && item.options.profile === selectedFilter;
  });

  const getProfileName = (id: string) => {
    switch (id) {
      case "academic": return "Scholarly Paper";
      case "grant_proposal": return "Grant Proposal";
      case "lecture_notes": return "Lecture Draft";
      case "recommendation": return "Recommendation";
      case "conversational": return "Conversational";
      case "professional": return "Corporate Prof";
      case "creative": return "Creative Prose";
      case "storyteller": return "Storyteller";
      default: return id;
    }
  };

  const handleExportMarkdown = (item: HumanizeHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `# Academic Humanizer Log - Profile: ${getProfileName(item.options.profile)}
Date: ${item.timestamp}
Original Words: ${item.metrics.originalWords} | Humanized Words: ${item.metrics.humanizedWords}
AI Signature Probability: Original: ${item.metrics.roboticScoreBefore}% -> Humanized: ${item.metrics.roboticScoreAfter}%

## Original AI Input Draft:
${item.originalText}

## Humanized Output Copy:
${item.humanizedText}
`;
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `humanflow_log_${item.id.replace('history-', '')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col max-h-[calc(100vh-120px)]" id="humanization-history-container">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Historique</h3>
          <div className="flex gap-1">
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors cursor-pointer">
              <Search className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors cursor-pointer">
              <Filter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClearHistory}
              className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              title="Effacer l'historique"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">Aucun résultat</div>
        ) : (
          filteredHistory.slice(0, 15).map((item) => {
            const isAcademic = ["academic", "grant_proposal", "lecture_notes", "recommendation"].includes(item.options.profile);
            return (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                onClick={() => onSelectItem(item)}
                className={`p-3 rounded-xl cursor-pointer hover:bg-indigo-50/50 transition-colors group border ${
                  isAcademic ? "bg-indigo-50/30 border-indigo-100" : "bg-white border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[9px] font-bold ${isAcademic ? "text-indigo-600" : "text-slate-400"}`}>
                    {item.timestamp}
                  </span>
                  <button
                    title="Export MD"
                    onClick={(e) => handleExportMarkdown(item, e)}
                    className="p-1 rounded text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{getProfileName(item.options.profile)}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                    isAcademic ? "bg-white border-indigo-100 text-indigo-500" : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}>
                    {item.metrics.gradeLevelCalculated || "Standard"}
                  </span>
                  <span className="text-[9px] text-slate-400">{item.metrics.humanizedWords} mots</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Storage footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Stockage</span>
          <span>{Math.min(100, Math.round((history.length / 50) * 100))}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-slate-400 rounded-full" style={{ width: `${Math.min(100, Math.round((history.length / 50) * 100))}%` }} />
        </div>
      </div>
    </div>
  );
}
