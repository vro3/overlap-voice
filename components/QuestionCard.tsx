import React, { useState, useRef, useEffect } from 'react';
import { Question, InterviewResponse } from '../types';
import { processAudioResponse, processTextResponse } from '../services/geminiService';

interface QuestionCardProps {
  question: Question;
  existingResponse?: InterviewResponse;
  onSave: (response: InterviewResponse) => void;
  isFirstInSection: boolean;
  sectionQuestionCount?: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, existingResponse, onSave, isFirstInSection, sectionQuestionCount }) => {
  // States
  const [status, setStatus] = useState<'empty' | 'recording' | 'processing' | 'answered' | 'editing'>('empty');
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [inputType, setInputType] = useState<'voice' | 'text'>('voice');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);
  const finalAudioBlob = useRef<Blob | null>(null);

  // Initialize from existing response if available
  useEffect(() => {
    if (existingResponse) {
      setStatus('answered');
      setTranscription(existingResponse.transcription);
      setSummary(existingResponse.summary);
    }
  }, [existingResponse]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // --- Actions ---

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      
      mediaRecorderRef.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: mimeType });
        finalAudioBlob.current = audioBlob;
        stream.getTracks().forEach(track => track.stop());
        handleProcessing(audioBlob);
      };

      // Start Web Speech API for real-time visualization
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            interim += event.results[i][0].transcript;
          }
          // We only update if we get something to show "it's listening"
          // The final transcript will actually come from Gemini for better accuracy, 
          // or we can use this if Gemini fails. For now, let's just use it as feedback.
          if (interim) setTranscription(interim); 
        };
        recognitionRef.current.start();
      }

      recorder.start();
      setStatus('recording');
      setRecordingTime(0);
      setTranscription(''); // Clear previous

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error(err);
      setErrorMsg("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) recognitionRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleProcessing = async (audioBlob: Blob) => {
    setStatus('processing');
    try {
      // Call Gemini Service
      const result = await processAudioResponse(audioBlob);
      setTranscription(result.transcription);
      setSummary(result.summary);
      
      // Auto-save
      const newResponse: InterviewResponse = {
        id: existingResponse?.id || crypto.randomUUID(),
        questionId: question.id,
        questionText: question.text,
        timestamp: new Date().toISOString(),
        transcription: result.transcription,
        summary: result.summary,
        keyInsight: result.keyInsight,
        actionItems: result.actionItems,
        quotable: result.quotable,
        audioUrl: URL.createObjectURL(audioBlob)
      };

      onSave(newResponse);
      setStatus('answered');
      
    } catch (err) {
      setErrorMsg("Failed to process audio. Please try again.");
      setStatus('empty'); // Revert
    }
  };

  const handleTextSubmit = async () => {
    if (!transcription.trim()) return;

    setStatus('processing');
    try {
      const result = await processTextResponse(transcription);
      setSummary(result.summary);

      const newResponse: InterviewResponse = {
        id: existingResponse?.id || crypto.randomUUID(),
        questionId: question.id,
        questionText: question.text,
        timestamp: new Date().toISOString(),
        transcription: result.transcription,
        summary: result.summary,
        keyInsight: result.keyInsight,
        actionItems: result.actionItems,
        quotable: result.quotable,
        isEdited: true
      };
      onSave(newResponse);
      setStatus('answered');
    } catch (err) {
      setErrorMsg("Failed to analyze text. Please try again.");
      setStatus('empty');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Render Helpers ---

  // Tier color mapping
  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'must-ask':
        return '#C84B4B'; // passion/red
      case 'should-ask':
        return '#D97706'; // amber
      case 'optional':
        return '#059669'; // green
      default:
        return '#9CA3AF'; // muted gray
    }
  };

  const getTierLabel = (tier?: string) => {
    switch (tier) {
      case 'must-ask':
        return 'Must-Ask';
      case 'should-ask':
        return 'Should-Ask';
      case 'optional':
        return 'Optional';
      default:
        return '';
    }
  };

  return (
    <div className="mb-6 last:mb-20">
      {isFirstInSection && (
        <h3 className="text-[11px] font-semibold text-muted uppercase tracking-[0.15em] mb-5 mt-10 flex items-center gap-3">
          <span>{question.section}</span>
          {sectionQuestionCount && (
            <span className="text-[10px] font-normal text-muted/60 bg-surface px-2 py-0.5 rounded-full">{sectionQuestionCount}</span>
          )}
        </h3>
      )}

      <div className={`relative bg-surface rounded-2xl border transition-all duration-300 ${status === 'answered' ? 'border-success/20 shadow-card' : 'border-border-subtle shadow-soft hover:shadow-card-hover hover:border-border'}`}>
        {/* Status Indicator Stripe */}
        {status === 'answered' && (
             <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-success rounded-full"></div>
        )}

        <div className="p-7 md:p-9">
            {/* Question Header */}
            <div className="mb-8">
                {/* Tier indicator + Question number */}
                {question.tier && (
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getTierColor(question.tier) }}
                      title={getTierLabel(question.tier)}
                    />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                      {getTierLabel(question.tier)}
                    </span>
                  </div>
                )}

                <h4 className="text-[22px] md:text-[26px] font-display font-medium text-primary mb-3 leading-snug tracking-[-0.01em]">
                    {question.text}
                </h4>

                {/* Subtext - lighter, smaller, italic guidance */}
                <p className="text-[14px] text-secondary/70 font-light italic leading-relaxed">
                    {question.helperText}
                </p>
            </div>

            {/* Interaction Area */}
            <div className="bg-background/30 rounded-xl border border-border-subtle overflow-hidden min-h-[180px] relative flex flex-col">

                {/* STATE: EMPTY */}
                {status === 'empty' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-5">
                        {inputType === 'voice' ? (
                            <>
                                <button
                                    onClick={startRecording}
                                    className="group relative w-[72px] h-[72px] rounded-full bg-accent flex items-center justify-center shadow-glow hover:scale-105 active:scale-95 transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </button>
                                <p className="text-muted text-sm font-medium">Tap to record your answer</p>
                            </>
                        ) : (
                            <div className="w-full">
                                <textarea
                                    className="w-full h-32 bg-transparent text-primary placeholder-muted focus:outline-none resize-none text-[15px] leading-relaxed"
                                    placeholder="Type your answer here..."
                                    value={transcription}
                                    onChange={(e) => setTranscription(e.target.value)}
                                />
                                <div className="flex justify-end mt-3">
                                    <button onClick={handleTextSubmit} disabled={!transcription.trim()} className="px-5 py-2.5 bg-primary text-background text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-40 transition-all">Save</button>
                                </div>
                            </div>
                        )}

                        {/* Toggle */}
                        <div className="absolute top-4 right-4 flex bg-surface-hover rounded-lg p-1">
                             <button onClick={() => setInputType('voice')} className={`p-2 rounded-md transition-all ${inputType === 'voice' ? 'bg-surface text-primary' : 'text-muted hover:text-secondary'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                             </button>
                             <button onClick={() => setInputType('text')} className={`p-2 rounded-md transition-all ${inputType === 'text' ? 'bg-surface text-primary' : 'text-muted hover:text-secondary'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                             </button>
                        </div>
                    </div>
                )}

                {/* STATE: RECORDING */}
                {status === 'recording' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 relative overflow-hidden">
                        {/* Waveform Animation Background */}
                        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-10 pointer-events-none">
                             {[...Array(20)].map((_, i) => (
                                 <div key={i} className="w-1.5 bg-accent rounded-full wave-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                             ))}
                        </div>

                        <div className="text-5xl font-display font-light text-primary mb-8 z-10 tabular-nums">{formatTime(recordingTime)}</div>

                        <button
                            onClick={stopRecording}
                            className="group relative w-20 h-20 rounded-full bg-surface border-2 border-accent flex items-center justify-center z-10 animate-pulse-slow hover:scale-105 active:scale-95 transition-all"
                        >
                            <div className="w-7 h-7 bg-primary rounded-sm"></div>
                        </button>

                        <p className="mt-8 text-accent text-sm font-medium z-10">Recording... Speak naturally.</p>

                        {transcription && (
                            <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-muted truncate px-4">
                                "{transcription}"
                            </div>
                        )}
                    </div>
                )}

                {/* STATE: PROCESSING */}
                {status === 'processing' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-5">
                        <div className="w-10 h-10 border-[3px] border-border border-t-accent rounded-full animate-spin"></div>
                        <p className="text-muted text-sm font-medium">Analyzing your response...</p>
                    </div>
                )}

                {/* STATE: ANSWERED / EDITING */}
                {(status === 'answered' || status === 'editing') && (
                    <div className="flex-1 p-6">
                        <div className="text-[10px] font-semibold text-muted uppercase tracking-[0.1em] mb-3">Your Response</div>
                        {status === 'editing' ? (
                            <textarea
                                value={transcription}
                                onChange={(e) => setTranscription(e.target.value)}
                                className="w-full h-40 bg-surface p-4 rounded-xl text-primary border border-border focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none resize-none text-[15px] leading-relaxed"
                            />
                        ) : (
                            <div className="prose prose-invert max-w-none">
                                <p className="text-secondary text-[15px] leading-[1.7] whitespace-pre-wrap">"{transcription}"</p>
                            </div>
                        )}

                        {/* AI Analysis Section */}
                        {summary && status !== 'editing' && (
                            <div className="mt-8 space-y-4">
                                {/* The Gist (Summary) */}
                                <div className="bg-accent-soft/20 border border-accent/10 p-5 rounded-xl">
                                    <div className="text-[10px] font-semibold text-accent uppercase tracking-[0.1em] mb-2.5 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                                        The Gist
                                    </div>
                                    <p className="text-[14px] text-secondary leading-relaxed">{summary}</p>
                                </div>

                                {/* What This Means (Key Insight) */}
                                {existingResponse?.keyInsight && (
                                    <div className="bg-info-soft/30 border border-info/10 p-5 rounded-xl">
                                        <div className="text-[10px] font-semibold text-info uppercase tracking-[0.1em] mb-2.5">What This Means</div>
                                        <p className="text-[14px] text-secondary leading-relaxed">{existingResponse.keyInsight}</p>
                                    </div>
                                )}

                                {/* To Explore (Action Items) */}
                                {existingResponse?.actionItems && existingResponse.actionItems.length > 0 && (
                                    <div className="bg-success-soft/30 border border-success/10 p-5 rounded-xl">
                                        <div className="text-[10px] font-semibold text-success uppercase tracking-[0.1em] mb-2.5">To Explore</div>
                                        <ul className="text-[14px] text-secondary space-y-2">
                                            {existingResponse.actionItems.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2.5">
                                                    <span className="text-success mt-1 text-xs">→</span>
                                                    <span className="leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* In Your Words (Quotable) */}
                                {existingResponse?.quotable && (
                                    <div className="bg-highlight-soft/30 border border-highlight/10 p-5 rounded-xl">
                                        <div className="text-[10px] font-semibold text-highlight uppercase tracking-[0.1em] mb-2.5">In Your Words</div>
                                        <p className="text-[14px] text-secondary italic leading-relaxed">"{existingResponse.quotable}"</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Controls */}
                        <div className="flex items-center justify-between mt-8 pt-5 border-t border-border-subtle">
                             <div className="flex items-center gap-5">
                                {status === 'editing' ? (
                                    <div className="flex items-center gap-2 text-xs text-muted font-medium">
                                        <span>Editing response...</span>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setStatus('empty');
                                                setTranscription('');
                                                setSummary('');
                                                setInputType('voice');
                                            }}
                                            className="flex items-center gap-1.5 text-[13px] text-muted hover:text-accent transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                            Re-do
                                        </button>
                                        <div className="flex items-center gap-2 text-[11px] text-success font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            <span>Saved {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                    </>
                                )}
                             </div>

                             <div className="flex gap-3">
                                {status === 'editing' ? (
                                    <>
                                        <button onClick={() => setStatus('answered')} className="text-[13px] text-muted hover:text-primary transition-colors px-3 py-1.5">Cancel</button>
                                        <button onClick={handleTextSubmit} className="text-[13px] bg-primary text-background px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all">Save Changes</button>
                                    </>
                                ) : (
                                    <button onClick={() => setStatus('editing')} className="flex items-center gap-1.5 text-[13px] text-muted hover:text-primary transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        Edit
                                    </button>
                                )}
                             </div>
                        </div>
                    </div>
                )}
            </div>

            {errorMsg && <p className="mt-4 text-danger text-sm text-center">{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;