import React, { useState, useRef, useEffect } from 'react';
import { AppSettings } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface MagicLinkProps {
  onComplete: (email: string, routerAnswer: string) => void;
  onSkip: () => void;
  settings: AppSettings;
  initialRouterAnswer?: string;
  onAudioSettings?: () => void;
}

const MagicLink: React.FC<MagicLinkProps> = ({ onComplete, onSkip, settings, initialRouterAnswer, onAudioSettings }) => {
  const [email, setEmail] = useState('');
  const [routerAnswer, setRouterAnswer] = useState(initialRouterAnswer || '');
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const audioDeviceId = typeof window !== 'undefined' ? localStorage.getItem('selectedAudioDeviceId') || '' : '';
  const { isSupported, isListening, startListening, stopListening } = useSpeechRecognition({
    onTranscript: (text) => {
      setRouterAnswer(prev => prev ? prev + ' ' + text : text);
    },
    audioDeviceId: audioDeviceId || undefined,
  });

  const showMic = settings.voiceInputEnabled && isSupported;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [routerAnswer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }
    onComplete(trimmed, routerAnswer);
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full animate-fadeIn">
        <div className="mb-4">
          <span className="text-accent text-[11px] font-semibold uppercase tracking-[0.12em]">Let's get started</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-10">
            <label className="block text-lg font-display font-semibold text-primary mb-2">
              What's your email address?
            </label>
            <p className="text-muted text-[14px] mb-4">
              So we can save your progress and you can come back anytime.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@example.com"
              className="w-full px-5 py-4 bg-surface border border-border-subtle rounded-xl text-primary placeholder-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-lg"
              autoFocus
            />
            {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
          </div>

          {/* Router Question */}
          <div className="mb-10">
            <label className="block text-lg font-display font-semibold text-primary mb-2">
              How would your life look different in the next 3–6 months if this is successful?
            </label>
            <p className="text-muted text-[14px] italic mb-4">
              Not what you think the "right" answer is — what would actually change if this works? Be specific about the friction you want gone.
            </p>
            <div className="flex gap-3 items-start">
              <textarea
                ref={textareaRef}
                value={routerAnswer}
                onChange={(e) => setRouterAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={4}
                className="flex-1 px-5 py-4 bg-surface border border-border-subtle rounded-xl text-primary placeholder-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-[16px] leading-relaxed resize-none"
              />

              {showMic && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 px-5 py-3 rounded-xl font-medium transition-all min-h-[56px] ${
                    isListening
                      ? 'bg-recording text-white animate-pulse-slow min-w-[110px]'
                      : 'bg-surface text-secondary hover:text-primary border border-border-subtle'
                  }`}
                  title={isListening ? 'Press to stop recording' : 'Press to start voice input'}
                >
                  {isListening ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-[15px]">Listening</span>
                      </div>
                      <span className="text-[10px] opacity-80">Press to Stop</span>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <span className="hidden sm:inline text-[15px]">Talk</span>
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!email.trim()}
              className="flex-1 py-4 bg-accent text-background font-bold text-lg rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="px-6 py-4 text-muted hover:text-secondary text-[15px] font-medium rounded-xl hover:bg-surface transition-colors"
            >
              Skip
            </button>
          </div>
        </form>

        <p className="text-muted text-sm text-center mt-6">No account needed. Just your email so we can save your answers.</p>
      </div>
    </div>
  );
};

export default MagicLink;
