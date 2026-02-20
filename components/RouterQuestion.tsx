import React, { useState, useRef, useEffect } from 'react';
import { AppSettings } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface RouterQuestionProps {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  settings: AppSettings;
  onAudioSettings?: () => void;
}

const RouterQuestion: React.FC<RouterQuestionProps> = ({ value, onChange, onContinue, settings, onAudioSettings }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioDeviceId = typeof window !== 'undefined' ? localStorage.getItem('selectedAudioDeviceId') || '' : '';
  const { isSupported, isListening, startListening, stopListening } = useSpeechRecognition({
    onTranscript: (text) => {
      const current = value;
      onChange(current ? current + ' ' + text : text);
    },
    audioDeviceId: audioDeviceId || undefined,
  });

  const showMic = settings.voiceInputEnabled && isSupported;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full animate-fadeIn">
        <div className="mb-4">
          <span className="text-accent text-[11px] font-semibold uppercase tracking-[0.12em]">First, a question</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 leading-tight">
          Imagine this process did its job perfectly. How does your life look different or better in the next three to six months?
        </h2>

        <p className="text-muted text-[15px] italic mb-10 leading-relaxed">
          Not what you think the "right" answer is — what would actually change if this works? Be specific about the friction you want gone.
        </p>

        <div className="flex gap-3 items-start mb-8">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
            className="flex-1 px-5 py-4 bg-surface border border-border-subtle rounded-xl text-primary placeholder-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-[18px] leading-relaxed resize-none"
          />

          {showMic && (
            <button
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

        <button
          onClick={onContinue}
          disabled={!value.trim()}
          className="w-full py-4 bg-accent text-background font-bold text-lg rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RouterQuestion;
