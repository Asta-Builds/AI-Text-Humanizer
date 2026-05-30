import React, { useState } from "react";
import { 
  Lock, 
  Mail, 
  LogIn, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Loader2
} from "lucide-react";
import { signInWithEmail, signInWithGoogle } from "../utils/supabase";

interface LoginViewProps {
  setActivePage: (page: "landing" | "app" | "login" | "register") => void;
  setCurrentUser: (user: any | null) => void;
  setIsAdminAuthenticated: (isAdmin: boolean) => void;
  addLog: (type: "info" | "request" | "success" | "error", message: string, details?: string) => void;
}

export default function LoginView({
  setActivePage,
  setCurrentUser,
  setIsAdminAuthenticated,
  addLog
}: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const emailTrimmed = email.trim().toLowerCase();
    const isSpecialAdmin = 
      emailTrimmed === "abdelilahdahou7@gmail.com" && 
      (password === "Mojo2003@##abdo2001" || password === "mojo2003@##abdo2001");

    try {
      // Attempt actual Supabase Login
      try {
        const supabaseUser = await signInWithEmail(emailTrimmed, password);
        const mappedUser = {
          ...supabaseUser,
          id: supabaseUser?.id,
          uid: supabaseUser?.id,
          displayName: supabaseUser?.user_metadata?.full_name || emailTrimmed.split("@")[0],
          photoURL: supabaseUser?.user_metadata?.avatar_url || null
        };
        setCurrentUser(mappedUser);
        addLog("success", `User authenticated successfully (${emailTrimmed}).`, "Connected securely to Supabase Auth.");
        
        if (isSpecialAdmin) {
          setIsAdminAuthenticated(true);
          addLog("success", "Administrative clearance granted automatically.", "Special administrative signature verified.");
        }
        
        setActivePage("app");
        return;
      } catch (sbErr: any) {
        console.warn("Supabase Auth error. Checking for special admin credentials offline:", sbErr);
        
        // If it is the special administrator bypass, let them in even if offline or Supabase provider is not yet set up
        if (isSpecialAdmin) {
          setCurrentUser({
            id: "admin-bypass-id",
            uid: "admin-bypass-id",
            email: emailTrimmed,
            displayName: "Administrator Abdo",
            photoURL: null
          });
          setIsAdminAuthenticated(true);
          addLog("success", "Admin logged in via localized offline signature fallback.", "Bypassed standard authentication gates.");
          setActivePage("app");
          return;
        }

        // Standard user offline sandbox fallback is provided for a smooth developer experience
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || sbErr.message?.includes("invalid") || sbErr.message?.includes("apiKey") || sbErr.status === 400 || sbErr.status === 401) {
          throw sbErr; // throw out to handle in outer block
        }
        throw sbErr;
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || "Invalid credentials. Please verify your entries.";
      if (err.status === 400 || err.message?.includes("Invalid login credentials") || err.message?.includes("wrong-password")) {
        errMsg = "Strict Security Guard: The password or email you provided did not match our records.";
      } else if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || err.message?.includes("invalid apiKey") || err.message?.includes("URL")) {
        // Fallback demo account for other users if Supabase hasn't enabled Email/Password yet in console
        if (emailTrimmed.includes("@") && password.length >= 6) {
          setCurrentUser({
            id: "sandbox-userid",
            uid: "sandbox-userid",
            email: emailTrimmed,
            displayName: emailTrimmed.split("@")[0],
            photoURL: null
          });
          addLog("info", `Sandbox login fallback active for user ${emailTrimmed}`, "Email login registered via browser sessions.");
          setActivePage("app");
          return;
        }
        errMsg = "Supabase requires URL & Anon Key to be configured. Create any mock email & 6-character password to bypass.";
      }
      setError(errMsg);
      addLog("error", "Sign in attempts blocked.", errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error("Supabase is not configured.");
      }
      addLog("info", "Redirection vers Google OAuth via Supabase...");
      await signInWithGoogle();
      // Le navigateur effectue la redirection
    } catch (err: any) {
      console.error("Google login failed", err);
      // Mode Sandbox Hors-ligne si Supabase n'est pas encore provisionné
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || err.message?.includes("Supabase") || err.message?.includes("not found")) {
        setCurrentUser({
          id: "google-bypass-id",
          uid: "google-bypass-id",
          email: "abdelilahdahou7@gmail.com",
          displayName: "Google Abdo",
          photoURL: null
        });
        setIsAdminAuthenticated(true);
        addLog("info", "Session Administrateur chargée via mocks Google hors-ligne.", "Connexion simulée.");
        setActivePage("app");
        return;
      }
      setError("La redirection Google OAuth a échoué. Référez-vous aux Traces Système.");
      addLog("error", "Échec de redirection OAuth.", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Visual blur highlights */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[130px] pointer-events-none" />

      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl shadow-xl p-8 sm:p-10 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4 animate-bounce">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            Se connecter à HumanFlow
          </h2>
          <p className="text-sm text-slate-500 mt-1 leading-normal font-sans">
            Accédez à l'espace de comparaison de phrases avancé et aux statistiques métriques
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100/80 rounded-2xl flex gap-3 text-xs text-rose-700 items-start leading-relaxed">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Exception de Sécurité</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleCredentialLogin} className="space-y-5">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider block mb-1.5">
              Adresse E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-330 rounded-xl text-sm font-sans text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                placeholder="professeur@universite.fr"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider block">
                Mot de passe sécurisé
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-xs hover:shadow-indigo-500/10 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Authentification en cours...
              </>
            ) : (
              <>
                Valider mes Identifiants
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center justify-between text-xs text-slate-400">
          <span className="w-full h-[1px] bg-slate-100"></span>
          <span className="px-3 shrink-0 font-mono uppercase tracking-wider text-[10px]">Ou connexion via fournisseur</span>
          <span className="w-full h-[1px] bg-slate-100"></span>
        </div>

        {/* Google sign in widget */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-11 bg-slate-50 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mb-6"
        >
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Connexion Google Classroom
        </button>

        <div className="text-center font-sans text-xs text-slate-500">
          Nouvel éducateur ?{" "}
          <button
            onClick={() => setActivePage("register")}
            className="text-indigo-600 font-bold hover:underline transition-all"
          >
            Créer un profil d'éducateur
          </button>
        </div>
      </div>
    </div>
  );
}
