export type ExtractionMode = 'business' | 'personal';
export type FieldType = 'short_text' | 'long_text' | 'single_choice' | 'multi_choice';
export type QuestionTier = 'must-ask' | 'should-ask' | 'optional';
export type InputType = 'textarea' | 'url' | 'url_multi';

export interface Question {
  id: string;
  text: string;
  helperText?: string;
  section: string;
  fieldType: FieldType;
  inputType: InputType;
  options?: string[];
  order?: number;
  tier?: QuestionTier;
}

export interface InterviewResponse {
  id: string;
  questionId: string;
  questionText: string;
  timestamp: string;
  transcription: string;
  // AI analysis fields — populated when AI mode is enabled
  summary?: string;
  keyInsight?: string;
  actionItems?: string[];
  quotable?: string;
  audioUrl?: string;
  isEdited?: boolean;
}

export interface Session {
  id: string;
  name: string;
  subtitle?: string;
  questions: Question[];
  responses: InterviewResponse[];
}

export interface GeminiResult {
  transcription: string;
  summary: string;
  keyInsight?: string;
  actionItems?: string[];
  quotable?: string;
}

export type AppScreen = 'vision' | 'landing' | 'magic-link' | 'router' | 'questions' | 'review' | 'output' | 'search';

export interface AppSettings {
  // Features
  aiAnalysisEnabled: boolean;
  voiceInputEnabled: boolean;
  magicLinkEnabled: boolean;
  routerQuestionEnabled: boolean;
  reviewScreenEnabled: boolean;

  // Persistence
  storageMode: 'localStorage' | 'googleSheets';
  autoSaveEnabled: boolean;
  autoSaveDebounceMs: number;

  // Display
  showTierIndicators: boolean;
  showProgressPercentage: boolean;
  showAiInsightsInSidebar: boolean;

  // Question Filtering
  showAllQuestions: boolean;
  hiddenTiers: QuestionTier[];
}

export interface SavedProgress {
  email: string;
  currentStep: string;
  currentScreen: AppScreen;
  routerAnswer: string;
  answers: Record<string, string>;
  aiResponses: Record<string, Omit<InterviewResponse, 'id' | 'questionId' | 'questionText' | 'timestamp' | 'transcription'>>;
  lastSaved: string;
}