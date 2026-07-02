import { AppSettings } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
    // Features — prototype defaults (spec-compliant)
    voiceInputEnabled: true,
    magicLinkEnabled: true,
    routerQuestionEnabled: true,
    reviewScreenEnabled: true,

    // Persistence
    autoSaveEnabled: true,
    autoSaveDebounceMs: 3000,

    // Display
    showTierIndicators: false,
    showProgressPercentage: false,

    // Questions
    showAllQuestions: true,
    hiddenTiers: [],
};

export const SETTINGS_STORAGE_KEY = 'overlap_settings';
