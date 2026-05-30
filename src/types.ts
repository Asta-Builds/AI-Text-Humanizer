export type ToneProfileType = 
  | 'academic' 
  | 'grant_proposal' 
  | 'lecture_notes' 
  | 'recommendation' 
  | 'conversational' 
  | 'professional' 
  | 'creative' 
  | 'storyteller';

export interface HumanizeOptions {
  profile: ToneProfileType;
  creativity: 'low' | 'medium' | 'high';
  readability: 'simple' | 'standard' | 'advanced';
  gradeLevelTarget: 'high_school' | 'undergrad' | 'postgrad' | 'auto';
  stripClichés: boolean;
  preserveFormatting: boolean;
  bulletToNarrative: boolean;
  plagiarismSafeguard: boolean;
}

export interface SentencePair {
  original: string;
  humanized: string;
}

export interface HumanizeHistoryItem {
  id: string;
  timestamp: string;
  originalText: string;
  humanizedText: string;
  options: HumanizeOptions;
  metrics: {
    originalWords: number;
    humanizedWords: number;
    roboticScoreBefore: number;
    roboticScoreAfter: number;
    clichésRemoved: number;
    perplexityIndex: number;
    burstinessIndex: number;
    gradeLevelCalculated: string;
    safeguardPassed: boolean;
    detectedClichés: string[];
    sentencePairs?: SentencePair[];
  };
}
