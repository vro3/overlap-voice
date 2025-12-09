import React, { useState, useRef, useEffect } from 'react';
import { Question, InterviewResponse } from '../types';
import { processAudioResponse } from '../services/geminiService';

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

  const handleTextSubmit = () => {
    if (!transcription.trim()) return;
    
    // For text input, we don't have a summary from AI immediately (could add a separate call)
    // For now, we'll just save the text.
    const newResponse: InterviewResponse = {
        id: existingResponse?.id || crypto.randomUUID(),
        questionId: question.id,
        questionText: question.text,
        timestamp: new Date().toISOString(),
        transcription: transcription,
        summary: "Text response submitted.",
        isEdited: true
    };
    onSave(newResponse);
    setStatus('answered');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Render Helpers ---

  return (
    <div className="mb-8 last:mb-20">
      {isFirstInSection && (
        <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4 mt-8 px-1">
          {question.section}
          {sectionQuestionCount && (
            <span className="ml-2 text-xs font-normal text-gray-600">({sectionQuestionCount})</span>
          )}
        </h3>
      )}

      <div className={`relative bg-surface rounded-xl border transition-all duration-300 ${status === 'answered' ? 'border-green-900/50 shadow-sm' : 'border-border shadow-md'}`}>
        {/* Status Indicator Stripe */}
        {status === 'answered' && (
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-xl"></div>
        )}

        <div className="p-6 md:p-8">
            {/* Question Header */}
            <div className="mb-6">
                <h4 className="text-xl md:text-2xl font-display font-medium text-primary mb-2 leading-tight">
                    {question.text}
                </h4>
                <p className="text-base text-secondary font-light leading-relaxed">
                    {question.helperText}
                </p>
            </div>

            {/* Interaction Area */}
            <div className="bg-background/50 rounded-lg border border-border overflow-hidden min-h-[160px] relative flex flex-col">
                
                {/* STATE: EMPTY */}
                {status === 'empty' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
                        {inputType === 'voice' ? (
                            <>
                                <button 
                                    onClick={startRecording}
                                    className="group relative w-16 h-16 rounded-full bg-orange flex items-center justify-center shadow-lg shadow-orange/20 hover:scale-105 transition-transform"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </button>
                                <p className="text-secondary text-sm">Tap to record your answer</p>
                            </>
                        ) : (
                            <div className="w-full">
                                <textarea 
                                    className="w-full h-32 bg-transparent text-primary placeholder-gray-600 focus:outline-none resize-none"
                                    placeholder="Type your answer here..."
                                    value={transcription}
                                    onChange={(e) => setTranscription(e.target.value)}
                                />
                                <div className="flex justify-end mt-2">
                                    <button onClick={handleTextSubmit} disabled={!transcription.trim()} className="px-4 py-2 bg-white text-black text-sm font-bold rounded hover:bg-gray-200 disabled:opacity-50">Save</button>
                                </div>
                            </div>
                        )}
                        
                        {/* Toggle */}
                        <div className="absolute top-4 right-4 flex bg-surface rounded-lg p-1 border border-border">
                             <button onClick={() => setInputType('voice')} className={`p-1.5 rounded ${inputType === 'voice' ? 'bg-background text-white' : 'text-gray-500 hover:text-white'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                             </button>
                             <button onClick={() => setInputType('text')} className={`p-1.5 rounded ${inputType === 'text' ? 'bg-background text-white' : 'text-gray-500 hover:text-white'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                             </button>
                        </div>
                    </div>
                )}

                {/* STATE: RECORDING */}
                {status === 'recording' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                        {/* Waveform Animation Background */}
                        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20 pointer-events-none">
                             {[...Array(20)].map((_, i) => (
                                 <div key={i} className="w-2 bg-orange rounded-full wave-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                             ))}
                        </div>
                        
                        <div className="text-4xl font-display font-light text-primary mb-6 z-10">{formatTime(recordingTime)}</div>
                        
                        <button 
                            onClick={stopRecording}
                            className="group relative w-20 h-20 rounded-full bg-surface border-2 border-orange flex items-center justify-center z-10 animate-pulse-slow hover:scale-105 transition-transform"
                        >
                            <div className="w-8 h-8 bg-white rounded-md"></div>
                        </button>
                        
                        <p className="mt-6 text-orange text-sm font-medium animate-pulse z-10">Recording... Speak naturally.</p>
                        
                        {transcription && (
                            <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-gray-500 truncate px-4">
                                "{transcription}"
                            </div>
                        )}
                    </div>
                )}

                {/* STATE: PROCESSING */}
                {status === 'processing' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
                        <div className="w-10 h-10 border-4 border-surface border-t-orange rounded-full animate-spin"></div>
                        <p className="text-secondary text-sm">Transcribing & Summarizing...</p>
                    </div>
                )}

                {/* STATE: ANSWERED / EDITING */}
                {(status === 'answered' || status === 'editing') && (
                    <div className="flex-1 p-6">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Response</div>
                        {status === 'editing' ? (
                            <textarea
                                value={transcription}
                                onChange={(e) => setTranscription(e.target.value)}
                                className="w-full h-40 bg-background/50 p-4 rounded text-primary border border-border focus:border-orange focus:ring-1 focus:ring-orange/50 outline-none resize-none leading-relaxed"
                            />
                        ) : (
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">"{transcription}"</p>
                            </div>
                        )}

                        {/* AI Analysis Section */}
                        {summary && status !== 'editing' && (
                            <div className="mt-6 space-y-3">
                                {/* Summary */}
                                <div className="bg-surface/50 border border-border p-4 rounded-lg">
                                    <div className="text-xs font-bold text-orange uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                                        Summary
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium">{summary}</p>
                                </div>

                                {/* Key Insight */}
                                {existingResponse?.keyInsight && (
                                    <div className="bg-blue-900/20 border border-blue-800/30 p-4 rounded-lg">
                                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Key Insight</div>
                                        <p className="text-sm text-blue-200">{existingResponse.keyInsight}</p>
                                    </div>
                                )}

                                {/* Action Items */}
                                {existingResponse?.actionItems && existingResponse.actionItems.length > 0 && (
                                    <div className="bg-green-900/20 border border-green-800/30 p-4 rounded-lg">
                                        <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Action Items</div>
                                        <ul className="text-sm text-green-200 space-y-1">
                                            {existingResponse.actionItems.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-green-500 mt-0.5">→</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Quotable */}
                                {existingResponse?.quotable && (
                                    <div className="bg-purple-900/20 border border-purple-800/30 p-4 rounded-lg">
                                        <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Quotable</div>
                                        <p className="text-sm text-purple-200 italic">"{existingResponse.quotable}"</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Controls */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                             <div className="flex items-center gap-4">
                                {status === 'editing' ? (
                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
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
                                            className="flex items-center gap-1 text-sm text-secondary hover:text-orange transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                            Re-do
                                        </button>
                                        <div className="flex items-center gap-2 text-xs text-green-500 font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            <span>Saved {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                    </>
                                )}
                             </div>

                             <div className="flex gap-3">
                                {status === 'editing' ? (
                                    <>
                                        <button onClick={() => setStatus('answered')} className="text-sm text-gray-500 hover:text-white">Cancel</button>
                                        <button onClick={handleTextSubmit} className="text-sm bg-white text-black px-4 py-1.5 rounded font-bold hover:bg-gray-200">Save Changes</button>
                                    </>
                                ) : (
                                    <button onClick={() => setStatus('editing')} className="flex items-center gap-1 text-sm text-secondary hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        Edit
                                    </button>
                                )}
                             </div>
                        </div>
                    </div>
                )}
            </div>
            
            {errorMsg && <p className="mt-2 text-red-400 text-sm text-center">{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;