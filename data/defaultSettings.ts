import { AppSettings } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
    // Features — prototype defaults (spec-compliant)
    aiAnalysisEnabled: false,
    voiceInputEnabled: true,
    magicLinkEnabled: true,
    routerQuestionEnabled: true,
    reviewScreenEnabled: true,

    // Persistence
    storageMode: 'googleSheets',
    autoSaveEnabled: true,
    autoSaveDebounceMs: 3000,

    // Display
    showTierIndicators: false,
    showProgressPercentage: false,
    showAiInsightsInSidebar: false,

    // Questions
    showAllQuestions: true,
    hiddenTiers: [],
};

export const SETTINGS_STORAGE_KEY = 'overlap_settings';
