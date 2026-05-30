export interface PresetExample {
  id: string;
  title: string;
  category: string;
  text: string;
  description: string;
}

export const PRESET_EXAMPLES: PresetExample[] = [
  {
    id: "student-essay",
    title: "Brouillon de Thèse Étudiante",
    category: "Essai Académique",
    description: "Écriture étudiante extrêmement rigide, abusant de la voix passive et remplie de transitions typiques d'IA comme 'il va sans dire', 'il est crucial de noter' et des structures syntaxiques figées.",
    text: `Tout d'abord, il est exceptionnellement important de se pencher sur la nature multiforme des paramètres socio-économiques au sein des institutions éducatives modernes. Il va sans dire que les cadres pédagogiques jouent un rôle charnière dans le façonnement des réussites scolaires pour les individus de tous horizons. De plus, des analyses approfondies sont jugées hautement cruciales afin de démystifier complètement les subtilités des politiques d'allocation des ressources. Il est vital de noter d'ailleurs qu'une pléthore de paradigmes divers doit être méticuleusement examinée par le conseil. En conclusion, cette recherche témoigne du pouvoir transformateur des réformes scolaires systémiques, mettant en lumière des défis structurels clés.`
  },
  {
    id: "grant-proposal",
    title: "Résumé de Subvention de Recherche",
    category: "Proposition Scientifique",
    description: "Surchargé de jargon d'IA dithyrambique, de déclarations verbeuses et de mots à la mode répétitifs au lieu d'articuler un impact scientifique et une méthodologie spécifiques.",
    text: `Cette initiative de recherche de pointe exploite des cadres de biologie computationnelle de pointe pour débloquer des synergies majeures dans les modèles de séquençage génomique. Dans le paysage scientifique actuel en évolution rapide, il est vital d'utiliser des méthodologies robustes pour démystifier la façon dont les variations épigénétiques déclenchent des progressions cellulaires pathologiques. De plus, notre plateforme révolutionnaire ultime témoigne clairement de notre rôle de chef de file en tant que guide d'innovation. En élucidant des indices d'interaction génique sans précédent, ce projet hautement transformateur élèvera la compréhension scientifique, établissant un phare révolutionnaire de découverte collaborative.`
  },
  {
    id: "recommendation",
    title: "Brouillon de Lettre de Recommandation",
    category: "Référence Académique",
    description: "Manque de personnalité humaine ; ressemble à un modèle froid généré par IA sans illustrations réelles des qualités de l'étudiant.",
    text: `À qui de droit, je vous écris pour exprimer mon enthousiasme profond à l'égard des compétences académiques de Jean Dupont, qui constitue un candidat de choix pour votre programme de cycles supérieurs. Tout au long de son parcours professionnel et universitaire au sein de mon laboratoire, ses progrès constants ont témoigné de sa capacité à mener à bien des projets d'essais moléculaires complexes. De plus, il est important de préciser que Jean s'appuie sur des méthodologies scientifiques à fort impact pour obtenir des résultats de recherche robustes. C'est un modèle absolu de diligence et un excellent promoteur de synergie d'équipe.`
  },
  {
    id: "syllabus-draft",
    title: "Introduction au Programme de Cours",
    category: "Notes de Cours",
    description: "Description de cours stérile et excessivement formelle qui risque d'aliéner ou de désengager les étudiants de premier cycle.",
    text: `Bienvenue en Sociologie Avancée 401. Il est vital de noter que ce programme est méticuleusement conçu pour servir de guide complet pour votre parcours universitaire. Tout au long de ce cours, nous approfondirons une pléthore de paradigmes structurels pour démystifier des cadres socio-économiques complexes. De plus, il est important de se rappeler que les participations actives sont un prérequis fondamental pour débloquer le succès. Les devoirs hebdomadaires témoignent de votre capacité à analyser de manière critique les structures sociologiques existantes.`
  }
];
