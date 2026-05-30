import React, { useState } from "react";
import { 
  Home, 
  Layers, 
  BookOpen, 
  Terminal, 
  Key, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  ShieldCheck,
  User
} from "lucide-react";

interface NavbarProps {
  activePage: "landing" | "app" | "login" | "register";
  setActivePage: (page: "landing" | "app" | "login" | "register") => void;
  activeTab: "visualizer" | "logs" | "apikey" | "docs";
  setActiveTab: (tab: "visualizer" | "logs" | "apikey" | "docs") => void;
  currentUser: any | null;
  handleLogout: () => void;
  isAdminAuthenticated: boolean;
  onAdminClick: () => void;
  onLockAdmin: () => void;
}

export default function Navbar({
  activePage,
  setActivePage,
  activeTab,
  setActiveTab,
  currentUser,
  handleLogout,
  isAdminAuthenticated,
  onAdminClick,
  onLockAdmin
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (user: any) => {
    if (user?.displayName) return user.displayName.slice(0, 2).toUpperCase();
    if (user?.email) return user.email.slice(0, 2).toUpperCase();
    return "US";
  };

  return (
    <nav className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Brand section */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => {
                setActivePage("landing");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-all">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-display font-bold text-slate-800 text-sm tracking-tight leading-none group-hover:text-indigo-650 transition-all">
                  HumanFlow <span className="text-indigo-600 font-extrabold">Architect</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Moteur de Texte Éducatif
                </span>
              </div>
            </button>
 
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => {
                  setActivePage("landing");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activePage === "landing"
                    ? "bg-indigo-50/70 text-indigo-700"
                    : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                Accueil
              </button>
 
              <button
                onClick={() => {
                  setActivePage("app");
                  setActiveTab("visualizer");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activePage === "app" && activeTab === "visualizer"
                    ? "bg-indigo-50/70 text-indigo-700"
                    : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                Outil Humaniseur
              </button>
 
              <button
                onClick={() => {
                  setActivePage("app");
                  setActiveTab("docs");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activePage === "app" && activeTab === "docs"
                    ? "bg-indigo-50/70 text-indigo-700"
                    : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                Guide et Rubrique
              </button>
 
              {isAdminAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      setActivePage("app");
                      setActiveTab("logs");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      activePage === "app" && activeTab === "logs"
                        ? "bg-indigo-50/70 text-indigo-700"
                        : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Terminal className="w-4 h-4 shrink-0" />
                    Traces Système
                  </button>
 
                  <button
                    onClick={() => {
                      setActivePage("app");
                      setActiveTab("apikey");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      activePage === "app" && activeTab === "apikey"
                        ? "bg-indigo-50/70 text-indigo-700"
                        : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Key className="w-4 h-4 shrink-0" />
                    Clés d'API
                  </button>
                </>
              )}
            </div>
          </div>
 
          {/* User Auth controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Admin status indicator */}
            {isAdminAuthenticated && (
              <button
                onClick={onLockAdmin}
                className="px-2.5 py-1.5 bg-amber-50 rounded-xl hover:bg-amber-100 border border-amber-200 text-amber-800 font-semibold text-[11px] flex items-center gap-1.5 transition-all animate-fade-in"
                title="Verrouiller l'espace Admin"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Admin Certifié
              </button>
            )}
 
            <div className="h-4 w-[1px] bg-slate-200"></div>
 
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Profile Circle */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200 select-none uppercase">
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt="User" 
                        className="w-full h-full rounded-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      getInitials(currentUser)
                    )}
                  </div>
                  <div className="flex flex-col text-left max-w-32">
                    <span className="text-xs font-semibold text-slate-800 truncate leading-tight">
                      {currentUser.displayName || currentUser.email?.split("@")[0] || "Éducateur"}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {currentUser.email || "Utilisateur Hors-ligne"}
                    </span>
                  </div>
                </div>
 
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-450 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                  title="Se déconnecter"
                >
                  <LogLevelIcon className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActivePage("login")}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-650 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  Connexion
                </button>
                <button
                  onClick={() => setActivePage("register")}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  S'inscrire
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center lg:hidden gap-3">
            {currentUser && (
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200 uppercase">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="User" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  getInitials(currentUser)
                )}
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-50 border-b border-slate-200 py-3 px-4 space-y-2">
          <button
            onClick={() => {
              setActivePage("landing");
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <Home className="w-4 h-4 text-slate-500" />
            Accueil
          </button>
          <button
            onClick={() => {
              setActivePage("app");
              setActiveTab("visualizer");
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            Outil Humaniseur
          </button>
          <button
            onClick={() => {
              setActivePage("app");
              setActiveTab("docs");
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            Guide et Rubrique
          </button>

          {isAdminAuthenticated && (
            <>
              <button
                onClick={() => {
                  setActivePage("app");
                  setActiveTab("logs");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Terminal className="w-4 h-4 text-slate-500" />
                Traces Système
              </button>
              <button
                onClick={() => {
                  setActivePage("app");
                  setActiveTab("apikey");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Key className="w-4 h-4 text-slate-500" />
                Clés d'API
              </button>
            </>
          )}

          <div className="border-t border-slate-200 my-2 pt-2"></div>

          {currentUser ? (
            <div className="space-y-2">
              <div className="px-3 pb-2 text-[11px] text-slate-400">
                Connecté en tant que <span className="font-semibold text-slate-600 block truncate">{currentUser.email}</span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setActivePage("login");
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 text-center"
              >
                Connexion
              </button>
              <button
                onClick={() => {
                  setActivePage("register");
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 bg-indigo-600 rounded-xl text-xs font-bold text-white text-center"
              >
                S'inscrire
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function LogLevelIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m8.25 3H6.75m12 0a2.25 2.25 0 012.25 2.25v5.25a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5v-5.25a2.25 2.25 0 012.25-2.25m10.5 0h.008v.008h-.008V12zm-3 0h.008v.008h-.008V12zm-3 0h.008v.008H10.5V12zm-3 0h.008v.008H7.5V12z" />
    </svg>
  );
}
