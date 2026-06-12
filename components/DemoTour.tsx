// DemoTour.tsx — v1.0 — 2026-06-11
// A lightweight spotlight walkthrough. Each step dims the screen, cuts a hole
// over an anchored element ([data-tour="..."]), and shows a tooltip card with
// Back / Next / Exit. Robust to lazy-loaded screens via short element polling;
// falls back to a centered card when an anchor isn't found.
// Adapted from the VEEC DemoTour to The Overlap's warm-amber theme.

import React, { useEffect, useState, useCallback } from 'react';

export interface DemoStep {
  anchor?: string;        // data-tour value to spotlight; omit for a centered card
  title: string;
  body: string;
  cta?: string;           // overrides the Next button label (last step)
}

interface Rect { top: number; left: number; width: number; height: number; }

interface DemoTourProps {
  steps: DemoStep[];
  stepIndex: number;
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
}

const PAD = 8;        // spotlight padding around the element
const CARD_W = 360;

export const DemoTour: React.FC<DemoTourProps> = ({ steps, stepIndex, onNext, onBack, onExit }) => {
  const step = steps[stepIndex];
  const [rect, setRect] = useState<Rect | null>(null);

  // Find + measure the anchored element (polling for lazy-mounted screens).
  useEffect(() => {
    if (!step?.anchor) {
      setRect(null);
      return;
    }
    let raf = 0;
    let tries = 0;
    const timers: number[] = [];
    // Scroll the element to center (instant, so the measurement is immediately
    // correct) and record its rect. Re-run as content mounts and shifts the
    // layout, so the spotlight + card never strand off-screen.
    const place = (): boolean => {
      const el = document.querySelector(`[data-tour="${step.anchor}"]`) as HTMLElement | null;
      if (!el) return false;
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      return true;
    };
    const find = () => {
      if (place()) {
        [150, 400, 700].forEach(d => timers.push(window.setTimeout(place, d)));
        return;
      }
      if (tries++ < 40) raf = requestAnimationFrame(find); // ~0.6s of attempts
      else setRect(null);
    };
    find();
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [step?.anchor, stepIndex]);

  // Keep the spotlight aligned on resize/scroll.
  useEffect(() => {
    if (!step?.anchor) return;
    const reposition = () => {
      const el = document.querySelector(`[data-tour="${step.anchor}"]`) as HTMLElement | null;
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    };
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [step?.anchor]);

  const isLast = stepIndex === steps.length - 1;
  const isFirst = stepIndex === 0;

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onExit();
    if (e.key === 'ArrowRight' || e.key === 'Enter') onNext();
    if (e.key === 'ArrowLeft') onBack();
  }, [onExit, onNext, onBack]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (!step) return null;

  // Card placement: below the hole if there's room, else above; centered if no anchor.
  let cardStyle: React.CSSProperties;
  if (rect) {
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const below = rect.top + rect.height + 16;
    const placeBelow = below + 200 < vh;
    const left = Math.min(Math.max(rect.left + rect.width / 2 - CARD_W / 2, 16), vw - CARD_W - 16);
    cardStyle = placeBelow
      ? { top: below + PAD, left }
      : { top: Math.max(rect.top - 16 - 200, 16), left };
  } else {
    cardStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }

  return (
    <div className="fixed inset-0 z-[300]" aria-modal="true" role="dialog">
      {/* Spotlight: a transparent hole punched out of a dark overlay via box-shadow */}
      {rect ? (
        <div
          className="absolute pointer-events-none transition-all duration-300 ease-out rounded-xl"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow: '0 0 0 9999px rgba(15,12,10,0.84)',
            outline: '2px solid rgba(212,168,83,0.8)',
            outlineOffset: '0px',
          }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'rgba(15,12,10,0.84)' }} />
      )}

      {/* Tooltip card */}
      <div
        className="absolute w-[360px] max-w-[calc(100vw-32px)] bg-surface border border-accent/30 rounded-2xl shadow-soft p-5 animate-fadeIn"
        style={cardStyle}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent/15 flex items-center justify-center">
              {/* play triangle */}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent/80">
              Demo · Step {stepIndex + 1} of {steps.length}
            </span>
          </div>
          <button onClick={onExit} className="text-muted hover:text-primary transition-colors" aria-label="Exit demo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h3 className="text-base font-display font-bold text-primary mb-1.5">{step.title}</h3>
        <p className="text-sm text-secondary leading-relaxed mb-4">{step.body}</p>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${i === stepIndex ? 'w-5 bg-accent' : 'w-1.5 bg-primary/15'}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="text-xs text-muted hover:text-secondary transition-colors"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-secondary hover:text-primary transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
            <button
              onClick={isLast ? onExit : onNext}
              className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent/90 text-background rounded-lg text-xs font-bold transition-all active:scale-95"
            >
              {step.cta || (isLast ? 'Finish' : 'Next')}
              {!isLast && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
