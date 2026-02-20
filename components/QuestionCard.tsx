import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Question, InterviewResponse, AppSettings } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { processAudioResponse, processTextResponse } from '../services/geminiService';

interface QuestionCardProps {
  question: Question;
  value: string;
  onChange: (questionId: string, value: string) => void;
  existingResponse?: InterviewResponse;
  onSaveAiResponse?: (response: InterviewResponse) => void;
  settings: AppSettings;
  isFirstInSection: boolean;
  sectionQuestionCount?: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  onChange,
  existingResponse,
  onSaveAiResponse,
  settings,
  isFirstInSection,
  sectionQuestionCount,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [aiStatus, setAiStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [aiSummary, setAiSummary] = useState(existingResponse?.summary || '');

  // Speech recognition for simple mode
  const audioDeviceId = typeof window !== 'undefined' ? localStorage.getItem('selectedAudioDeviceId') || '' : '';
  const { isSupported: speechSupported, isListening, startListening, stopListening } = useSpeechRecognition({
    onTranscript: (text) => {
      // Append speech to existing text
      const current = value;
      const newValue = current ? current + ' ' + text : text;
      onChange(question.id, newValue);
    },
    audioDeviceId: audioDeviceId || undefined,
  });

  const showMic = settings.voiceInputEnabled && speechSupported && question.inputType === 'textarea';

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  // AI mode: process text through Gemini
  const handleAiAnalyze = async () => {
    if (!value.trim() || !settings.aiAnalysisEnabled) return;
    setAiStatus('processing');
    try {
      const result = await processTextResponse(value);
      setAiSummary(result.summary);
      setAiStatus('done');
      onSaveAiResponse?.({
        id: existingResponse?.id || crypto.randomUUID(),
        questionId: question.id,
        questionText: question.text,
        timestamp: new Date().toISOString(),
        transcription: value,
        summary: result.summary,
        keyInsight: result.keyInsight,
        actionItems: result.actionItems,
        quotable: result.quotable,
        isEdited: true,
      });
    } catch (err) {
      console.error('AI analysis failed:', err);
      setAiStatus('idle');
    }
  };

  // Tier colors (only shown when setting enabled)
  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'must-ask': return '#C84B4B';
      case 'should-ask': return '#D4A853';
      case 'optional': return '#8B9A6B';
      default: return '#8C857D';
    }
  };

  const getTierLabel = (tier?: string) => {
    switch (tier) {
      case 'must-ask': return 'Must-Ask';
      case 'should-ask': return 'Should-Ask';
      case 'optional': return 'Optional';
      default: return '';
    }
  };

  return (
    <div className="mb-6 last:mb-20">
      {isFirstInSection && (
        <h3 className="text-[11px] font-semibold text-muted uppercase tracking-[0.15em] mb-5 mt-10 flex items-center gap-3">
          <span>{question.section}</span>
          {sectionQuestionCount && (
            <span className="text-[10px] font-normal text-muted/60 bg-surface px-2 py-0.5 rounded-full">
              {sectionQuestionCount}
            </span>
          )}
        </h3>
      )}

      <div className="relative bg-surface rounded-2xl border border-border-subtle shadow-soft hover:shadow-card-hover hover:border-border transition-all duration-300">
        <div className="p-7 md:p-9">
          {/* Question Header */}
          <div className="mb-6">
            {/* Tier indicator — only when enabled */}
            {settings.showTierIndicators && question.tier && (
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getTierColor(question.tier) }}
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {getTierLabel(question.tier)}
                </span>
              </div>
            )}

            <h4 className="text-[20px] md:text-[22px] font-display font-medium text-primary mb-3 leading-snug tracking-[-0.01em]">
              {question.text}
            </h4>

            {question.helperText && (
              <p className="text-[14px] text-muted font-light italic leading-relaxed">
                {question.helperText}
              </p>
            )}
          </div>

          {/* Input Area */}
          <div className="relative">
            {question.inputType === 'url' ? (
              /* URL input — single line, no mic */
              <input
                type="url"
                value={value}
                onChange={(e) => onChange(question.id, e.target.value)}
                placeholder="https://"
                className="w-full px-4 py-3.5 bg-background/50 border border-border-subtle rounded-xl text-primary placeholder-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-[16px]"
              />
            ) : question.inputType === 'url_multi' ? (
              /* Multi-line URL input — no mic */
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(question.id, e.target.value)}
                placeholder="One URL per line"
                rows={3}
                className="w-full px-4 py-3.5 bg-background/50 border border-border-subtle rounded-xl text-primary placeholder-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-[16px] leading-relaxed resize-none"
              />
            ) : (
              /* Standard textarea + mic */
              <div className="flex gap-3 items-start">
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => onChange(question.id, e.target.value)}
                  placeholder="Type your answer here..."
                  rows={3}
                  className="flex-1 px-4 py-3.5 bg-background/50 border border-border-subtle rounded-xl text-primary placeholder-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-[16px] leading-relaxed resize-none min-h-[90px]"
                />

                {showMic && (
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 min-h-[48px] ${
                      isListening
                        ? 'bg-recording text-white animate-pulse-slow min-w-[100px]'
                        : 'bg-surface-hover text-secondary hover:text-primary hover:bg-surface border border-border-subtle'
                    }`}
                    title={isListening ? 'Press to stop recording' : 'Press to start voice input'}
                  >
                    {isListening ? (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span className="text-[14px]">Listening</span>
                        </div>
                        <span className="text-[10px] opacity-80">Press to Stop</span>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <span className="hidden sm:inline text-[14px]">Talk</span>
                      </div>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* AI Analyze button — only when AI mode is on */}
            {settings.aiAnalysisEnabled && value.trim() && question.inputType === 'textarea' && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleAiAnalyze}
                  disabled={aiStatus === 'processing'}
                  className="text-[13px] text-accent hover:text-accent/80 font-medium px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-all disabled:opacity-50"
                >
                  {aiStatus === 'processing' ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                      Analyzing...
                    </span>
                  ) : aiStatus === 'done' ? (
                    'Re-analyze'
                  ) : (
                    'Analyze with AI'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* AI Analysis Results — only shown when AI is enabled and results exist */}
          {settings.aiAnalysisEnabled && aiStatus === 'done' && aiSummary && (
            <div className="mt-6 space-y-3">
              <div className="bg-accent-soft/20 border border-accent/10 p-4 rounded-xl">
                <div className="text-[10px] font-semibold text-accent uppercase tracking-[0.1em] mb-2">The Gist</div>
                <p className="text-[14px] text-secondary leading-relaxed">{aiSummary}</p>
              </div>

              {existingResponse?.keyInsight && (
                <div className="bg-info-soft/30 border border-info/10 p-4 rounded-xl">
                  <div className="text-[10px] font-semibold text-info uppercase tracking-[0.1em] mb-2">What This Means</div>
                  <p className="text-[14px] text-secondary leading-relaxed">{existingResponse.keyInsight}</p>
                </div>
              )}

              {existingResponse?.actionItems && existingResponse.actionItems.length > 0 && (
                <div className="bg-success-soft/30 border border-success/10 p-4 rounded-xl">
                  <div className="text-[10px] font-semibold text-success uppercase tracking-[0.1em] mb-2">To Explore</div>
                  <ul className="text-[14px] text-secondary space-y-1.5">
                    {existingResponse.actionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-success mt-0.5 text-xs">→</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {existingResponse?.quotable && (
                <div className="bg-highlight-soft/30 border border-highlight/10 p-4 rounded-xl">
                  <div className="text-[10px] font-semibold text-highlight uppercase tracking-[0.1em] mb-2">In Your Words</div>
                  <p className="text-[14px] text-secondary italic leading-relaxed">"{existingResponse.quotable}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
