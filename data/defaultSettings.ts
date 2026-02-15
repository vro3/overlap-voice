import { AppSettings } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
    // Features — prototype defaults (spec-compliant)
    aiAnalysisEnabled: false,
    voiceInputEnabled: true,
    magicLinkEnabled: true,
    routerQuestionEnabled: true,
    reviewScreenEnabled: true,

    // Persistence
    storageMode: 'vercelKV',
    autoSaveEnabled: true,
    autoSaveDebounceMs: 500,

    // Display
    showTierIndicators: false,
    showProgressPercentage: false,
    showAiInsightsInSidebar: false,

    // Questions
    showAllQuestions: true,
    hiddenTiers: [],
};

export const SETTINGS_STORAGE_KEY = 'overlap_settings';
