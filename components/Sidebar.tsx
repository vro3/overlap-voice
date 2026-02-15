import React, { useState } from 'react';
import { Session } from '../types';
import { downloadCsv } from '../utils/audioUtils';

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onReset: () => void;
  userEmail?: string;
  onLogout?: () => void;
  showFeedback?: boolean;
  onShowFeedback?: () => void;
  showSearch?: boolean;
  onShowSearch?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onSelectSession, onReset, userEmail, onLogout, showFeedback, onShowFeedback, showSearch, onShowSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [workflowExpanded, setWorkflowExpanded] = useState(true);
  const [insightsExpanded, setInsightsExpanded] = useState(true);

  // Collect all insights from completed responses
  const allInsights = sessions.flatMap(session =>
    session.responses
      .filter(r => r.keyInsight || r.summary)
      .map(r => ({
        sessionName: session.name,
        questionText: r.questionText,
        summary: r.summary,
        keyInsight: r.keyInsight,
        quotable: r.quotable
      }))
  );

  const totalQuestions = sessions.reduce((acc, s) => acc + s.questions.length, 0);
  const completedQuestions = sessions.reduce((acc, s) => acc + s.responses.length, 0);
  const progressPercent = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  // Calculate tier breakdown
  const allQuestions = sessions.flatMap(s => s.questions);
  const mustAskTotal = allQuestions.filter(q => q.tier === 'must-ask').length;
  const shouldAskTotal = allQuestions.filter(q => q.tier === 'should-ask').length;
  const optionalTotal = allQuestions.filter(q => q.tier === 'optional').length;

  const completedQuestionIds = new Set(sessions.flatMap(s => s.responses.map(r => r.questionId)));
  const mustAskCompleted = allQuestions.filter(q => q.tier === 'must-ask' && completedQuestionIds.has(q.id)).length;
  const shouldAskCompleted = allQuestions.filter(q => q.tier === 'should-ask' && completedQuestionIds.has(q.id)).length;
  const optionalCompleted = allQuestions.filter(q => q.tier === 'optional' && completedQuestionIds.has(q.id)).length;

  const handleExport = () => {
    // Build markdown with tier indicators
    let markdown = `# The Overlap — Completed Questionnaire\n`;
    markdown += `## ${userEmail || 'Your Business'} | ${new Date().toLocaleDateString()}\n\n`;
    markdown += `---\n\n`;

    sessions.forEach((session) => {
      if (session.responses.length === 0) return; // Skip empty sessions

      markdown += `## ${session.name}\n`;
      markdown += `*${session.subtitle}*\n\n`;

      session.questions.forEach((question) => {
        const response = session.responses.find(r => r.questionId === question.id);
        if (!response) return; // Skip unanswered questions

        // Add tier indicator
        let tierEmoji = '';
        switch (question.tier) {
          case 'must-ask':
            tierEmoji = '🔴';
            break;
          case 'should-ask':
            tierEmoji = '🟡';
            break;
          case 'optional':
            tierEmoji = '🟢';
            break;
        }

        markdown += `### ${tierEmoji} ${question.text}\n`;
        markdown += `${response.transcription}\n\n`;

        // Optional: include AI summary
        if (response.summary) {
          markdown += `**AI Summary:** ${response.summary}\n\n`;
        }
      });

      markdown += `---\n\n`;
    });

    if (sessions.every(s => s.responses.length === 0)) {
      alert("No data to export yet.");
      return;
    }

    // Download as markdown file
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'The_Overlap_Export.md');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectSession = (id: string) => {
    onSelectSession(id);
    setIsOpen(false); // Close on mobile after selection
  };

  const handleShowFeedback = () => {
    onShowFeedback?.();
    setIsOpen(false);
  };

  const handleShowSearch = () => {
    onShowSearch?.();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-surface border border-border rounded-xl shadow-soft"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-72 bg-sidebar border-r border-border-subtle flex flex-col flex-shrink-0 z-40 h-screen
        fixed lg:sticky top-0 left-0
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Brand Header */}
      <div className="p-6 border-b border-border-subtle flex items-center gap-3">
        <div className="w-9 h-9 relative flex-shrink-0">
            <div className="absolute top-0 left-0 w-5 h-5 rounded-full bg-danger mix-blend-screen opacity-80"></div>
            <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-info mix-blend-screen opacity-80"></div>
            <div className="absolute top-1.5 left-1.5 w-2 h-3 bg-accent mix-blend-screen opacity-50"></div>
        </div>
        <h1 className="text-lg font-display font-bold tracking-tight text-primary leading-none">The<br/>Overlap</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
        {/* Your Workflow Section */}
        <div className="mb-2">
          <button
            onClick={() => setWorkflowExpanded(!workflowExpanded)}
            className="w-full px-3 py-2 flex items-center justify-between text-muted hover:text-secondary transition-colors rounded-lg hover:bg-surface-hover"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">Your Workflow</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-3.5 w-3.5 transition-transform duration-200 ${workflowExpanded ? '' : '-rotate-90'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {workflowExpanded && (
          <div className="space-y-0.5 mb-3">
            {sessions.map((session, index) => {
              const isComplete = session.responses.length === session.questions.length && session.questions.length > 0;
              const isActive = activeSessionId === session.id && !showFeedback && !showSearch;

              return (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`w-full flex items-center px-3 py-2 text-[12px] rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-surface text-primary font-medium'
                      : 'text-secondary hover:text-primary hover:bg-surface-hover'
                  }`}
                >
                  {isActive && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-accent rounded-full"></div>
                  )}

                  <div className="flex items-center w-full">
                      <div className={`w-6 flex-shrink-0 flex items-center justify-center mr-3`}>
                         {isComplete ? (
                             <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                         ) : (
                             <span className={`text-[10px] font-mono ${isActive ? 'text-accent' : 'text-muted'}`}>{(index + 1).toString().padStart(2, '0')}</span>
                         )}
                      </div>
                      <span className="truncate">{session.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border-subtle my-2"></div>

        {/* Your Results Section */}
        <div className="mb-2">
          <button
            onClick={() => setInsightsExpanded(!insightsExpanded)}
            className="w-full px-3 py-2 flex items-center justify-between text-muted hover:text-secondary transition-colors rounded-lg hover:bg-surface-hover"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">Your Results</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-3.5 w-3.5 transition-transform duration-200 ${insightsExpanded ? '' : '-rotate-90'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {insightsExpanded && (
          <div className="space-y-3 px-3">
            {/* Live Feedback Button */}
            <button
              onClick={handleShowFeedback}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                showFeedback
                  ? 'bg-accent/10 border-accent/30 text-accent'
                  : 'bg-surface border-border-subtle text-primary hover:bg-surface-hover hover:border-border'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div className="text-left">
                <div className="text-[13px] font-medium">Live Feedback</div>
                <div className="text-[10px] text-muted">Real-time analysis</div>
              </div>
              {showFeedback && (
                <div className="ml-auto w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              )}
            </button>

            {/* Knowledge Search Button */}
            <button
              onClick={handleShowSearch}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                showSearch
                  ? 'bg-accent/10 border-accent/30 text-accent'
                  : 'bg-surface border-border-subtle text-primary hover:bg-surface-hover hover:border-border'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <div className="text-left">
                <div className="text-[13px] font-medium">Knowledge Search</div>
                <div className="text-[10px] text-muted">Search your knowledge base</div>
              </div>
              {showSearch && (
                <div className="ml-auto w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              )}
            </button>

            {/* Progress */}
            <div className="bg-surface rounded-xl p-4 border border-border-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-muted">Progress</span>
                <span className="text-[11px] font-medium text-primary">{progressPercent}%</span>
              </div>
              <div className="h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="mt-2 text-[10px] text-muted">
                {completedQuestions} of {totalQuestions} questions
              </div>

              {/* Tier breakdown */}
              <div className="mt-4 pt-3 border-t border-border-subtle space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C84B4B' }} />
                    <span className="text-muted">Must-Ask</span>
                  </div>
                  <span className="text-primary font-medium">{mustAskCompleted}/{mustAskTotal}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#D97706' }} />
                    <span className="text-muted">Should-Ask</span>
                  </div>
                  <span className="text-primary font-medium">{shouldAskCompleted}/{shouldAskTotal}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#059669' }} />
                    <span className="text-muted">Optional</span>
                  </div>
                  <span className="text-primary font-medium">{optionalCompleted}/{optionalTotal}</span>
                </div>
              </div>
            </div>

            {/* Recent Insights */}
            {allInsights.length > 0 ? (
              <div className="space-y-2">
                <div className="text-[10px] text-muted px-1">Recent Insights</div>
                {allInsights.slice(-3).reverse().map((insight, i) => (
                  <div key={i} className="bg-surface rounded-lg p-3 border border-border-subtle">
                    <div className="text-[10px] text-accent mb-1 truncate">{insight.sessionName}</div>
                    <p className="text-[11px] text-secondary line-clamp-2 leading-relaxed">
                      {insight.keyInsight || insight.summary}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-muted text-center py-4 px-3">
                Complete questions to see your insights here
              </div>
            )}

            {/* Quotables Preview */}
            {allInsights.filter(i => i.quotable).length > 0 && (
              <div className="bg-highlight-soft/20 rounded-lg p-3 border border-highlight/10">
                <div className="text-[10px] text-highlight mb-2">In Your Words</div>
                <p className="text-[11px] text-secondary italic line-clamp-2">
                  "{allInsights.filter(i => i.quotable)[0]?.quotable}"
                </p>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-border-subtle">
         {/* User info */}
         {userEmail && (
           <div className="mb-4 px-3 py-2.5 bg-surface rounded-xl text-xs">
             <div className="text-muted mb-1">Signed in as</div>
             <div className="text-primary truncate font-medium" title={userEmail}>{userEmail}</div>
           </div>
         )}

         <button
            onClick={handleExport}
            className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-border-subtle text-primary text-[13px] font-medium rounded-xl hover:bg-surface-hover transition-all"
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export Markdown
         </button>

         <div className="flex gap-2">
           <button
             onClick={onReset}
             className="flex-1 text-[11px] text-muted hover:text-danger transition-colors text-center py-2 rounded-lg hover:bg-surface"
           >
             Reset
           </button>
           {onLogout && (
             <button
               onClick={onLogout}
               className="flex-1 text-[11px] text-muted hover:text-accent transition-colors text-center py-2 rounded-lg hover:bg-surface"
             >
               Sign Out
             </button>
           )}
         </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;