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
  Layers,
  Sparkles,
  BookOpen
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

  // Filter and search history items
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
    switch(id) {
      case "academic": return "Scholarly Paper";
      case "grant_proposal": return "Grant Proposal";
      case "lecture_notes": return "Lecture Draft";
      case "recommendation": return "Recommendation Letter";
      case "conversational": return "Conversational";
      case "professional": return "Corporate Prof";
      case "creative": return "Creative Prose";
      case "storyteller": return "Storyteller";
      default: return id;
    }
  };

  // Helper to trigger direct Markdown file download
  const handleExportMarkdown = (item: HumanizeHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent item select event

    const text = `# Academic Humanizer Log - Profile: ${getProfileName(item.options.profile)}
Date: ${item.timestamp}
Original Words: ${item.metrics.originalWords} | Humanized Words: ${item.metrics.humanizedWords}
AI Signature Probability: Original: ${item.metrics.roboticScoreBefore}% -> Humanized: ${item.metrics.roboticScoreAfter}%
Perplexity Index: ${item.metrics.perplexityIndex || 85}% | Burstiness Index: ${item.metrics.burstinessIndex || 80}%

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

  // Helper to trigger academic LaTeX file download
  const handleExportLaTeX = (item: HumanizeHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent item select

    const text = `% Academic Humanizer Output - LaTeX Document
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\title{HumanFlow Document Revision Report}
\\author{Educator Portfolio Cabinet}
\\date{${item.timestamp}}

\\begin{document}

\\maketitle

\\section{Transformation Metadata}
\\begin{itemize}
  \\item \\textbf{Revision Target:} ${getProfileName(item.options.profile)}
  \\item \\textbf{AI Detector Footprint Reduction:} ${item.metrics.roboticScoreBefore}\\% \\mbox{to} ${item.metrics.roboticScoreAfter}\\%
  \\item \\textbf{Estimated Complexity Grade:} ${item.metrics.gradeLevelCalculated || "Undergraduate"}
\\end{itemize}

\\section{Approved Humanized Prose}
${item.humanizedText.replace(/%/g, '\\%').replace(/&/g, '\\&').replace(/_/g, '\\_')}

\\end{document}
`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `academic_prose_${item.id.replace('history-', '')}.tex`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-sm flex flex-col gap-4" id="humanization-history-container">
      
      {/* Search and Clear Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600 shrink-0 animate-pulse" />
          <div>
            <h3 className="font-display font-semibold text-gray-900 text-sm tracking-tight">Academic Archives Cabinet</h3>
            <p className="text-xs text-gray-400 font-sans">Persistent storage and export center for previous outputs</p>
          </div>
        </div>
        
        <button
          type="button"
          id="clear-history-btn"
          onClick={onClearHistory}
          className="text-[11px] text-gray-400 hover:text-rose-600 font-sans cursor-pointer hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto border border-transparent hover:border-rose-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Wipe Archives Cabinet
        </button>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pb-1">
        {/* Search text input */}
        <div className="md:col-span-7 relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-gray-700 font-sans focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all"
            placeholder="Search matching content essays or outlines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tone Filters */}
        <div className="md:col-span-5 flex items-center gap-1.5 overflow-x-auto text-[10px] pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`px-2 py-1.5 rounded-lg border transition-all truncate cursor-pointer ${
              selectedFilter === "all"
                ? "bg-slate-800 text-white border-slate-800 font-semibold"
                : "bg-slate-50 border-gray-100 text-gray-500 hover:bg-slate-100"
            }`}
          >
            All Logs
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("academic_only")}
            className={`px-2 py-1.5 rounded-lg border transition-all truncate cursor-pointer ${
              selectedFilter === "academic_only"
                ? "bg-indigo-600 text-white border-indigo-600 font-semibold"
                : "bg-slate-50 border-gray-100 text-indigo-600 hover:bg-slate-100"
            }`}
          >
            ★ Academic Only
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("academic")}
            className={`px-2 py-1.5 rounded-lg border transition-all truncate cursor-pointer ${
              selectedFilter === "academic"
                ? "bg-slate-800 text-white border-slate-800 font-bold"
                : "bg-slate-50 border-gray-100 text-gray-500 hover:bg-slate-100"
            }`}
          >
            Scholarly Papers
          </button>
        </div>
      </div>

      {/* ARCHIVE Cabinet List */}
      <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs italic">
            No stored academic templates matched your searches or filters.
          </div>
        ) : (
          filteredHistory.map((item) => {
            const originalSnippet = item.originalText.length > 90 
              ? `${item.originalText.substring(0, 90)}...` 
              : item.originalText;

            const isAcademicItem = ["academic", "grant_proposal", "lecture_notes", "recommendation"].includes(item.options.profile);

            return (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                onClick={() => onSelectItem(item)}
                className="w-full text-left py-3 flex items-start gap-3 hover:bg-slate-50/70 rounded-2xl px-2.5 transition-all group cursor-pointer"
              >
                {/* Visual Icon indicator */}
                <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                  isAcademicItem 
                    ? "bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100/80" 
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/80"
                }`}>
                  <BookOpen className="w-4 h-4" />
                </div>

                {/* Content details block */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <p className="text-xs font-semibold text-gray-800 font-sans capitalize flex items-center gap-1.5">
                      {getProfileName(item.options.profile)} Profile
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({item.metrics.originalWords} → {item.metrics.humanizedWords} words)
                      </span>
                    </p>

                    {/* Quick export actions in list */}
                    <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        title="Export as Academic Markdown (.md)"
                        onClick={(e) => handleExportMarkdown(item, e)}
                        className="p-1 px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[9px] font-semibold flex items-center gap-0.5 transition-all cursor-pointer border border-slate-200"
                      >
                        <Download className="w-2.5 h-2.5" /> MD
                      </button>
                      {isAcademicItem && (
                        <button
                          title="Export as LaTeX Article Code (.tex)"
                          onClick={(e) => handleExportLaTeX(item, e)}
                          className="p-1 px-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-[9px] font-bold flex items-center gap-0.5 transition-all cursor-pointer border border-indigo-200/50"
                        >
                          <FileText className="w-2.5 h-2.5" /> LaTeX
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="font-sans text-[11px] text-gray-500 truncate mt-1 leading-normal">
                    {originalSnippet}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" /> {item.timestamp}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold tracking-wider font-sans px-1.5 py-0.5 rounded-md uppercase text-[9px]">
                      Reduced to {item.metrics.roboticScoreAfter}%
                    </span>
                    {item.metrics.gradeLevelCalculated && (
                      <span className="text-[9px] text-slate-400 bg-slate-50 border border-gray-100 px-1.5 py-0.5 rounded-sm shrink-0 truncate">
                        {item.metrics.gradeLevelCalculated}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all self-center shrink-0" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
