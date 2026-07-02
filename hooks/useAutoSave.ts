import { useState, useRef, useCallback } from 'react';
import { SavedProgress, AppSettings } from '../types';

const PROGRESS_STORAGE_KEY = 'overlap_progress';

// Per-email ownership token (minted server-side on first save). Kept in
// localStorage so this device keeps write access to its own cloud data.
const OWNER_TOKEN_PREFIX = 'overlap_owner_token:';
const tokenKey = (email: string) => OWNER_TOKEN_PREFIX + email.toLowerCase().trim();

function getOwnerToken(email: string): string | null {
  try {
    return localStorage.getItem(tokenKey(email));
  } catch {
    return null;
  }
}

function setOwnerToken(email: string, token: string): void {
  try {
    localStorage.setItem(tokenKey(email), token);
  } catch {
    /* localStorage unavailable — cloud save will still work this session */
  }
}

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
        // Primary: Always save to localStorage (instant, synchronous)
        localStorage.setItem(PROGRESS_STORAGE_KEY, serialized);
        lastSavedRef.current = serialized;
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2000);

        // Secondary: Attempt server save (fire-and-forget, non-blocking)
        // Wrapped in setTimeout to prevent blocking the UI
        if (settings.storageMode === 'googleSheets' && data.email) {
          const email = data.email; // narrowed to string by the guard above
          setTimeout(() => {
            fetch('/api/user/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                progress: data,
                token: getOwnerToken(email) || undefined,
              }),
            })
              .then((res) => (res.ok ? res.json() : null))
              .then((json) => {
                // First save for this email returns a token — persist it so this
                // device keeps write access. (A 403/denied response has no token.)
                if (json?.token) setOwnerToken(email, json.token);
              })
              .catch(() => {
                // Silently fail — localStorage is already saved
              });
          }, 0);
        }
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

  // Resolves to the saved progress, or null when the server confirms there is
  // no saved data for this email. THROWS on a transport/HTTP/parse failure so
  // callers can tell "nothing saved" apart from "couldn't reach the server"
  // (the latter should offer a retry, not silently start the user over).
  const loadProgressFromServer = useCallback(async (email: string): Promise<SavedProgress | null> => {
    const res = await fetch('/api/user/load', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token: getOwnerToken(email) || undefined }),
    });
    if (!res.ok) throw new Error(`load failed: ${res.status}`);
    const json = await res.json();
    if (json.token) setOwnerToken(email, json.token); // defensive; load won't normally mint
    if (json.exists && json.data) {
      return json.data as SavedProgress;
    }
    return null; // server reached, no saved data for this email
  }, []);

  const clearProgress = useCallback(() => {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    lastSavedRef.current = '';
  }, []);

  return { saveProgress, loadProgress, loadProgressFromServer, clearProgress, showSavedToast };
}
