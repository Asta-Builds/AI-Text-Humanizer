import React, { useState } from "react";
import {
  UserPlus,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Loader2,
  CheckCircle,
  GraduationCap,
  Users,
  Sparkles
} from "lucide-react";
import { signUpWithEmail } from "../utils/supabase";

interface RegisterViewProps {
  setActivePage: (page: "landing" | "app" | "login" | "register") => void;
  setCurrentUser: (user: any | null) => void;
  addLog: (type: "info" | "request" | "success" | "error", message: string, details?: string) => void;
}

export default function RegisterView({
  setActivePage,
  setCurrentUser,
  addLog
}: RegisterViewProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("professor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const emailTrimmed = email.trim().toLowerCase();

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Minimum 6 caractères requis.");
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError("Veuillez accepter les conditions d'utilisation.");
      setLoading(false);
      return;
    }

    try {
      try {
        const user = await signUpWithEmail(emailTrimmed, password);
        const mappedUser = {
          ...user,
          id: user?.id,
          uid: user?.id,
          displayName: fullName || emailTrimmed.split("@")[0],
          photoURL: null
        };
        setSuccess("Compte créé avec succès !");
        setCurrentUser(mappedUser);
        addLog("success", `Nouveau compte créé : ${emailTrimmed}.`, "Connecté à Supabase Auth.");
        setTimeout(() => setActivePage("app"), 1500);
      } catch (sbErr: any) {
        console.warn("Supabase sign up error.", sbErr);
        if (sbErr.message?.includes("already registered") || sbErr.status === 409 || sbErr.code === "auth/email-already-in-use") {
          throw sbErr;
        }
        setCurrentUser({
          id: "sandbox-registration-id-" + Math.floor(Math.random() * 900),
          uid: "sandbox-registration-id-" + Math.floor(Math.random() * 900),
          email: emailTrimmed,
          displayName: fullName || emailTrimmed.split("@")[0],
          photoURL: null
        });
        setSuccess("Profil simulé activé !");
        addLog("info", `Compte simulé créé pour ${emailTrimmed}.`, "Enregistré hors-ligne.");
        setTimeout(() => setActivePage("app"), 1500);
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || "Erreur lors de l'inscription.";
      if (err.message?.includes("already registered") || err.status === 409 || err.code === "auth/email-already-in-use") {
        errMsg = "Cette adresse email est déjà utilisée.";
      } else if (err.status === 400 || err.code === "auth/invalid-email") {
        errMsg = "Email invalide ou mot de passe trop faible.";
      }
      setError(errMsg);
      addLog("error", "Échec de l'inscription.", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 workspace-grid opacity-[0.03]" />
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[130px] pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          <div className="bg-white border border-slate-200 rounded-[32px] shadow-xl overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
                  Créer un Compte
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Rejoignez HumanFlow Architect
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-xs text-rose-700 items-start leading-relaxed">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3 text-xs text-emerald-800 items-start leading-relaxed">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Role toggle */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("professor")}
                    className={`py-3 px-3.5 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                      role === "professor"
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Éducateur
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("scholar")}
                    className={`py-3 px-3.5 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                      role === "scholar"
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Chercheur
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    placeholder="Dr. Thomas Dahou"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                      placeholder="professeur@universite.fr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Confirmer</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs text-slate-500 leading-relaxed">
                    J'accepte les{" "}
                    <a href="#terms" className="text-indigo-600 font-semibold hover:underline">conditions d'utilisation</a>{" "}
                    et la{" "}
                    <a href="#privacy" className="text-indigo-600 font-semibold hover:underline">politique de confidentialité</a>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Création...</>
                  ) : (
                    <><UserPlus className="w-4 h-4" /> Créer mon Compte</>
                  )}
                </button>
              </form>

              <div className="text-center mt-6 text-xs text-slate-500">
                Déjà un compte ?{" "}
                <button onClick={() => setActivePage("login")} className="text-indigo-600 font-bold hover:underline cursor-pointer">
                  Se connecter
                </button>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600" />
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Sparkles className="w-3 h-3" />
              <span>Rejoignez des milliers de chercheurs et d'éducateurs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
