import { useState, useEffect, useCallback } from 'react';
import { AppSettings, QuestionTier } from '../types';
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from '../data/defaultSettings';

export function useSettings() {
    const [settings, setSettings] = useState<AppSettings>(() => {
        try {
            const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
            if (saved) {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
        return DEFAULT_SETTINGS;
    });

    // Persist on change
    useEffect(() => {
        try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }, [settings]);

    const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    }, []);

    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_SETTINGS);
        localStorage.removeItem(SETTINGS_STORAGE_KEY);
    }, []);

    return { settings, updateSetting, resetSettings };
}
