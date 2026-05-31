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
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col gap-5" id="preset-options-selector">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <Sliders className="w-4 h-4 text-indigo-600" />
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Paramètres de Raffinement</h3>
          <p className="text-[11px] text-slate-400">Ajustez le style et les contraintes</p>
        </div>
      </div>

      {/* Academic Profiles */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5" /> Profils Académiques
        </label>
        <div className="grid grid-cols-2 gap-2">
          {academicProfiles.map(profile => {
            const IconComponent = profile.icon;
            const isSelected = options.profile === profile.id;
            return (
              <button
                key={profile.id}
                id={`profile-btn-${profile.id}`}
                type="button"
                onClick={() => updateOption("profile", profile.id as ToneProfileType)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected 
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 text-slate-500"
                }`}
              >
                <IconComponent className={`w-4 h-4 mb-1.5 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                <span className="text-xs text-slate-700">{profile.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* General Profiles */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Profils Généraux
        </label>
        <div className="grid grid-cols-2 gap-2">
          {generalProfiles.map(profile => {
            const IconComponent = profile.icon;
            const isSelected = options.profile === profile.id;
            return (
              <button
                key={profile.id}
                id={`profile-btn-${profile.id}`}
                type="button"
                onClick={() => updateOption("profile", profile.id as ToneProfileType)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected 
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 text-slate-500"
                }`}
              >
                <IconComponent className={`w-4 h-4 mb-1.5 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                <span className="text-xs text-slate-700">{profile.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Grade level & Creativity level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">

        {/* Grade Level */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-600 tracking-wide uppercase">Niveau Cible</label>
          <div className="flex flex-col gap-1.5 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
            {gradeLevelTargets.map(target => {
              const isSelected = options.gradeLevelTarget === target.id;
              return (
                <button
                  key={target.id}
                  id={`grade-btn-${target.id}`}
                  type="button"
                  onClick={() => updateOption("gradeLevelTarget", target.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white shadow-xs border border-indigo-200 text-indigo-900"
                      : "hover:bg-white/40 text-slate-500 border border-transparent"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-xs text-slate-700">{target.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Creativity */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-600 tracking-wide uppercase">Créativité</label>
          <div className="flex flex-col gap-1.5 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
            {creativityLevels.map(level => {
              const isSelected = options.creativity === level.id;
              return (
                <button
                  key={level.id}
                  id={`creativity-btn-${level.id}`}
                  type="button"
                  onClick={() => updateOption("creativity", level.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white shadow-xs border border-indigo-200 text-indigo-900"
                      : "hover:bg-white/40 text-slate-500 border border-transparent"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-xs text-slate-700">{level.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Toggles */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <label className="text-[10px] font-bold text-slate-600 tracking-wide uppercase">Options</label>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            id="toggle-plagiarism-safeguard"
            onClick={() => updateOption("plagiarismSafeguard", !options.plagiarismSafeguard)}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-200 transition-all text-left cursor-pointer"
          >
            <div className="pr-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Protection Citations
              </span>
            </div>
            {options.plagiarismSafeguard ? (
              <ToggleRight className="w-7 h-7 text-emerald-600 shrink-0" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-slate-300 shrink-0" />
            )}
          </button>

          <button
            type="button"
            id="toggle-bullet-to-narrative"
            onClick={() => updateOption("bulletToNarrative", !options.bulletToNarrative)}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-200 transition-all text-left cursor-pointer"
          >
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-indigo-500" /> Plan → Narration
            </span>
            {options.bulletToNarrative ? (
              <ToggleRight className="w-7 h-7 text-indigo-600 shrink-0" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-slate-300 shrink-0" />
            )}
          </button>

          <button
            type="button"
            id="toggle-strip-cliches"
            onClick={() => updateOption("stripClichés", !options.stripClichés)}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-200 transition-all text-left cursor-pointer"
          >
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              Purger les Clichés
            </span>
            {options.stripClichés ? (
              <ToggleRight className="w-7 h-7 text-indigo-600 shrink-0" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-slate-300 shrink-0" />
            )}
          </button>

          <button
            type="button"
            id="toggle-preserve-formatting"
            onClick={() => updateOption("preserveFormatting", !options.preserveFormatting)}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-200 transition-all text-left cursor-pointer"
          >
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              Garder la Mise en Page
            </span>
            {options.preserveFormatting ? (
              <ToggleRight className="w-7 h-7 text-indigo-600 shrink-0" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-slate-300 shrink-0" />
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
