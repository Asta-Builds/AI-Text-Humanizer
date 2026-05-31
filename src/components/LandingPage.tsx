import React, { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  ChevronRight,
  ChevronLeft,
  Star,
  Quote,
  Zap,
  FileText
} from "lucide-react";

interface LandingPageProps {
  setActivePage: (page: "landing" | "app" | "login" | "register") => void;
  setActiveTab: (tab: "visualizer" | "logs" | "apikey" | "docs") => void;
  currentUser: any | null;
}

const features = [
  {
    icon: Sparkles,
    title: "Profils de Tonalité",
    desc: "Ajustez la complexité des phrases selon vos besoins académiques : thèses, propositions, notes de cours."
  },
  {
    icon: ShieldCheck,
    title: "Citations Protégées",
    desc: "Analyseur exclusif qui préserve vos références, guillemets, statistiques et formules."
  },
  {
    icon: TrendingDown,
    title: "Réduction d'Empreinte IA",
    desc: "Faites passer le score de détection IA de 94% à 12% tout en gardant le sens intact."
  },
  {
    icon: FileText,
    title: "Comparaison Visuelle",
    desc: "Algorithme LCS pour un diff mot à mot entre le brouillon et la version humanisée."
  },
  {
    icon: Star,
    title: "Rapport de Métriques",
    desc: "Analyse détaillée : perplexité, burstiness, diversité lexicale et niveau cible."
  },
  {
    icon: Zap,
    title: "Export Polyvalent",
    desc: "Téléchargez en Word, Google Docs, Markdown ou LaTeX en un clic."
  }
];

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
  const [activeSandboxTab, setActiveSandboxTab] = useState<"editor" | "history">("editor");
  const [featureScrollPos, setFeatureScrollPos] = useState(0);

  const handleSandboxDemo = () => {
    setSandboxLoading(true);
    setTimeout(() => {
      setSandboxResult(
        "Les chercheurs modernes exploitent des systèmes autonomes pour compiler des sources, mais l'intégrité académique exige que les articles finaux conservent une voix humaine authentique."
      );
      setSandboxLoading(false);
    }, 900);
  };

  const scrollFeatures = (dir: number) => {
    const newPos = featureScrollPos + dir;
    const max = features.length - 3;
    setFeatureScrollPos(Math.max(0, Math.min(newPos, max)));
  };

  return (
    <div className="font-sans text-slate-800 bg-white min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-white to-white pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] opacity-[0.15] pointer-events-none">
          <div className="absolute top-[-5%] left-[15%] w-[500px] h-[500px] rounded-full bg-indigo-400 blur-[140px]" />
          <div className="absolute top-[15%] right-[5%] w-[400px] h-[400px] rounded-full bg-violet-400 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/70 text-indigo-700 text-xs font-semibold tracking-wide mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Optimisation Scientifique Nouvelle Génération
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-slate-900 leading-[1.1] max-w-4xl mx-auto mb-6">
            L'Excellence Académique à{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
              Portée de Main
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            HumanFlow Architect optimise dynamiquement les brouillons d'IA en améliorant la variété des phrases,
            en respectant les rubriques de vocabulaire scientifique et en protégeant vos citations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              onClick={() => {
                if (currentUser) {
                  setActivePage("app");
                  setActiveTab("visualizer");
                } else {
                  setActivePage("register");
                }
              }}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold tracking-wide shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group transition-all cursor-pointer"
            >
              {currentUser ? "Ouvrir l'Espace de Travail" : "Commencer Gratuitement"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                setActivePage("app");
                setActiveTab("visualizer");
              }}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-2xl font-semibold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Voir la Démo
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Editor Demo */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-[24px] shadow-xl overflow-hidden">
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => setActiveSandboxTab("editor")}
                  className={`flex-1 py-4 text-sm font-bold tracking-wide transition-all ${
                    activeSandboxTab === "editor"
                      ? "text-slate-900 border-b-2 border-slate-900 bg-slate-50/50"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Éditeur Principal
                </button>
                <button
                  onClick={() => setActiveSandboxTab("history")}
                  className={`flex-1 py-4 text-sm font-bold tracking-wide transition-all ${
                    activeSandboxTab === "history"
                      ? "text-slate-900 border-b-2 border-slate-900 bg-slate-50/50"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Historique
                </button>
              </div>

              {activeSandboxTab === "editor" && (
                <div className="p-6 md:p-8">
                  <textarea
                    value={sandboxInput}
                    onChange={(e) => setSandboxInput(e.target.value)}
                    className="w-full h-32 resize-none border-0 p-0 text-slate-700 text-sm focus:ring-0 focus:outline-hidden leading-relaxed"
                  />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                      {sandboxInput.split(/\s+/).filter(w => w.length > 0).length} mots
                    </span>
                    <button
                      onClick={handleSandboxDemo}
                      disabled={sandboxLoading || !sandboxInput.trim()}
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {sandboxLoading ? "Raffinage..." : "Lancer le Raffinage"}
                      <Zap className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>
              )}

              {activeSandboxTab === "history" && (
                <div className="p-6 md:p-8 text-center text-slate-400 text-sm">
                  Connectez-vous pour accéder à votre historique complet.
                </div>
              )}

              {sandboxResult && (
                <div className="border-t border-slate-100 bg-slate-50/30 p-6 md:p-8">
                  <div className="grid grid-cols-2 gap-8 mb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Empreinte IA (Avant)</span>
                        <span className="text-xs font-bold text-red-500">94%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-[94%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Empreinte IA (Après)</span>
                        <span className="text-xs font-bold text-indigo-600">12%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 w-[12%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 leading-relaxed text-slate-700 text-sm">
                    {sandboxResult}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50/80 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight mb-2">
              Fonctionnalités Clés
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Tout ce dont vous avez besoin pour transformer vos brouillons d'IA en textes académiques irréprochables.
            </p>
          </div>

          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
              {features.map((feature, i) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={i}
                    className="min-w-[280px] md:min-w-[320px] bg-white border border-slate-200 rounded-[24px] p-6 flex-shrink-0 snap-start hover:border-indigo-200 hover:shadow-lg transition-all"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-semibold text-slate-900 text-sm mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="hidden md:flex justify-center gap-3 mt-6">
              <button
                onClick={() => scrollFeatures(-1)}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-300 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollFeatures(1)}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-300 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Quote className="w-8 h-8 text-indigo-200 mx-auto mb-4" />
            <blockquote className="text-xl sm:text-2xl text-slate-800 font-display leading-relaxed mb-8">
              "HumanFlow Architect offre une précision inégalable pour la rédaction éducative.
              Il élimine la monotonie rythmique et verbale typique des IA tout en préservant mes citations et mes données d'études."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-700">TD</div>
                <div className="w-10 h-10 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center text-xs font-bold text-violet-700">AD</div>
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-700">ML</div>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900">Prof. T. Dahou</p>
                <p className="text-xs text-slate-400">Directeur de Recherche en Linguistique</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 to-slate-950 opacity-90" />
        <div className="absolute inset-0 workspace-grid opacity-[0.04]" />
        <div className="max-w-5xl mx-auto px-4 relative text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-bold">Prêt à Humaniser vos Documents Académiques ?</h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
            Rejoignez des milliers de chercheurs et d'éducateurs qui font confiance à HumanFlow Architect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                if (currentUser) {
                  setActivePage("app");
                  setActiveTab("visualizer");
                } else {
                  setActivePage("register");
                }
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Commencer Gratuitement
              <ChevronRight className="w-4 h-4" />
            </button>
            {!currentUser && (
              <button
                onClick={() => setActivePage("login")}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-white border border-indigo-400/30 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer"
              >
                Se Connecter
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
