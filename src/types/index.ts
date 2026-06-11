export type Tier =
  | "EcoGuardian"
  | "Aware Citizen"
  | "Average Impact"
  | "Heavy Footprint"
  | null;

export interface QuizAnswer {
  questionId: number; // 1-7
  selectedIndex: number; // 0-based
  kgValue: number; // CO₂ kg/yr for this answer
}

export interface UserFootprint {
  totalKg: number;
  tier: Tier;
  breakdown: QuizAnswer[];
}

export interface ActionItem {
  id: number;
  emoji: string;
  title: string;
  description: string;
  kgSavedPerYear: number;
  source: string; // citation for the CO₂ saving value
}

export interface QuizQuestion {
  id: number;
  question: string;
  answers: {
    text: string;
    kgPerYear: number;
  }[];
}

export interface GeminiResponse {
  analogies: [string, string, string];
  oneChange: string;
  hopeAnalogy: string;
}

export interface AppState {
  currentAct: number; // 1-5
  footprint: UserFootprint | null;
  geminiResponse: GeminiResponse | null;
  pledgedActions: number[]; // ActionItem ids
  geminiLoading: boolean;
  geminiError: boolean;
}
