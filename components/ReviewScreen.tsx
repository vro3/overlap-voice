import React, { useState } from 'react';
import { Session } from '../types';

interface ReviewScreenProps {
  sessions: Session[];
  answers: Record<string, string>;
  routerAnswer: string;
  onEditAnswer: (questionId: string, value: string) => void;
  onGenerate: () => void;
  onBack: () => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ sessions, answers, routerAnswer, onEditAnswer, onGenerate, onBack }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(sessions.map(s => s.id)));
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalQuestions = sessions.reduce((acc, s) => acc + s.questions.length, 0) + 1; // +1 for router
  const answeredCount = Object.values(answers).filter((v: string) => v?.trim()).length + (routerAnswer ? 1 : 0);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12 animate-fadeIn">
        <div className="mb-10">
          <span className="text-accent text-[11px] font-semibold uppercase tracking-[0.12em] mb-2 block">Review</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-3">Review Your Answers</h1>
          <p className="text-secondary text-lg">Look everything over before generating your output. Click any answer to edit it.</p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-surface border border-border-subtle rounded-full text-[13px] text-secondary">
            You answered <span className="text-primary font-medium mx-1">{answeredCount}</span> of <span className="text-primary font-medium mx-1">{totalQuestions}</span> questions across {sessions.length} sections
          </div>
        </div>

        {/* Router question */}
        {routerAnswer && (
          <div className="mb-6 bg-surface rounded-2xl border border-border-subtle p-6">
            <h3 className="text-[11px] font-semibold text-accent uppercase tracking-[0.15em] mb-3">Your Vision</h3>
            <p className="text-secondary text-[15px] leading-relaxed">{routerAnswer}</p>
          </div>
        )}

        {/* Sections */}
        {sessions.map(session => {
          const isExpanded = expandedSections.has(session.id);
          const sectionAnswered = session.questions.filter(q => answers[q.id]?.trim()).length;

          return (
            <div key={session.id} className="mb-4">
              <button
                onClick={() => toggleSection(session.id)}
                className="w-full flex items-center justify-between bg-surface rounded-xl border border-border-subtle px-6 py-4 hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-primary font-display font-semibold">{session.name}</span>
                  <span className="text-muted text-[12px]">{sectionAnswered}/{session.questions.length} answered</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-muted transition-transform ${isExpanded ? '' : '-rotate-90'}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="mt-2 space-y-2 pl-4">
                  {session.questions.map(q => {
                    const answer = answers[q.id];
                    const isEditing = editingId === q.id;

                    return (
                      <div key={q.id} className="bg-surface/50 rounded-xl border border-border-subtle/50 p-5">
                        <p className="text-[14px] text-secondary font-medium mb-2">{q.text}</p>
                        {isEditing ? (
                          <div>
                            <textarea
                              value={answer || ''}
                              onChange={(e) => onEditAnswer(q.id, e.target.value)}
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primary text-[14px] focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none resize-none min-h-[80px]"
                              autoFocus
                            />
                            <button onClick={() => setEditingId(null)} className="mt-2 text-[12px] text-accent font-medium">Done editing</button>
                          </div>
                        ) : (
                          <div onClick={() => setEditingId(q.id)} className="cursor-pointer">
                            {answer?.trim() ? (
                              <p className="text-[14px] text-primary/80 leading-relaxed">{answer}</p>
                            ) : (
                              <p className="text-[14px] text-muted italic">Skipped</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Actions */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border-subtle">
          <button onClick={onBack} className="text-secondary hover:text-primary text-[15px] transition-colors">
            ← Back to questions
          </button>
          <button
            onClick={onGenerate}
            className="px-8 py-4 bg-accent text-background font-bold text-lg rounded-xl hover:bg-accent/90 transition-colors"
          >
            Generate My Output
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewScreen;
