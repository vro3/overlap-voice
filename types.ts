export type FieldType = 'short_text' | 'long_text' | 'single_choice' | 'multi_choice';

export interface Question {
  id: string;
  text: string;
  helperText?: string;
  section: string; // Grouping within step
  fieldType: FieldType;
  options?: string[]; // For choice types
  order?: number;
}

export interface InterviewResponse {
  id: string;
  questionId: string;
  questionText: string;
  timestamp: string;
  transcription: string; // The final edited transcription
  summary: string;
  keyInsight?: string; // The core belief/insight extracted
  actionItems?: string[]; // Concrete next steps identified
  quotable?: string; // A direct quote worth using in materials
  audioUrl?: string; // Local object URL for playback
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