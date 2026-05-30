import React, { useState } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Activity, 
  FileText, 
  Terminal, 
  GraduationCap,
  ChevronRight,
  BookOpen,
  CheckCircle,
  TrendingDown
} from "lucide-react";

interface LandingPageProps {
  setActivePage: (page: "landing" | "app" | "login" | "register") => void;
  setActiveTab: (tab: "visualizer" | "logs" | "apikey" | "docs") => void;
  currentUser: any | null;
}

export default function LandingPage({
  setActivePage,
  setActiveTab,
  currentUser
}: LandingPageProps) {
  const [sandboxInput, setSandboxInput] = useState(
    "À notre époque, les agents d'IA peuvent générer du texte. Cependant, il est essentiel que les travaux universitaires conservent un ton humain authentique."
  );
  const [sandboxResult, setSandboxResult] = useState<string | null>(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);

  const handleSandboxDemo = () => {
    setSandboxLoading(true);
    setTimeout(() => {
      setSandboxResult(
        "Les chercheurs modernes exploitent des systèmes autonomes pour compiler des sources, mais l'intégrité académique exige que les articles finaux conservent une voix humaine authentique."
      );
      setSandboxLoading(false);
    }, 900);
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle decorative mesh background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1300px] h-[550px] opacity-[0.22] pointer-events-none select-none">
          <div className="absolute top-[-10%] left-[20%] w-[450px] h-[450px] rounded-full bg-indigo-400 blur-[130px]" />
          <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-violet-400 blur-[110px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/70 text-indigo-700 text-xs font-semibold tracking-wide mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Favoriser l'Authenticité de l'Écriture Scientifique
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium tracking-tight text-slate-900 leading-[1.1] max-w-4xl mx-auto mb-6">
            Raffiner les Brouillons d'IA en Chefs-d'œuvre Académiques de <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent font-bold">Niveau Doctoral</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-xl text-slate-550 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            HumanFlow Architect optimise dynamiquement les brouillons d'IA en améliorant la variété des phrases, en respectant les rubriques de vocabulaire scientifique et en protégeant vos citations directes et références bibliographiques.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              onClick={() => {
                setActivePage("app");
                setActiveTab("visualizer");
              }}
              className="w-full sm:w-auto px-7 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold tracking-wide shadow-xs hover:shadow-indigo-500/10 cursor-pointer flex items-center justify-center gap-2 group transition-all"
            >
              Lancer l'Outil Principal
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-all" />
            </button>

            {!currentUser && (
              <button
                onClick={() => setActivePage("register")}
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-350 rounded-2xl font-semibold tracking-wide cursor-pointer transition-all"
              >
                Créer un Compte
              </button>
            )}
          </div>

          {/* Quick interactive sandbox preview block */}
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden text-left mb-16">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-400 font-mono ml-2">revision_interactive_demo.ts</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-450 font-mono bg-white border border-slate-200/60 px-2 py-0.5 rounded-lg">
                Panneau Démo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Sandbox Input field */}
              <div className="p-6 md:p-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Brouillon Brut d'IA</span>
                  <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-700 font-bold border border-rose-100 rounded-md">Texte Brut</span>
                </div>
                <textarea
                  value={sandboxInput}
                  onChange={(e) => setSandboxInput(e.target.value)}
                  className="w-full h-32 bg-transparent resize-none border-0 p-0 text-slate-700 text-sm focus:ring-0 focus:outline-hidden leading-relaxed"
                />
                <button
                  type="button"
                  onClick={handleSandboxDemo}
                  disabled={sandboxLoading || !sandboxInput.trim()}
                  className="self-end px-4.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-850 cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {sandboxLoading ? "Stylisation..." : "Raffiner le Brouillon"}
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </button>
              </div>

              {/* Sandbox Output field */}
              <div className="p-6 md:p-8 bg-slate-50/30 flex flex-col gap-4 justify-between min-h-[220px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Résultat Raffiné</span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 rounded-md">Humanisé</span>
                </div>

                <div className="flex-1 mt-2 text-sm text-slate-700 leading-relaxed font-sans">
                  {sandboxLoading ? (
                    <div className="flex flex-col gap-2.5 animate-pulse mt-4">
                      <div className="h-4 bg-slate-150 rounded w-11/12" />
                      <div className="h-4 bg-slate-150 rounded w-10/12" />
                      <div className="h-4 bg-slate-150 rounded w-8/12" />
                    </div>
                  ) : sandboxResult ? (
                    <p className="text-slate-800 bg-emerald-50/40 p-3.5 border border-emerald-100/50 rounded-2xl">
                      {sandboxResult}
                    </p>
                  ) : (
                    <span className="text-slate-400 italic">Cliquez sur « Raffiner le Brouillon » pour simuler l'optimisation comparative universitaire.</span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500 border-t border-slate-100/80 pt-4">
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Score Linguistique : 98% Naturel</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Filtre Anti-plagiat Validé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="bg-slate-100/60 py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight mb-2">
              Spécifications et Capacités d'Ingénierie Moteur
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Notre architecture sécurisée est optimisée sur mesure pour soutenir l'écriture universitaire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bento Card 1 */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 flex flex-col gap-4 shadow-xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-slate-850 text-base mb-1">Profils de Tonalité</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Ajustez la complexité des phrases selon qu'il s'agisse de thèses d'Essais, de Propositions de recherche, de Notes de Cours ou de Lettres de Recommandation.
                </p>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 flex flex-col gap-4 shadow-xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-slate-850 text-base mb-1">Citations & Guillemets Protégés</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Un analyseur exclusif bloque les modifications sur les références bibliographiques, citations entre crochets, guillemets directs et statistiques numériques.
                </p>
              </div>
            </div>

            {/* Bento Card 3 */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 flex flex-col gap-4 shadow-xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-slate-850 text-base mb-1">Surlignage Comparatif</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Des algorithmes de plus longue sous-suite commune (LCS) calculent un diff mot à mot pour rendre vos améliorations de style instantanément lisibles.
                </p>
              </div>
            </div>

            {/* Bento Card 4 */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 flex flex-col gap-4 shadow-xs hover:shadow-xs transition-shadow md:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-slate-850 text-base mb-1">Télémétrie en Direct</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Inspectez les coulisses du moteur ! Observez les requêtes vers l'API Gemini, le statut des serveurs Node.js Express et la latence de traitement actualisés en direct.
                </p>
              </div>
            </div>

            {/* Bento Card 5 */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 flex flex-col gap-4 shadow-xs hover:shadow-xs transition-shadow md:col-span-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-slate-850 text-base mb-1">Proxy Sécurisé à Trois Niveaux</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Le niveau client rend l'interface, le backend Node.js gère les API de manière ultra-sécurisée sans fuites de secrets, et le niveau Gemini traite la sémantique de pointe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Social Impact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-mono text-indigo-600 font-bold uppercase tracking-wider mb-3">Excellence Académique</h3>
            <blockquote className="text-xl sm:text-2xl text-slate-800 font-serif leading-relaxed italic mb-6">
              "HumanFlow Architect offre une précision inégalable pour la rédaction éducative. Il élimine la monotonie rythmique et verbale typique des IA tout en préservant mes citations et mes données d'études."
            </blockquote>
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700 border border-slate-200 uppercase font-sans">
                TD
              </div>
              <div className="text-left font-sans">
                <p className="text-sm font-semibold text-slate-900 leading-none">Prof. T. Dahou</p>
                <p className="text-[11px] text-slate-400 mt-1">Directeur de Recherche en Linguistique</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Footer Callout */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 to-slate-950 opacity-90" />
        <div className="max-w-5xl mx-auto px-4 relative text-center space-y-6">
          <h2 className="text-3xl font-display font-bold">Prêt à élever la qualité de vos textes ?</h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
            Créez votre compte éducateur gratuit ou explorez librement notre bac à sable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setActivePage("app");
                setActiveTab("visualizer");
              }}
              className="w-full sm:w-auto px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-xs tracking-wide cursor-pointer flex items-center justify-center gap-1.5 transition-all"
            >
              Ouvrir l'Espace de Travail
              <ChevronRight className="w-4 h-4" />
            </button>
            {!currentUser && (
              <button
                onClick={() => setActivePage("register")}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/30 rounded-xl font-bold text-xs tracking-wide cursor-pointer transition-all"
              >
                S'inscrire Maintenant
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
