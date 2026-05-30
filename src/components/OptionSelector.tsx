import React from "react";
import { 
  MessageCircle, 
  Briefcase, 
  Sparkles, 
  BookOpen, 
  ToggleLeft, 
  ToggleRight, 
  Sliders,
  GraduationCap,
  Award,
  Presentation,
  UserCheck,
  ShieldCheck,
  Binary
} from "lucide-react";
import { HumanizeOptions, ToneProfileType } from "../types";

interface OptionSelectorProps {
  options: HumanizeOptions;
  setOptions: React.Dispatch<React.SetStateAction<HumanizeOptions>>;
}

export default function OptionSelector({ options, setOptions }: OptionSelectorProps) {
  const updateOption = <K extends keyof HumanizeOptions>(key: K, value: HumanizeOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const academicProfiles = [
    { id: "academic", name: "Scholarly Paper", icon: GraduationCap, desc: "Refines thesis, essay, or research prose" },
    { id: "grant_proposal", name: "Grant / Proposal", icon: Award, desc: "Compelling, direct, results-oriented" },
    { id: "lecture_notes", name: "Lecture/Syllabus", icon: Presentation, desc: "Accessible, engaging, pedagogically sound" },
    { id: "recommendation", name: "Recommendation", icon: UserCheck, desc: "Personal, warm, highly credible" },
  ] as const;

  const generalProfiles = [
    { id: "conversational", name: "Conversational", icon: MessageCircle, desc: "Engaging, casual, fluid" },
    { id: "professional", name: "Corporate Prof", icon: Briefcase, desc: "Crisp, authoritative business tone" },
    { id: "creative", name: "Creative Spec", icon: Sparkles, desc: "Expressive, rich literary vocabulary" },
    { id: "storyteller", name: "Storyteller", icon: BookOpen, desc: "Narrative, focused on human experiences" },
  ] as const;

  const gradeLevelTargets = [
    { id: "auto", name: "Organic Adapt", desc: "Clones the text's natural complexity" },
    { id: "high_school", name: "High School", desc: "Straightforward, accessible prose" },
    { id: "undergrad", name: "Undergraduate", desc: "Structured college level argumentation" },
    { id: "postgrad", name: "Doctoral/Postgrad", desc: "Elevated, highly precise research flows" },
  ] as const;

  const creativityLevels = [
    { id: "low", name: "Fidelity Preserved", desc: "Conservative styling adjustments" },
    { id: "medium", name: "Balanced Hybrid", desc: "Natural blending of style & pace" },
    { id: "high", name: "Expansive Flow", desc: "Dynamic structural sentence changes" },
  ] as const;

  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-sm flex flex-col gap-6" id="preset-options-selector">
      <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4 justify-between">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-indigo-600 animate-pulse" />
          <div>
            <h3 className="font-display font-semibold text-gray-900 tracking-tight text-base">Academic & Stylistic Parameters</h3>
            <p className="text-xs text-gray-500 font-sans">Fine-tune tone constraints, honor codes, and structures</p>
          </div>
        </div>
      </div>

      {/* Dynamic Academic & Scholarly Tones */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold text-indigo-600 font-sans tracking-wider uppercase flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4" /> Scholarly & Educator Profiles
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {academicProfiles.map(profile => {
            const IconComponent = profile.icon;
            const isSelected = options.profile === profile.id;
            return (
              <button
                key={profile.id}
                id={`profile-btn-${profile.id}`}
                type="button"
                onClick={() => updateOption("profile", profile.id as ToneProfileType)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected 
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm font-semibold" 
                    : "border-gray-100 bg-slate-50/50 hover:bg-slate-50 hover:border-gray-200 text-gray-600"
                }`}
              >
                <IconComponent className={`w-4.5 h-4.5 mb-2 ${isSelected ? "text-indigo-600" : "text-gray-400"}`} />
                <span className="font-sans text-xs text-gray-800">{profile.name}</span>
                <span className="font-sans text-[10px] text-gray-400 mt-1 line-clamp-1 leading-normal">{profile.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* General Profiles Toggle */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold text-slate-500 font-sans tracking-wider uppercase flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> General & Narrative Profiles
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {generalProfiles.map(profile => {
            const IconComponent = profile.icon;
            const isSelected = options.profile === profile.id;
            return (
              <button
                key={profile.id}
                id={`profile-btn-${profile.id}`}
                type="button"
                onClick={() => updateOption("profile", profile.id as ToneProfileType)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected 
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-xs font-semibold" 
                    : "border-gray-100 bg-slate-50/50 hover:bg-slate-50 hover:border-gray-200 text-gray-600"
                }`}
              >
                <IconComponent className={`w-4.5 h-4.5 mb-2 ${isSelected ? "text-indigo-600" : "text-gray-400"}`} />
                <span className="font-sans text-xs text-slate-700">{profile.name}</span>
                <span className="font-sans text-[10px] text-gray-400 mt-1 line-clamp-1 leading-normal">{profile.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Grade level & Creativity level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-5">
        
        {/* Academic Grade Target Selector */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-gray-700 font-sans tracking-wide uppercase flex items-center gap-1.5">
            Target Scholarly Grade Index
          </label>
          <div className="flex flex-col gap-2 bg-slate-50/50 p-2.5 rounded-2xl border border-gray-100">
            {gradeLevelTargets.map(target => {
              const isSelected = options.gradeLevelTarget === target.id;
              return (
                <button
                  key={target.id}
                  id={`grade-btn-${target.id}`}
                  type="button"
                  onClick={() => updateOption("gradeLevelTarget", target.id)}
                  className={`flex items-start gap-3 p-2 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-white shadow-xs border border-indigo-200 text-indigo-900" 
                      : "hover:bg-white/40 text-gray-600 border border-transparent"
                  }`}
                >
                  <div className={`mt-0.5 w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? "border-indigo-600 bg-indigo-600" : "border-gray-300 bg-white"
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="font-sans font-medium text-xs text-gray-800">{target.name}</div>
                    <div className="font-sans text-[10px] text-gray-400 mt-0.5 leading-normal">{target.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Creativity Level Setting */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-gray-700 font-sans tracking-wide uppercase flex items-center gap-1.5">
            Engine Creativity Index
          </label>
          <div className="flex flex-col gap-2 bg-slate-50/50 p-2.5 rounded-2xl border border-gray-100">
            {creativityLevels.map(level => {
              const isSelected = options.creativity === level.id;
              return (
                <button
                  key={level.id}
                  id={`creativity-btn-${level.id}`}
                  type="button"
                  onClick={() => updateOption("creativity", level.id)}
                  className={`flex items-start gap-3 p-2 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-white shadow-xs border border-indigo-200 text-indigo-900" 
                      : "hover:bg-white/40 text-gray-600 border border-transparent"
                  }`}
                >
                  <div className={`mt-0.5 w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? "border-indigo-600 bg-indigo-600" : "border-gray-300 bg-white"
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="font-sans font-medium text-xs text-gray-800">{level.name}</div>
                    <div className="font-sans text-[10px] text-gray-400 mt-0.5 leading-normal">{level.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Advanced Honor Guard Safeguards & Formatting Toggles */}
      <div className="space-y-3 border-t border-gray-100 pt-5">
        <label className="text-[11px] font-bold text-gray-700 font-sans tracking-wide uppercase">
          Academic Honor Guard & Content Toggles
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          
          {/* Plagiarism Safeguard */}
          <button
            type="button"
            id="toggle-plagiarism-safeguard"
            onClick={() => updateOption("plagiarismSafeguard", !options.plagiarismSafeguard)}
            className="flex items-center justify-between p-3 rounded-2xl border border-emerald-100 bg-emerald-50/10 hover:bg-emerald-50/25 hover:border-emerald-200 transition-all text-left cursor-pointer"
          >
            <div className="pr-2">
              <span className="font-sans font-semibold text-xs text-gray-800 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> Academic Integrity Shield
              </span>
              <span className="font-sans text-[10px] text-gray-400 block mt-0.5 leading-normal">Lock exact "... " quotes, specific citations, formulas & proper nouns</span>
            </div>
            {options.plagiarismSafeguard ? (
              <ToggleRight className="w-8 h-8 text-emerald-600 transition-all shrink-0" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-gray-300 transition-all shrink-0" />
            )}
          </button>

          {/* Bullet to Narrative */}
          <button
            type="button"
            id="toggle-bullet-to-narrative"
            onClick={() => updateOption("bulletToNarrative", !options.bulletToNarrative)}
            className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 bg-slate-50/50 hover:border-gray-200 hover:bg-slate-50 transition-all text-left cursor-pointer"
          >
            <div className="pr-2">
              <span className="font-sans font-semibold text-xs text-gray-800 flex items-center gap-1">
                <Binary className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> Outline-to-Narrative
              </span>
              <span className="font-sans text-[10px] text-gray-400 block mt-0.5 leading-normal">Restructure raw note bullets directly into fluent academic prose paragraphs</span>
            </div>
            {options.bulletToNarrative ? (
              <ToggleRight className="w-8 h-8 text-indigo-600 transition-all shrink-0" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-gray-300 transition-all shrink-0" />
            )}
          </button>

          {/* Purge Cliches */}
          <button
            type="button"
            id="toggle-strip-cliches"
            onClick={() => updateOption("stripClichés", !options.stripClichés)}
            className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all text-left cursor-pointer"
          >
            <div className="pr-2">
              <span className="font-sans font-medium text-xs text-gray-800 block">Purge Robotic LLM Clichés</span>
              <span className="font-sans text-[10px] text-gray-400 block mt-0.5 leading-normal">Purges common signature terms like "delve", "tapestry", "pivotal"</span>
            </div>
            {options.stripClichés ? (
              <ToggleRight className="w-8 h-8 text-indigo-600 transition-all shrink-0" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-gray-300 transition-all shrink-0" />
            )}
          </button>

          {/* Layout Protection */}
          <button
            type="button"
            id="toggle-preserve-formatting"
            onClick={() => updateOption("preserveFormatting", !options.preserveFormatting)}
            className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all text-left cursor-pointer"
          >
            <div className="pr-2">
              <span className="font-sans font-medium text-xs text-gray-800 block">Retain Page Layout & Marks</span>
              <span className="font-sans text-[10px] text-gray-400 block mt-0.5 leading-normal">Preserve bold highlights, markdown headings & raw structures</span>
            </div>
            {options.preserveFormatting ? (
              <ToggleRight className="w-8 h-8 text-indigo-600 transition-all shrink-0" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-gray-300 transition-all shrink-0" />
            )}
          </button>

        </div>
      </div>

    </div>
  );
}
