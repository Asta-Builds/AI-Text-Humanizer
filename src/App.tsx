import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, 
  Terminal, 
  Cpu, 
  Copy, 
  Check, 
  Zap, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  Database, 
  Key, 
  ShieldAlert, 
  GraduationCap,
  List, 
  MessageSquare, 
  Layers, 
  Globe, 
  Activity, 
  CheckCircle, 
  BookOpen, 
  ArrowRight, 
  ChevronRight,
  Trash2,
  Calendar,
  ShieldCheck,
  TrendingDown,
  Info,
  Scale,
  Binary,
  Download,
  Lock,
  Unlock,
  ChevronDown,
  ExternalLink,
  LogIn,
  UserPlus
} from "lucide-react";
import OptionSelector from "./components/OptionSelector";
import MetricDisplay from "./components/MetricDisplay";
import HistoryPanel from "./components/HistoryPanel";
import { PRESET_EXAMPLES, PresetExample } from "./data";
import { HumanizeOptions, HumanizeHistoryItem } from "./types";
import { exportToWord } from "./utils/wordExporter";
import { 
  ensureFirebaseInitialized, 
  signInWithGoogleDocsScope, 
  uploadToGoogleDocs, 
  generateAcademicDocHtml 
} from "./utils/googleDocsExporter";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import LoginView from "./components/LoginView";
import RegisterView from "./components/RegisterView";
import { supabase, logOut } from "./utils/supabase";

interface SystemLog {
  id: string;
  timestamp: string;
  type: "info" | "request" | "success" | "error";
  message: string;
  details?: string;
}

/**
 * Clean word-by-word diff highlight generator using dynamic programming (LCS)
 */
function renderDiffText(original: string, humanized: string, showDiff: boolean) {
  if (!showDiff) {
    return {
      originalEl: <span>{original}</span>,
      humanizedEl: <span>{humanized}</span>
    };
  }

  // Segment sequences into tokens by splitting on whitespace
  const words1 = original.split(/\s+/).filter(w => w.length > 0);
  const words2 = humanized.split(/\s+/).filter(w => w.length > 0);

  const n = words1.length;
  const m = words2.length;
  
  // Matrix DP for LCS sequence tracing
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      // Normalize letters and strip typical punctuation characters
      const w1 = words1[i - 1].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
      const w2 = words2[j - 1].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
      if (w1 === w2 && w1.length > 0) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const deletedIndices = new Set<number>();
  const addedIndices = new Set<number>();

  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const w1 = words1[i - 1].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
      const w2 = words2[j - 1].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
      if (w1 === w2 && w1.length > 0) {
        i--;
        j--;
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        deletedIndices.add(i - 1);
        i--;
      } else {
        addedIndices.add(j - 1);
        j--;
      }
    } else if (i > 0) {
      deletedIndices.add(i - 1);
      i--;
    } else {
      addedIndices.add(j - 1);
      j--;
    }
  }

  const originalEl = (
    <span>
      {words1.map((word, idx) => {
        const isDeleted = deletedIndices.has(idx);
        return (
          <span 
            key={idx} 
            className={
              isDeleted 
                ? "bg-rose-50 text-rose-700 border border-rose-100 line-through px-1 py-0.5 rounded-md inline-block mx-0.5 font-sans font-medium" 
                : "text-slate-500 font-sans"
            }
          >
            {word}
          </span>
        );
      })}
    </span>
  );

  const humanizedEl = (
    <span>
      {words2.map((word, idx) => {
        const isAdded = addedIndices.has(idx);
        return (
          <span 
            key={idx} 
            className={
              isAdded 
                ? "bg-emerald-50 text-emerald-800 border border-emerald-100 px-1 py-0.5 rounded-md inline-block mx-0.5 font-sans font-semibold" 
                : "text-slate-800 font-sans"
            }
          >
            {word}
          </span>
        );
      })}
    </span>
  );

  return { originalEl, humanizedEl };
}

const mapSupabaseUser = (user: any) => {
  if (!user) return null;
  return {
    ...user,
    uid: user.id,
    displayName: user.user_metadata?.full_name || user.user_metadata?.displayName || user.email?.split("@")[0] || "Éducateur",
    photoURL: user.user_metadata?.avatar_url || user.user_metadata?.photoURL || null
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"visualizer" | "logs" | "apikey" | "docs">("visualizer");
  const [activePage, setActivePage] = useState<"landing" | "app" | "login" | "register">("landing");
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  
  // Admin Gateway Authentication state values
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);

  // Input & Advanced Option States
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [options, setOptions] = useState<HumanizeOptions>({
    profile: "academic", // Default to Scholarly Academic
    creativity: "medium",
    readability: "standard",
    gradeLevelTarget: "auto",
    stripClichés: true,
    preserveFormatting: true,
    bulletToNarrative: false,
    plagiarismSafeguard: true, // Safeguard citations and references by default
  });

  // Action / State Management
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Export & Workspace Platform State Values
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState<boolean>(false);
  const [isExportingToDocs, setIsExportingToDocs] = useState<boolean>(false);
  const [googleUser, setGoogleUser] = useState<any | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [firebaseConfigured, setFirebaseConfigured] = useState<boolean>(false);
  const [showWordDiff, setShowWordDiff] = useState<boolean>(true);
  
  // History and Sophisticated Metrics State
  const [history, setHistory] = useState<HumanizeHistoryItem[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<{
    originalWords: number;
    humanizedWords: number;
    roboticScoreBefore: number;
    roboticScoreAfter: number;
    clichésRemoved: number;
    detectedClichés: string[];
    perplexityIndex: number;
    burstinessIndex: number;
    gradeLevelCalculated: string;
    safeguardPassed: boolean;
    sentencePairs?: { original: string; humanized: string }[];
  } | null>(null);

  // System Logs State
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([
    {
      id: "log-1",
      timestamp: new Date().toLocaleTimeString(),
      type: "info",
      message: "Démarrage complet de la passerelle éducative HumanFlow Architect.",
      details: "Proxys complets de révision de textes académiques et universitaires prêts sur le port 3000."
    },
    {
      id: "log-2",
      timestamp: new Date().toLocaleTimeString(),
      type: "info",
      message: "Sandbox de sécurité et niveau de cryptage activés.",
      details: "Bouclier d'intégrité académique certifié. Citations, nombres et citations directes isolés."
    }
  ]);

  // Request/Response inspection states
  const [lastRequestPayload, setLastRequestPayload] = useState<any>(null);
  const [lastResponsePayload, setLastResponsePayload] = useState<any>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Load History on mount, check API key health
  useEffect(() => {

    addLog("info", "Interrogation de la santé de l'intégration du backend sécurisé...", "GET /api/health");
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setApiKeyConfigured(data.apiKeyConfigured);
          if (data.apiKeyConfigured) {
            addLog("success", "Backend en ligne. Client API développeur Gemini approuvé.", "Autorisé à analyser les soumissions universitaires.");
          } else {
            addLog("error", "Serveur Vite actif mais GEMINI_API_KEY est manquante.", "Veuillez définir GEMINI_API_KEY dans l'espace Paramètres > Secrets.");
          }
        } else {
          setApiKeyConfigured(false);
          addLog("error", "Réponse inattendue de l'endpoint de santé du backend", JSON.stringify(data));
        }
      })
      .catch((err) => {
        console.error("Health ping error:", err);
        setApiKeyConfigured(false);
        addLog("error", "Service backend Express hors-ligne. Échec de la liaison au port 3000.", err.message);
      });

    // Check if Google workspace configuration exists
    ensureFirebaseInitialized().then(configured => {
      setFirebaseConfigured(configured);
      if (configured) {
        addLog("info", "Client base de données Google Workspace connecté.", "Prêt à télécharger les révisions natives sous Google Docs.");
      }
    });

    // Recover Supabase User Auth State dynamically
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const mapped = mapSupabaseUser(session.user);
        setCurrentUser(mapped);
        addLog("success", `Session active récupérée pour ${mapped.email}.`, "Connexion authentifiée sécurisée.");
        if (mapped.email?.toLowerCase() === "abdelilahdahou7@gmail.com") {
          setIsAdminAuthenticated(true);
          addLog("success", "Autorisation administrative récupérée automatiquement depuis la session.", "Consoles système accessibles.");
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const mapped = mapSupabaseUser(session.user);
        setCurrentUser(mapped);
        if (mapped.email?.toLowerCase() === "abdelilahdahou7@gmail.com") {
          setIsAdminAuthenticated(true);
        }
      } else {
        setCurrentUser(null);
        setIsAdminAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load history from Supabase if user is logged in, fallback to localStorage
  useEffect(() => {
    if (currentUser?.id) {
      addLog("info", "Synchronisation de l'historique avec Supabase...", `Utilisateur ID: ${currentUser.id}`);
      supabase
        .from("user_history")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(20)
        .then(({ data, error }) => {
          if (error) {
            console.error("Failed to fetch history from Supabase:", error);
            addLog("error", "Échec de récupération de l'historique depuis Supabase.", error.message);
          } else if (data) {
            const mappedHistory: HumanizeHistoryItem[] = data.map((item: any) => ({
              id: item.id,
              timestamp: new Date(item.created_at).toLocaleString(),
              originalText: item.original_text,
              humanizedText: item.humanized_text,
              options: item.options,
              metrics: item.metrics
            }));
            setHistory(mappedHistory);
            addLog("success", `Historique synchronisé. ${mappedHistory.length} éléments récupérés depuis Supabase.`);
          }
        });
    } else {
      // Local fallback for guest users
      const saved = localStorage.getItem("professor_humanizer_history");
      if (saved) {
        try {
          setHistory(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse history from localStorage", e);
        }
      } else {
        setHistory([]);
      }
    }
  }, [currentUser]);

  // Helper function to append to terminal trace logs
  const addLog = (type: SystemLog["type"], message: string, details?: string) => {
    const newLog: SystemLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      details
    };
    setSystemLogs(prev => [...prev, newLog]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [systemLogs]);

  // Global administrative shortcut key binding listener (Ctrl + X)
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "x") {
        e.preventDefault();
        setShowAdminModal(prev => !prev);
        addLog("info", "Raccourci administrateur déclenché", "Sequence clavier [Ctrl+X / Cmd+X] détectée. Affichage des panneaux de contrôle.");
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      setCurrentUser(null);
      setIsAdminAuthenticated(false);
      setActivePage("landing");
      addLog("success", "La session de connexion active a été purgée avec succès des systèmes.");
    } catch (err: any) {
      addLog("error", "Échec de la transmission de déconnexion.", err.message || "Erreur de session.");
    }
  };

  // Trigger Humanize API
  const handleHumanize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentUser) {
      setError("Portail d'authentification : Veuillez vous connecter ou créer un compte éducateur pour utiliser le compilateur de traitement de texte.");
      addLog("error", "Exécution de la transformation bloquée.", "L'utilisateur n'est pas connecté. Veuillez vous connecter pour appeler l'API.");
      return;
    }
    if (!inputText.trim()) {
      setError("Veuillez fournir un contenu initial de brouillon à analyser.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLatency(null);

    const startTime = Date.now();
    const payload = {
      text: inputText,
      options: options
    };

    setLastRequestPayload(payload);
    addLog("request", `Lancement de la transformation : mode ${options.profile}`, `POST /api/transform\n${JSON.stringify({ ...payload, text: payload.text.substring(0, 60) + "..." }, null, 2)}`);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch("/api/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload)
      });

      const responseTime = Date.now() - startTime;
      setLatency(responseTime);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Le serveur a répondu avec le statut HTTP ${response.status}`);
      }

      const data = await response.json();
      setLastResponsePayload(data);
      setOutputText(data.humanizedText);
      setCurrentMetrics(data.metrics);
      
      addLog("success", `Peaufinage terminé en ${responseTime}ms. Rapport d'évaluation compilé.`, 
        `Score Robotique: ${data.metrics.roboticScoreBefore}% -> ${data.metrics.roboticScoreAfter}%\nIndex Perplexité: ${data.metrics.perplexityIndex}%\nNiveau Cible: ${data.metrics.gradeLevelCalculated}`
      );

      // Save complete object to history
      const newHistoryItem: HumanizeHistoryItem = {
        id: `history-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        originalText: inputText,
        humanizedText: data.humanizedText,
        options: { ...options },
        metrics: {
          originalWords: data.metrics.originalWords,
          humanizedWords: data.metrics.humanizedWords,
          roboticScoreBefore: data.metrics.roboticScoreBefore,
          roboticScoreAfter: data.metrics.roboticScoreAfter,
          clichésRemoved: data.metrics.clichésRemoved,
          perplexityIndex: data.metrics.perplexityIndex,
          burstinessIndex: data.metrics.burstinessIndex,
          gradeLevelCalculated: data.metrics.gradeLevelCalculated,
          safeguardPassed: data.metrics.safeguardPassed,
          detectedClichés: data.metrics.detectedClichés,
          sentencePairs: data.metrics.sentencePairs
        }
      };

      if (currentUser?.id) {
        addLog("info", "Enregistrement de la révision dans la base Supabase...");
        supabase
          .from("user_history")
          .insert({
            user_id: currentUser.id,
            original_text: inputText,
            humanized_text: data.humanizedText,
            options: { ...options },
            metrics: newHistoryItem.metrics
          })
          .select()
          .then(({ data: insertData, error }) => {
            if (error) {
              console.error("Failed to save history to Supabase:", error);
              addLog("error", "Impossible de sauvegarder la révision dans Supabase.", error.message);
            } else if (insertData && insertData[0]) {
              const savedItem: HumanizeHistoryItem = {
                id: insertData[0].id,
                timestamp: new Date(insertData[0].created_at).toLocaleString(),
                originalText: insertData[0].original_text,
                humanizedText: insertData[0].humanized_text,
                options: insertData[0].options,
                metrics: insertData[0].metrics
              };
              setHistory(prev => [savedItem, ...prev].slice(0, 20));
              addLog("success", "Révision enregistrée dans Supabase.");
            }
          });
      } else {
        const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
        setHistory(updatedHistory);
        localStorage.setItem("professor_humanizer_history", JSON.stringify(updatedHistory));
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "L'humanisation académique a échoué. Vérifiez que la clé API des secrets est en ligne.");
      addLog("error", "Échec de l'humanisation", err.message || "Erreur inattendue du proxy.");
    } finally {
      setIsLoading(false);
    }
  };

  // Restore session state from logs
  const handleSelectHistoryItem = (item: HumanizeHistoryItem) => {
    setInputText(item.originalText);
    setOutputText(item.humanizedText);
    setOptions(item.options);
    setCurrentMetrics({
      originalWords: item.metrics.originalWords,
      humanizedWords: item.metrics.humanizedWords,
      roboticScoreBefore: item.metrics.roboticScoreBefore,
      roboticScoreAfter: item.metrics.roboticScoreAfter,
      clichésRemoved: item.metrics.clichésRemoved,
      detectedClichés: item.metrics.detectedClichés || [],
      perplexityIndex: item.metrics.perplexityIndex || 85,
      burstinessIndex: item.metrics.burstinessIndex || 80,
      gradeLevelCalculated: item.metrics.gradeLevelCalculated || "Diplôme de licence",
      safeguardPassed: item.metrics.safeguardPassed !== false,
      sentencePairs: item.metrics.sentencePairs
    });
    addLog("info", `Restauration de l'instantané depuis les archives éducateurs : ${item.id}`, `Profil Cible: ${item.options.profile}`);
  };

  const handleClearHistory = async () => {
    if (currentUser?.id) {
      addLog("info", "Suppression de l'historique dans Supabase...");
      const { error } = await supabase
        .from("user_history")
        .delete()
        .eq("user_id", currentUser.id);
      
      if (error) {
        console.error("Failed to clear history from Supabase:", error);
        addLog("error", "Impossible d'effacer l'historique sur Supabase.", error.message);
      } else {
        setHistory([]);
        addLog("success", "Historique Supabase entièrement effacé.");
      }
    } else {
      setHistory([]);
      localStorage.removeItem("professor_humanizer_history");
      addLog("info", "Historique de l'éducateur local entièrement effacé.");
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    addLog("info", "Copie réussie. Prose académique copiée dans le presse-papiers.");
    setTimeout(() => setCopied(false), 2000);
  };

  const loadPreset = (preset: PresetExample) => {
    setInputText(preset.text);
    setError(null);
    addLog("info", `Modèle de brouillon chargé : "${preset.title}"`, `Mode: ${preset.category}`);
  };

  const handleClearInput = () => {
    setInputText("");
    setOutputText("");
    setCurrentMetrics(null);
    setError(null);
    addLog("info", "Espace de travail réinitialisé. Prêt pour l'analyse suivante.");
  };

  // Trigger quick Export of primary output area to Academic Markdown
  const handleExportActiveMarkdown = () => {
    if(!outputText) return;
    const itemText = `# Journal de Révision Académique
Date: ${new Date().toLocaleString()}
Mots Originaux: ${inputText.split(/\s+/).filter(w => w.length > 0).length} | Mots Humanisés: ${outputText.split(/\s+/).filter(w => w.length > 0).length}
Niveau Cible: ${currentMetrics?.gradeLevelCalculated || "Licence"}

## Brouillon original de l'IA:
${inputText}

## Copie universitaire peaufinée:
${outputText}
`;
    const blob = new Blob([itemText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `brouillon_academique_peaufine.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog("info", "Brouillon actif exporté sous forme de document Markdown académique (.md).");
  };

  const handleExportToWordFile = () => {
    if (!outputText) return;
    try {
      exportToWord(inputText, outputText, currentMetrics, options);
      addLog("success", "Brouillon actif formaté et téléchargé avec succès sous forme de document Microsoft Word (.doc).");
    } catch (err: any) {
      console.error(err);
      addLog("error", "Échec de génération de l'export de document Word.", err.message);
    }
  };

  const handleExportToGoogleDocsFile = async () => {
    if (!outputText) return;
    
    setIsExportingToDocs(true);
    addLog("info", "Initiation d'une connexion sécurisée à Google Workspace...", "Demande de droit de création de document Drive.");

    try {
      let accessToken = googleToken;
      
      // Check if we are configured
      const active = await ensureFirebaseInitialized();
      if (!active) {
        addLog("info", "Lancement du flux de provisionnement des identifiants Google Workspace...");
        // Call the setup oauth tool in this flow later
        throw new Error("Identifiants Google Workspace non configurés. Veuillez d'abord terminer la configuration de l'API via le portail d'administration.");
      }
      
      // If we don't have token already, sign in
      if (!accessToken) {
        addLog("info", "Lancement du portail de validation sécurisé Google OAuth...");
        const result = await signInWithGoogleDocsScope();
        if (result) {
          setGoogleUser(result.user);
          setGoogleToken(result.token);
          accessToken = result.token;
          addLog("success", `Google session validée. Connecté en tant que ${result.user.email || 'Auteur'}`);
        } else {
          throw new Error("Autorisation annulée ou rejetée par le titulaire du compte.");
        }
      }

      if (!accessToken) {
        throw new Error("Aucun jeton d'autorisation Google actif n'a été trouvé.");
      }

      addLog("info", "Génération de la mise en page académique et compilation des charges Office...", "Génération du contenu HTML");

      // Build metadata row as clean HTML Table
      const docTitle = `Revision - HumanFlow Architect (${options.profile.toUpperCase()})`;
      const metadataHtml = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <th style="border: 1.5px solid #cbd5e1; padding: 6px 10px; background: #f8fafc; text-align: left; font-size: 9.5pt; font-family: Arial;">Audit Timestamp</th>
            <td style="border: 1.5px solid #cbd5e1; padding: 6px 10px; font-size: 9.5pt; font-family: Arial;">${new Date().toLocaleString()}</td>
            <th style="border: 1.5px solid #cbd5e1; padding: 6px 10px; background: #f8fafc; text-align: left; font-size: 9.5pt; font-family: Arial;">Tone Profile Target</th>
            <td style="border: 1.5px solid #cbd5e1; padding: 6px 10px; text-transform: capitalize; font-size: 9.5pt; font-family: Arial;">${options.profile.replace(/_/g, ' ')}</td>
          </tr>
          <tr>
            <th style="border: 1.5px solid #cbd5e1; padding: 6px 10px; background: #f8fafc; text-align: left; font-size: 9.5pt; font-family: Arial;">AI Reduction</th>
            <td style="border: 1.5px solid #cbd5e1; padding: 6px 10px; color: #10b981; font-weight: bold; font-size: 9.5pt; font-family: Arial;">
              -${(currentMetrics?.roboticScoreBefore || 100) - (currentMetrics?.roboticScoreAfter || 15)}% Reduction
            </td>
            <th style="border: 1.5px solid #cbd5e1; padding: 6px 10px; background: #f8fafc; text-align: left; font-size: 9.5pt; font-family: Arial;">Linguistic Complexity</th>
            <td style="border: 1.5px solid #cbd5e1; padding: 6px 10px; font-size: 9.5pt; font-family: Arial;">${currentMetrics?.gradeLevelCalculated || "Undergraduate Degree"}</td>
          </tr>
        </table>
      `;

      let comparativeHtml = "";
      if (currentMetrics?.sentencePairs && currentMetrics.sentencePairs.length > 0) {
        const rows = currentMetrics.sentencePairs.map((pair, idx) => `
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px; font-size: 9.5pt; font-family: 'Times New Roman'; color: #666; vertical-align: top;"><strong>[#${idx + 1}]</strong> ${pair.original}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; font-size: 9.5pt; font-family: 'Times New Roman'; color: #111; vertical-align: top;"><strong>[#${idx + 1}]</strong> ${pair.humanized}</td>
          </tr>
        `).join("");

        comparativeHtml = `
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f1f5f9; font-weight: bold;">
                <th style="border: 1.5px solid #cbd5e1; padding: 8px; font-family: Arial; font-size: 10pt; text-align: left;">Original Draft</th>
                <th style="border: 1.5px solid #cbd5e1; padding: 8px; font-family: Arial; font-size: 10pt; text-align: left;">Humanized Revision</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        `;
      }

      const fullHtml = generateAcademicDocHtml(
        "Régulation finale et prose universitaire — HumanFlow Architect",
        metadataHtml,
        inputText,
        outputText,
        comparativeHtml
      );

      addLog("info", "Transmission des données à Google Drive et conversion au format Google Docs...", "POST https://www.googleapis.com/upload/drive/v3/files");
      
      const fileId = await uploadToGoogleDocs(accessToken, docTitle, fullHtml);
      
      addLog("success", "Le document Google Doc a été créé avec succès !", `Ouverture du fichier avec l'ID : ${fileId}`);
      
      // Open the document in a new tab
      window.open(`https://docs.google.com/document/d/${fileId}/edit`, "_blank");
      
    } catch (err: any) {
      console.error(err);
      addLog("error", "L'envoi vers Google Docs a échoué.", err.message || "Échec d'autorisation.");
      setError(err.message || "Impossible de créer le Google Doc. Veuillez vérifier les autorisations OAuth.");
    } finally {
      setIsExportingToDocs(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col antialiased">
      {/* Permanent, elegant adaptive Navbar wrapper */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        handleLogout={handleLogout}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminClick={() => setShowAdminModal(true)}
        onLockAdmin={() => {
          setIsAdminAuthenticated(false);
          setActiveTab("visualizer");
          addLog("info", "Admin workspace locked.", "Credential panels and consoles successfully secured.");
        }}
      />

      {/* Conditional Route Views rendering */}
      {activePage === "landing" && (
        <LandingPage
          setActivePage={setActivePage}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
        />
      )}

      {activePage === "login" && (
        <LoginView
          setActivePage={setActivePage}
          setCurrentUser={setCurrentUser}
          setIsAdminAuthenticated={setIsAdminAuthenticated}
          addLog={addLog}
        />
      )}

      {activePage === "register" && (
        <RegisterView
          setActivePage={setActivePage}
          setCurrentUser={setCurrentUser}
          addLog={addLog}
        />
      )}

      {activePage === "app" && (
        <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* TAB 1: SCHOLARLY WORKSPACE EDITOR */}
        {activeTab === "visualizer" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* TIER 1: THE FRONTEND INTERFACE (Left Column - 7 spans) */}
            <section className="lg:col-span-7 flex flex-col gap-5">
              
              {/* Header Title Bar */}
              <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 font-display">
                    Espace de travail universitaire interactif
                  </h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-mono">Statut du Sandbox :</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-bold rounded-sm uppercase tracking-wider border border-emerald-100 font-mono">
                    EN LIGNE
                  </span>
                </div>
              </div>

              {/* Sample Draft picker */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <List className="w-3.5 h-3.5 text-indigo-500" />
                    Charger des brouillons ou rédactions robotiques d'étudiants
                  </label>
                  <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">Modèles d'IA prêts à l'emploi</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {PRESET_EXAMPLES.map((example) => (
                    <button
                      key={example.id}
                      id={`preset-btn-${example.id}`}
                      onClick={() => loadPreset(example)}
                      className="text-left px-3 py-2 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 border border-slate-200 rounded-xl transition-all cursor-pointer text-xs"
                      title={example.description}
                    >
                      <span className="font-semibold text-slate-700 block truncate">{example.title}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5 block truncate">{example.category}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Workspace inputs */}
              <div className="flex flex-col gap-4">
                
                {/* Text Input Block */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 flex flex-col relative">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      Zone d'écriture pour modèles IA robotiques
                    </label>
                    {inputText && (
                      <button
                        onClick={handleClearInput}
                        className="text-xs text-slate-400 hover:text-rose-500 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Réinitialiser
                      </button>
                    )}
                  </div>
                  
                  <textarea
                    id="input-text-area"
                    className="w-full h-44 bg-slate-50/70 border border-slate-200 rounded-2xl p-4 text-xs lg:text-sm text-slate-800 leading-relaxed font-sans focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
                    placeholder="Collez des paragraphes de brouillon non polis, des rédactions robotiques d'étudiants ou des plans de référence..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 px-1">
                    <span>
                      Mots : <strong className="text-slate-600">{inputText.split(/\s+/).filter(w => w.length > 0).length}</strong>
                    </span>
                    <span>Prend en charge les résumés de recherche ou pages de couverture</span>
                  </div>
                </div>

                {/* Secure Parameter Tool Module */}
                <OptionSelector options={options} setOptions={setOptions} />

                {/* API Action button */}
                {!currentUser ? (
                  <div className="relative flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-3xl shadow-xs mt-3 select-none text-center animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-2">
                      <Lock className="w-5 h-5 animate-pulse" />
                    </div>
                    <h4 className="font-display font-bold text-sm text-slate-800">Passerelle éducateurs verrouillée</h4>
                    <p className="text-[11px] text-slate-500 max-w-sm mt-1 leading-normal">
                      Vous devez vous connecter à un compte universitaire ou de chercheur pour accéder aux modèles de traitement de texte de pointe.
                    </p>
                    <div className="flex gap-2.5 mt-4 w-full max-w-xs justify-center">
                      <button
                        onClick={() => setActivePage("login")}
                        className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        Se connecter
                      </button>
                      <button
                        onClick={() => setActivePage("register")}
                        className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        S'inscrire gratuitement
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex justify-center items-center py-2.5">
                    <div className="absolute w-full border-t border-dashed border-slate-300"></div>
                    <button
                      id="transform-text-btn"
                      onClick={() => handleHumanize()}
                      disabled={isLoading || !inputText.trim()}
                      className={`relative z-10 font-display font-medium text-xs lg:text-sm px-8 py-3.5 rounded-full shadow-lg flex items-center gap-2.5 transition-all group scale-100 hover:scale-102 cursor-pointer ${
                        isLoading
                          ? "bg-slate-700 text-slate-400 cursor-not-allowed shadow-none"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-150"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Régulation du rythme syntaxique / Préservation des citations...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-yellow-300 group-hover:animate-bounce" />
                          <span>Humaniser la prose et auditer l'intégrité</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-4 flex items-start gap-3 animate-headshake">
                    <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-xs uppercase tracking-wider mb-1">Exception d'autorisation</h4>
                      <p className="text-xs leading-normal">{error}</p>
                      {error.includes("key") && (
                        <button 
                          onClick={() => {
                            if (isAdminAuthenticated) {
                              setActiveTab("apikey");
                            } else {
                              setShowAdminModal(true);
                            }
                          }}
                          className="mt-2 text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5" /> Charger le panneau des secrets
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Humanized Output Copy block */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 flex flex-col relative min-h-[16rem]">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Régulation finale et prose universitaire
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Premium Local Microsoft Word Button */}
                      <button
                        title="Télécharger directement en tant que document Microsoft Word (.doc)"
                        onClick={handleExportToWordFile}
                        disabled={!outputText}
                        className={`p-1.5 px-3 rounded-lg border transition-all text-xs flex items-center gap-1.5 shrink-0 font-semibold ${
                          !outputText 
                            ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" 
                            : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer shadow-xs"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Télécharger Word (.doc)</span>
                        <span className="sm:hidden">Télécharger Word</span>
                      </button>

                      {/* Google Docs Cloud Upload Button */}
                      <button
                        title="Exporter directement vers votre compte Google Docs"
                        onClick={handleExportToGoogleDocsFile}
                        disabled={!outputText || isExportingToDocs}
                        className={`p-1.5 px-3 rounded-lg border transition-all text-xs flex items-center gap-1.5 shrink-0 font-semibold ${
                          !outputText 
                            ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" 
                            : isExportingToDocs
                            ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-emerald-50 text-emerald-800 border-emerald-250 hover:bg-emerald-100 cursor-pointer shadow-xs"
                        }`}
                      >
                        {isExportingToDocs ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Exportation...</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Enregistrer Google Docs</span>
                            <span className="sm:hidden">Google Docs</span>
                          </>
                        )}
                      </button>

                      {/* Copier / Copy Button */}
                      <button
                        id="copy-to-clipboard-btn"
                        onClick={handleCopy}
                        disabled={!outputText}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 shrink-0 font-semibold ${
                          !outputText
                            ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                            : copied
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold"
                            : "bg-indigo-50 text-indigo-700 border-indigo-150 hover:bg-indigo-100 cursor-pointer shadow-xs"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Texte copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Copier la prose</span>
                            <span className="sm:hidden">Copier</span>
                          </>
                        )}
                      </button>

                      {/* Dropdown for secondary formats like Markdown */}
                      <div className="relative">
                        <button
                          title="Plus d'options d'exportation"
                          onClick={() => {
                            if (!outputText) return;
                            setIsExportDropdownOpen(!isExportDropdownOpen);
                          }}
                          disabled={!outputText}
                          className={`p-1.5 px-2 rounded-lg border transition-all text-xs flex items-center justify-center shrink-0 ${
                            !outputText 
                              ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" 
                              : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 cursor-pointer"
                          }`}
                        >
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExportDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isExportDropdownOpen && outputText && (
                          <>
                            {/* Overlay to dismiss dropdown */}
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setIsExportDropdownOpen(false)}
                            />
                            
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1.5 text-xs animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                              <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Autres formats
                              </div>
                              <button
                                onClick={() => {
                                  setIsExportDropdownOpen(false);
                                  handleExportActiveMarkdown();
                                }}
                                className="w-full text-left px-3 py-2.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700 transition-colors"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-400" />
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-800">Markdown (.md)</span>
                                  <span className="text-[9px] text-slate-400">Fichier local au format Markdown</span>
                                </div>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
                        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border border-dashed border-indigo-200 animate-pulse"></div>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        Proxy server negotiating with Gemini API core...
                      </span>
                    </div>
                  ) : outputText ? (
                    <div className="flex-1 bg-slate-50/40 border border-slate-200 rounded-2xl p-4 text-xs lg:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap select-text">
                      {outputText}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-slate-300 bg-slate-50/30 border border-dashed border-slate-200/50 rounded-2xl p-6">
                      <Activity className="w-9 h-9 text-slate-200 mb-2" />
                      <p className="text-xs font-semibold text-slate-400">Scholarly Output Area Pending</p>
                      <p className="text-[10px] text-slate-400 max-w-xs mt-1">Configure options and trigger 'Humanize' above to route polished prose here</p>
                    </div>
                  )}

                  {currentMetrics && !isLoading && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-4 md:gap-8 bg-slate-50/40 p-3 rounded-xl flex-wrap">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-450 uppercase font-mono tracking-wider font-semibold">Vocabulary Target</span>
                        <span className="text-xs font-bold text-slate-700 capitalize">
                          {options.readability} Level
                        </span>
                      </div>
                      <div className="flex flex-col border-l border-slate-200 pl-4 lg:pl-8">
                        <span className="text-[9px] text-slate-450 uppercase font-mono tracking-wider font-semibold">Turnitin/AI Footprint Reduction</span>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <TrendingDown className="w-4 h-4" />
                          -{currentMetrics.roboticScoreBefore - currentMetrics.roboticScoreAfter}% Probable
                        </span>
                      </div>
                      <div className="flex flex-col border-l border-slate-200 pl-4 lg:pl-8 ml-auto">
                        <span className="text-[9px] text-slate-450 uppercase font-mono tracking-wider font-semibold">Academic Setting</span>
                        <span className="text-xs font-bold text-indigo-700 capitalize">
                          {options.profile.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* SENTENCE COMPARATIVE DIFF INSPECTOR */}
                {currentMetrics?.sentencePairs && currentMetrics.sentencePairs.length > 0 && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4" id="sentence-comparative-diff">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
                        <div>
                          <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wide">Comparatif de Phrases pour Éducateurs</h4>
                          <p className="text-[10px] text-slate-400 font-sans">Vérifiez les altérations syntaxiques et la précision lexicale segment par segment</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Beautiful styled Toggle Switch */}
                        <div className="flex items-center gap-2">
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={showWordDiff}
                              onChange={(e) => setShowWordDiff(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                            <span className="ml-2 text-[11px] font-semibold text-slate-600">Surligner les mots spécifiques</span>
                          </label>
                        </div>
                        <span className="text-[9px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2 py-1 rounded border border-indigo-100 uppercase tracking-widest whitespace-nowrap">
                          {currentMetrics.sentencePairs.length} segments alignés
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs max-h-80 overflow-y-auto pr-1">
                      {/* Headers */}
                      <div className="hidden md:block font-bold text-slate-500 uppercase tracking-wider text-[10px] pl-2">
                        Structure robotique originale (Friction IA)
                      </div>
                      <div className="hidden md:block font-bold text-indigo-600 uppercase tracking-wider text-[10px] pl-2">
                        Révision stylistique humanisée
                      </div>

                      {currentMetrics.sentencePairs.map((pair, index) => {
                        const { originalEl, humanizedEl } = renderDiffText(pair.original, pair.humanized, showWordDiff);
                        return (
                          <React.Fragment key={index}>
                            <div className="bg-white border border-slate-150 p-3 rounded-xl flex flex-col gap-1.5 relative group hover:border-slate-350 transition-colors">
                              <span className="text-[9px] font-mono font-bold text-slate-300 absolute top-2 right-2">
                                #{index + 1}
                              </span>
                              <div className="text-[12px] text-slate-500 pr-5 leading-relaxed font-sans select-text">
                                {originalEl}
                              </div>
                            </div>
                            <div className="bg-indigo-50/15 border border-indigo-100/40 p-3 rounded-xl flex flex-col gap-1.5 relative group hover:border-indigo-200/50 transition-colors">
                              <span className="text-[9px] font-mono font-bold text-indigo-500/50 absolute top-2 right-2">
                                #{index + 1}
                              </span>
                              <div className="text-[12px] text-slate-850 pr-5 leading-relaxed font-sans select-text">
                                {humanizedEl}
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stored History Logs under Cabinets */}
                <HistoryPanel 
                  history={history} 
                  onSelectItem={handleSelectHistoryItem} 
                  onClearHistory={handleClearHistory} 
                />

              </div>
            </section>

            {/* ARCHITECTURE RIGHT SIDEBAR */}
            <section className="lg:col-span-5 flex flex-col gap-6">

              {/* Sophisticated Academic Dashboard Analyzer */}
              {currentMetrics ? (
                <MetricDisplay metrics={currentMetrics} />
              ) : (
                <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center shadow-xs flex flex-col items-center justify-center py-10">
                  <BookOpen className="w-8 h-8 text-slate-300 mb-2.5 animate-bounce" />
                  <h4 className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Panneau de Métriques</h4>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-normal">Les calibrateurs linguistiques, les plages de perplexité et la répartition des niveaux scolaires cibles s'affichent ici après transformation</p>
                </div>
              )}

            </section>

          </div>
        )}

        {/* TAB 2: DETAILED TRACE CONSOLES & SECURE ARCHITECTURE */}
        {activeTab === "logs" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Live Telemetry Log Panel */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 lg:p-8 flex flex-col gap-6 shadow-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Terminal className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-display font-medium text-white text-lg tracking-tight">Console de Télémétrie Éducative</h2>
                    <p className="text-slate-400 text-xs font-sans">Suivi de télémétrie en direct auditant les flux de requêtes HTTP et les métriques linguistiques du serveur</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSystemLogs([])}
                  className="text-xs text-slate-400 hover:text-rose-400 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
                >
                  <Trash2 className="w-4 h-4" /> Effacer la console
                </button>
              </div>

              {/* Terminal Interface */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 font-mono text-xs text-slate-250 h-96 overflow-y-auto space-y-4">
                {systemLogs.length === 0 ? (
                  <div className="text-center py-20 text-slate-600 italic">
                    Console terminal vide. Les événements de transformation s'afficheront ici en direct.
                  </div>
                ) : (
                  systemLogs.map((log) => {
                    const typeColors = {
                      info: "text-slate-400",
                      request: "text-amber-400 font-bold",
                      success: "text-emerald-400 font-bold",
                      error: "text-rose-400 font-bold bg-rose-950/20 px-2.5 py-1 rounded"
                    };

                    return (
                      <div key={log.id} className="border-b border-slate-900/40 pb-3.5 flex items-start gap-3.5">
                        <span className="text-indigo-400 font-medium shrink-0">[{log.timestamp}]</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`uppercase text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-bold tracking-wider shrink-0 ${typeColors[log.type]}`}>
                              {log.type}
                            </span>
                            <span className="text-slate-200 font-sans tracking-wide leading-relaxed">{log.message}</span>
                          </div>
                          {log.details && (
                            <pre className="text-[10px] text-slate-400 mt-2 bg-slate-900/40 p-3 rounded-lg border border-slate-900 overflow-x-auto whitespace-pre-wrap leading-relaxed max-w-full">
                              {log.details}
                            </pre>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={logsEndRef} />
              </div>

              <div className="bg-slate-800/20 border border-slate-800 rounded-2xl p-4 flex gap-3 text-xs text-slate-400 items-start">
                <Info className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1 block">
                  <span className="font-semibold text-slate-200 block">Principe d'Isolation du Proxy Serveur</span>
                  <span>
                    Chaque transaction émise via le Tier 1 s'exécute en toute sécurité sur le Tier 2 via Node.js. Le navigateur client n'a absolument aucune exposition aux clés de modélisation ou d'authentification tierces, empêchant l'extraction frauduleuse ou l'empoisonnement de prompts.
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: Infrastructure Tiers (Tier 2 & Tier 3 visualizers) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* TIER 2: NODE.JS API SERVER VISUALIZER */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-display">
                    Tier 2 : Couche de Sécurité Node.js Express
                  </h2>
                  <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-300 text-[9px] font-bold rounded border border-indigo-500/30 uppercase font-mono">
                    Isolation par Proxy
                  </span>
                </div>

                <div className="bg-slate-950 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col gap-4 border border-slate-800/80">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-400 pointer-events-none">
                    <Database className="w-20 h-20" />
                  </div>

                  <div className="flex items-start gap-4 pb-2.5 border-b border-slate-800/60">
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center shrink-0">
                      <code className="text-pink-450 font-bold text-xs font-mono">POST</code>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-mono text-indigo-300 font-semibold truncate">
                        /api/transform
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-sans leading-relaxed">
                        Gère les variables d'environnement sécurisées, filtre l'empreinte artificielle, valide la structure des phrases et garantit zéro fuite de clés côté client.
                      </p>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-3 pb-1 text-xs">
                    <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-850 flex flex-col">
                      <span className="text-[9px] uppercase text-slate-500 font-bold font-mono tracking-wider">Statut Clé Gemini</span>
                      <span className="text-emerald-400 font-mono font-semibold mt-1 flex items-center gap-1 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" /> SECURE_SSL
                      </span>
                    </div>
                    <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-850 flex flex-col">
                      <span className="text-[9px] uppercase text-slate-500 font-bold font-mono tracking-wider">Storage Stockage</span>
                      <span className="text-indigo-300 font-mono mt-1 text-[11px] font-semibold">
                        LOCAL + CACHE
                      </span>
                    </div>
                  </div>

                  {/* Sandbox code Trace inspection logs */}
                  <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-850/80 font-mono text-[10px] text-slate-300 flex flex-col gap-2">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                      <span>Inspecteur de Requêtes</span>
                      <span className="text-indigo-400">Trace active</span>
                    </div>
                    <div className="max-h-24 overflow-y-auto space-y-1 text-slate-400 scroller pr-1 leading-normal text-[9px]">
                      {lastRequestPayload ? (
                        <pre className="text-indigo-200 whitespace-pre-wrap">
                          {JSON.stringify(lastRequestPayload, null, 2)}
                        </pre>
                      ) : (
                        <div className="text-center py-3 text-slate-600 italic">
                          En attente d'une requête de transformation en direct...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* TIER 3: MODEL LIVE API CHANNELS */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-display">
                    Tier 3 : Moteur Applicatif du Modèle d'IA
                  </h2>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 text-[9px] font-bold rounded border border-emerald-500/20 uppercase font-mono">
                    Modèle Actif
                  </span>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 rounded-3xl p-5 flex flex-col gap-4 shadow-xs text-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-950/40 border border-indigo-900/30 rounded-xl flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs font-display tracking-tight">Gemini 3.5 Flash Client</h3>
                      <p className="text-[10px] font-mono text-indigo-400 font-semibold subtitle">models/gemini-3.5-flash</p>
                    </div>
                  </div>

                  {/* System instruction visual proof */}
                  <div className="bg-slate-905 rounded-xl p-3 border border-slate-850 flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-mono text-slate-500 font-bold">Consigne Système Injectée</span>
                    <p className="text-[10px] font-sans text-slate-300 leading-relaxed italic border-l-2 border-indigo-500 pl-2">
                      "Conserver à 100% l'exactitude factuelle, les citations d'origine et les références scientifiques. Varier la syntaxe pour imiter la littérature humaine..."
                    </p>
                  </div>

                  {/* Response visual progress bars */}
                  <div className="pt-1.5 flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400 font-bold uppercase">Temps de Réponse</span>
                      <span className="text-indigo-400 font-semibold">{latency ? `${latency} ms` : "Aucune requête"}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      {isLoading ? (
                        <div className="h-full bg-indigo-500 w-1/3 animate-ping"></div>
                      ) : latency ? (
                        <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, Math.max(20, (latency / 2000) * 100))}%` }}></div>
                      ) : (
                        <div className="h-full bg-transparent"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: CREDENTIALS SETUP */}
        {activeTab === "apikey" && (
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-xs flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-slate-800 text-lg tracking-tight">Identifiants et détails d'intégration</h2>
                <p className="text-slate-500 text-xs font-sans">Vérifier l'état d'activation des jetons et configurer les clés secrètes d'API</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Token status */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-slate-800 text-sm">Paramètres secrets actifs</h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200/60">
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-bold text-slate-700 block">GEMINI_API_KEY</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 text-ellipsis overflow-hidden">Injectée de manière sécurisée côté serveur</span>
                    </div>
                    <div>
                      {apiKeyConfigured === null ? (
                        <span className="text-[10px] text-slate-400 select-none">Vérification...</span>
                      ) : apiKeyConfigured ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200 uppercase font-mono">
                          Sécurisé
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded border border-rose-250 uppercase font-mono">
                          Absent
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200/60 font-sans">
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-bold text-slate-700 block">PROV_REGION</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Ingress Cloud Run Automatique</span>
                    </div>
                    <div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200 uppercase font-mono">
                        Actif
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl text-xs text-amber-800 leading-normal border border-amber-200/40 flex gap-2.5 items-start">
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1 block">
                    <span className="font-semibold text-amber-900 block font-sans">Exposition client nulle garantie</span>
                    <span>
                      Les secrets API ne sont jamais intégrés aux fichiers HTML ou JavaScript côté client. Ils résident exclusivement dans l'environnement proxy sécurisé de Google Cloud Run (Tier 2).
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-slate-800 text-sm">Configurer les secrets sur Google AI Studio</h3>
                <p className="text-xs text-slate-600 leading-normal">
                  Pour fournir votre clé d'API de développement ou mettre à jour les identifiants :
                </p>

                <ol className="text-xs text-slate-600 space-y-3 pl-4 list-decimal leading-relaxed">
                  <li>
                    Ouvrez l'onglet <strong className="text-slate-800 font-sans">Secrets et Clés</strong> dans le menu de configuration de la plateforme.
                  </li>
                  <li>
                    Créez un secret nommé précisément <code className="bg-slate-100 px-1 font-mono text-[11px] text-indigo-600 rounded">GEMINI_API_KEY</code>.
                  </li>
                  <li>
                    Collez votre clé API Gemini personnelle.
                  </li>
                  <li>
                    Enregistrez les modifications. L'environnement sera mis à jour de manière transparente.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PEDAGOGICAL GUIDE & RUBRIC */}
        {activeTab === "docs" && (
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-xs flex flex-col gap-6 font-sans">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-medium text-slate-800 text-lg tracking-tight">Rubrique Pédagogique et Guide de Méthodologie</h2>
                <p className="text-slate-500 text-xs">Comment l'outil calibre les indices d'écriture académique en toute intégrité</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-normal">
              
              <div className="space-y-3.5 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 font-semibold text-slate-855 text-sm">
                  <div className="w-1.5 h-6 bg-indigo-500 rounded-xs"></div>
                  1. Seuils de Perplexité
                </div>
                <p className="leading-relaxed">
                  La perplexité mesure l'imprévisibilité lexicale. Alors que les modèles génératifs standards choisissent des mots hautement prévisibles (faible perplexité de 20% à 50%), la prose humaine présente une grande diversité et des transitions riches (perplexité supérieure à 75%).
                </p>
              </div>

              <div className="space-y-3.5 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 font-semibold text-slate-855 text-sm">
                  <div className="w-1.5 h-6 bg-indigo-500 rounded-xs"></div>
                  2. Variabilité Syntaxique ("Burstiness")
                </div>
                <p className="leading-relaxed">
                  Cette variable mesure l'écart type de la longueur des phrases. La production artificielle a tendance à conserver des structures uniformes (14 à 18 mots par phrase). La littérature humaine se caractérise par des variations majeures — alternant phrases très courtes et longues descriptions complexes.
                </p>
              </div>

              <div className="space-y-3.5 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 font-semibold text-slate-855 text-sm">
                  <div className="w-1.5 h-6 bg-indigo-550 rounded-xs"></div>
                  3. Protection de l'Intégrité
                </div>
                <p className="leading-relaxed">
                  Le respect des chartes académiques exige que les citations ou formules scientifiques de l'utilisateur restent intactes. Lorsque le **Bouclier d'Intégrité** est actif, les dates, formules numériques, noms bibliographiques et textes entre guillemets sont totalement préservés.
                </p>
              </div>

            </div>
          </div>
        )}

      </main>
      )}

      {/* FOOTER */}
      <footer className="text-center py-6 text-[11px] text-slate-400 bg-white border-t border-slate-200 mt-auto">
        <p>© 2026 HumanFlow Architect. Développé pour les éditeurs académiques, les chercheurs et les rédacteurs professionnels.</p>
        <p className="mt-1 opacity-70">Application des normes de télémétrie zéro confiance et de cryptage AES TLS sur serveur proxy Node Express.</p>
      </footer>

      {/* ADMIN SECURE VAULT MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl relative animate-fade-in font-sans">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                <Lock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm tracking-tight">Passerelle Sécurisée Administrateur</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Saisissez les identifiants administratifs pour inspecter les journaux de transaction et ajuster les paramètres de l'API Gemini.
                </p>
              </div>
            </div>

            {currentUser?.email?.toLowerCase() === "abdelilahdahou7@gmail.com" ? (
              <div className="mt-5 space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                  <p className="text-xs font-semibold text-emerald-800">
                    Accès administrateur activé
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-1">
                    Connecté en tant que {currentUser.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAdminModal(false);
                    setActiveTab("logs");
                    addLog("info", "Accès au panneau d'administration.", "Session administrateur confirmée.");
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all"
                >
                  Accéder aux journaux système
                </button>
              </div>
            ) : (
              <div className="mt-5 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-center">
                <p className="text-xs font-semibold text-amber-800">
                  Accès restreint
                </p>
                <p className="text-[10px] text-amber-600 mt-1">
                  Les privilèges d'administration sont liés à votre compte Supabase.
                  Seul l'administrateur désigné peut accéder à ce panneau.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
