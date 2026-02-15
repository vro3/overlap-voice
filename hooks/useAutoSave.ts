import { useState, useRef, useCallback } from 'react';
import { SavedProgress, AppSettings } from '../types';

const PROGRESS_STORAGE_KEY = 'overlap_progress';

export function useAutoSave(settings: AppSettings) {
  const [showSavedToast, setShowSavedToast] = useState(false);
  const saveTimeoutRef = useRef<number | null>(null);
  const lastSavedRef = useRef<string>('');

  const saveProgress = useCallback((data: SavedProgress) => {
    if (!settings.autoSaveEnabled) return;

    const serialized = JSON.stringify(data);
    if (serialized === lastSavedRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      try {
        if (settings.storageMode === 'localStorage') {
          localStorage.setItem(PROGRESS_STORAGE_KEY, serialized);
        } else {
          // Vercel KV mode — use existing API
          fetch('/api/user/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: data.email,
              sessions: null, // Legacy format — we'll send the new format
              progress: data,
            }),
          }).catch(console.error);
        }
        lastSavedRef.current = serialized;
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2000);
      } catch (e) {
        console.error('Failed to save progress:', e);
      }
    }, settings.autoSaveDebounceMs);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [settings.autoSaveEnabled, settings.autoSaveDebounceMs, settings.storageMode]);

  const loadProgress = useCallback((): SavedProgress | null => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
    return null;
  }, []);

  const clearProgress = useCallback(() => {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    lastSavedRef.current = '';
  }, []);

  return { saveProgress, loadProgress, clearProgress, showSavedToast };
}
