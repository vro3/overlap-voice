import React, { useState, useEffect } from 'react';
import { Session } from '../types';

interface FeedbackViewProps {
  sessions: Session[];
  onNavigateToQuestion?: (sessionId: string, questionId: string) => void;
}

interface FeedbackAnalysis {
  overallProgress: {
    percent: number;
    completed: number;
    total: number;
  };
  themes: Array<{
    name: string;
    mentions: number;
    strength: 'strong' | 'emerging' | 'weak';
    details: string;
  }>;
  gaps: Array<{
    area: string;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
    relatedQuestionId?: string;
    relatedSessionId?: string;
  }>;
  strengths: Array<{
    area: string;
    evidence: string;
  }>;
  nextSteps: string[];
  readiness: {
    score: number;
    label: string;
    message: string;
  };
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ sessions, onNavigateToQuestion }) => {
  const [analysis, setAnalysis] = useState<FeedbackAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzedCount, setLastAnalyzedCount] = useState(0);

  // Collect all responses
  const allResponses = sessions.flatMap(session =>
    session.responses.map(r => ({
      sessionName: session.name,
      sessionId: session.id,
      questionId: r.questionId,
      questionText: r.questionText,
      transcription: r.transcription,
      summary: r.summary,
      keyInsight: r.keyInsight,
      quotable: r.quotable
    }))
  );

  const totalQuestions = sessions.reduce((acc, s) => acc + s.questions.length, 0);
  const completedCount = allResponses.length;

  // Auto-analyze when responses change significantly
  useEffect(() => {
    if (completedCount > 0 && completedCount !== lastAnalyzedCount) {
      // Only auto-analyze if we have at least 2 responses
      if (completedCount >= 2) {
        analyzeResponses();
      }
    }
  }, [completedCount]);

  const analyzeResponses = async () => {
    if (allResponses.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses: allResponses,
          totalQuestions,
          sessions: sessions.map(s => ({
            id: s.id,
            name: s.name,
            questions: s.questions.map(q => ({
              id: q.id,
              text: q.text,
              section: q.section
            })),
            completedCount: s.responses.length
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze');
      }

      const result = await response.json();
      setAnalysis(result);
      setLastAnalyzedCount(completedCount);
    } catch (err) {
      setError('Unable to generate feedback. Keep answering questions!');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-danger border-danger/20 bg-danger/5';
      case 'medium': return 'text-accent border-accent/20 bg-accent/5';
      case 'low': return 'text-info border-info/20 bg-info/5';
      default: return 'text-muted border-border-subtle bg-surface';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-success text-white';
      case 'emerging': return 'bg-accent text-white';
      case 'weak': return 'bg-muted text-white';
      default: return 'bg-surface text-secondary';
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-accent';
    return 'text-muted';
  };

  // Empty state
  if (allResponses.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 lg:pt-12 pb-32">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-accent text-[11px] font-semibold uppercase tracking-[0.12em]">Live Feedback</span>
            <span className="h-px w-8 bg-accent/30"></span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary mb-4 tracking-tight">Your Insights</h1>
          <p className="text-lg sm:text-xl text-secondary font-normal max-w-2xl leading-relaxed">Real-time analysis of your responses</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border-subtle p-12 text-center">
          <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-display font-semibold text-primary mb-3">Start answering questions</h3>
          <p className="text-secondary max-w-md mx-auto">
            As you complete questions, I'll analyze your responses and give you real-time feedback on patterns, gaps, and areas to explore.
          </p>
        </div>
      </div>
    );
  }

  // Minimum responses state
  if (allResponses.length < 2 && !analysis) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 lg:pt-12 pb-32">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-accent text-[11px] font-semibold uppercase tracking-[0.12em]">Live Feedback</span>
            <span className="h-px w-8 bg-accent/30"></span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary mb-4 tracking-tight">Your Insights</h1>
        </div>

        <div className="bg-surface rounded-2xl border border-border-subtle p-12 text-center">
          <div className="text-6xl font-display font-bold text-accent mb-4">1/{totalQuestions}</div>
          <p className="text-secondary">Answer at least 2 questions to start seeing feedback</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 lg:pt-12 pb-32 animate-fadeIn">
      {/* Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-accent text-[11px] font-semibold uppercase tracking-[0.12em]">Live Feedback</span>
          <span className="h-px w-8 bg-accent/30"></span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary mb-4 tracking-tight">Your Insights</h1>
        <p className="text-lg sm:text-xl text-secondary font-normal max-w-2xl leading-relaxed">
          Real-time analysis based on {completedCount} of {totalQuestions} responses
        </p>

        {/* Refresh Button */}
        <button
          onClick={analyzeResponses}
          disabled={isLoading}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border-subtle rounded-xl text-[13px] font-medium text-secondary hover:text-primary hover:bg-surface-hover transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-muted border-t-accent rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Analysis
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-8">
          {/* Readiness Score */}
          <div className="bg-surface rounded-2xl border border-border-subtle p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[10px] font-semibold text-muted uppercase tracking-[0.1em] mb-2">Positioning Readiness</div>
                <div className={`text-5xl font-display font-bold ${getReadinessColor(analysis.readiness.score)}`}>
                  {analysis.readiness.score}%
                </div>
                <div className="text-sm text-secondary mt-1">{analysis.readiness.label}</div>
              </div>
              <div className="w-24 h-24 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-surface-hover" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${analysis.readiness.score * 2.51} 251`}
                    className={getReadinessColor(analysis.readiness.score)}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <p className="text-secondary text-[15px] leading-relaxed">{analysis.readiness.message}</p>
          </div>

          {/* Gaps / Areas to Elaborate */}
          {analysis.gaps.length > 0 && (
            <div className="bg-surface rounded-2xl border border-border-subtle p-8">
              <div className="text-[10px] font-semibold text-danger uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Needs More Detail
              </div>
              <div className="space-y-4">
                {analysis.gaps.map((gap, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-xl border ${getPriorityColor(gap.priority)} cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={() => gap.relatedSessionId && gap.relatedQuestionId && onNavigateToQuestion?.(gap.relatedSessionId, gap.relatedQuestionId)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium text-primary mb-1">{gap.area}</div>
                        <p className="text-[14px] text-secondary leading-relaxed">{gap.suggestion}</p>
                      </div>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-1 rounded ${
                        gap.priority === 'high' ? 'bg-danger/20 text-danger' :
                        gap.priority === 'medium' ? 'bg-accent/20 text-accent' :
                        'bg-info/20 text-info'
                      }`}>
                        {gap.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emerging Themes */}
          {analysis.themes.length > 0 && (
            <div className="bg-surface rounded-2xl border border-border-subtle p-8">
              <div className="text-[10px] font-semibold text-info uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Emerging Themes
              </div>
              <div className="space-y-4">
                {analysis.themes.map((theme, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${getStrengthColor(theme.strength)}`}>
                      {theme.mentions}x
                    </span>
                    <div>
                      <div className="font-medium text-primary">{theme.name}</div>
                      <p className="text-[14px] text-secondary leading-relaxed mt-1">{theme.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div className="bg-success-soft/20 rounded-2xl border border-success/10 p-8">
              <div className="text-[10px] font-semibold text-success uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                What's Working
              </div>
              <div className="space-y-4">
                {analysis.strengths.map((strength, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-success mt-1">&#10003;</span>
                    <div>
                      <div className="font-medium text-primary">{strength.area}</div>
                      <p className="text-[14px] text-secondary leading-relaxed mt-1">{strength.evidence}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          {analysis.nextSteps.length > 0 && (
            <div className="bg-accent-soft/20 rounded-2xl border border-accent/10 p-8">
              <div className="text-[10px] font-semibold text-accent uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Suggested Next Steps
              </div>
              <ul className="space-y-3">
                {analysis.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-secondary">
                    <span className="text-accent font-bold">{i + 1}.</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Loading overlay for refresh */}
      {isLoading && analysis && (
        <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl border border-border-subtle p-8 text-center">
            <div className="w-12 h-12 border-4 border-surface-hover border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary">Analyzing your responses...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackView;
