import { useState, useRef, useCallback, useEffect } from 'react';
import { SavedProgress, AppSettings } from '../types';

const PROGRESS_STORAGE_KEY = 'overlap_progress';

export type SaveStatus = 'idle' | 'saving' | 'saved';

// On-device persistence only. Answers are written to this browser's
// localStorage (debounced) and restored on reload. There is no cloud sync —
// so "saved" always reflects a real, completed write the user can trust.
export function useAutoSave(settings: AppSettings) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const saveTimeoutRef = useRef<number | null>(null);
  const lastSavedRef = useRef<string>('');
  const pendingRef = useRef<string | null>(null); // serialized data waiting to be written

  const writeNow = useCallback(() => {
    if (pendingRef.current === null) return;
    const serialized = pendingRef.current;
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, serialized);
      lastSavedRef.current = serialized;
      pendingRef.current = null;
      setSaveStatus('saved');
    } catch (e) {
      // Storage full or blocked (e.g. private mode). Keep the pending data so a
      // later flush can retry, and surface that we're not saved.
      console.error('Failed to save progress:', e);
      setSaveStatus('idle');
    }
  }, []);

  const saveProgress = useCallback((data: SavedProgress) => {
    if (!settings.autoSaveEnabled) return;
    const serialized = JSON.stringify(data);
    if (serialized === lastSavedRef.current) return; // nothing changed
    pendingRef.current = serialized;
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = window.setTimeout(writeNow, settings.autoSaveDebounceMs);
  }, [settings.autoSaveEnabled, settings.autoSaveDebounceMs, writeNow]);

  // Write any pending edits immediately — used when the tab is hidden/closed so
  // the last few seconds of typing (still inside the debounce window) can't be lost.
  const flush = useCallback(() => {
    if (saveTimeoutRef.current) { clearTimeout(saveTimeoutRef.current); saveTimeoutRef.current = null; }
    writeNow();
  }, [writeNow]);

  useEffect(() => {
    const onPageHide = () => flush();
    // On mobile, 'visibilitychange' -> hidden is the reliable "app is going
    // away" signal (pagehide/beforeunload often don't fire); pagehide covers
    // desktop tab-close and navigation.
    const onVisibility = () => { if (document.visibilityState === 'hidden') flush(); };
    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [flush]);

  const loadProgress = useCallback((): SavedProgress | null => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) {
        lastSavedRef.current = saved; // don't immediately re-save identical data
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
    return null;
  }, []);

  const clearProgress = useCallback(() => {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    lastSavedRef.current = '';
    pendingRef.current = null;
    setSaveStatus('idle');
  }, []);

  return { saveProgress, loadProgress, clearProgress, flush, saveStatus };
}
