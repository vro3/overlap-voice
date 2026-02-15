import React, { useState } from 'react';
import { Session, AppSettings } from '../types';

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  answers: Record<string, string>;
  settings: AppSettings;
  userEmail?: string;
  onLogout?: () => void;
  onOpenSettings: () => void;
  onExport: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  answers,
  settings,
  userEmail,
  onLogout,
  onOpenSettings,
  onExport,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalQuestions = sessions.reduce((acc, s) => acc + s.questions.length, 0);
  const answeredCount = sessions.reduce(
    (acc, s) => acc + s.questions.filter(q => answers[q.id]?.trim()).length,
    0
  );
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const handleSelectSession = (id: string) => {
    onSelectSession(id);
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
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
            <div className="absolute top-0 left-0 w-5 h-5 rounded-full bg-danger mix-blend-screen opacity-80" />
            <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-info mix-blend-screen opacity-80" />
            <div className="absolute top-1.5 left-1.5 w-2 h-3 bg-accent mix-blend-screen opacity-50" />
          </div>
          <h1 className="text-lg font-display font-bold tracking-tight text-primary leading-none">
            The<br />Overlap
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-4">
          <div className="mb-2">
            <span className="px-3 text-[10px] font-semibold text-muted uppercase tracking-[0.12em]">
              Your Workflow
            </span>
          </div>

          <div className="space-y-0.5 mb-4">
            {sessions.map((session, index) => {
              const sectionAnswered = session.questions.filter(q => answers[q.id]?.trim()).length;
              const isComplete = sectionAnswered === session.questions.length && session.questions.length > 0;
              const isActive = activeSessionId === session.id;

              return (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`w-full flex items-center px-3 py-2 text-[12px] rounded-lg transition-all duration-200 relative ${
                    isActive
                      ? 'bg-surface text-primary font-medium'
                      : 'text-secondary hover:text-primary hover:bg-surface-hover'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-accent rounded-full" />
                  )}
                  <div className="flex items-center w-full">
                    <div className="w-6 flex-shrink-0 flex items-center justify-center mr-3">
                      {isComplete ? (
                        <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className={`text-[10px] font-mono ${isActive ? 'text-accent' : 'text-muted'}`}>
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>
                    <span className="truncate">{session.name}</span>
                    {sectionAnswered > 0 && !isComplete && (
                      <span className="ml-auto text-[10px] text-muted">{sectionAnswered}/{session.questions.length}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Progress */}
          <div className="mx-3 mt-4 bg-surface rounded-xl p-4 border border-border-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted">Overall</span>
              <span className="text-[11px] font-medium text-primary">{progressPercent}%</span>
            </div>
            <div className="h-1.5 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-muted">
              {answeredCount} of {totalQuestions} questions
            </div>

            {/* Tier breakdown — only when setting enabled */}
            {settings.showTierIndicators && (
              <div className="mt-3 pt-3 border-t border-border-subtle space-y-1.5">
                {([
                  { tier: 'must-ask' as const, color: '#C84B4B', label: 'Must-Ask' },
                  { tier: 'should-ask' as const, color: '#D4A853', label: 'Should-Ask' },
                  { tier: 'optional' as const, color: '#8B9A6B', label: 'Optional' },
                ]).map(({ tier, color, label }) => {
                  const total = sessions.flatMap(s => s.questions).filter(q => q.tier === tier).length;
                  const done = sessions.flatMap(s => s.questions).filter(q => q.tier === tier && answers[q.id]?.trim()).length;
                  return (
                    <div key={tier} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-muted">{label}</span>
                      </div>
                      <span className="text-primary font-medium">{done}/{total}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Insights — only when enabled */}
          {settings.showAiInsightsInSidebar && settings.aiAnalysisEnabled && (
            <div className="mx-3 mt-4">
              <span className="text-[10px] font-semibold text-muted uppercase tracking-[0.12em] mb-2 block">
                AI Insights
              </span>
              {sessions.flatMap(s => s.responses.filter(r => r.summary)).length > 0 ? (
                <div className="space-y-2">
                  {sessions.flatMap(s =>
                    s.responses.filter(r => r.summary).map(r => ({
                      sessionName: s.name,
                      summary: r.summary,
                    }))
                  ).slice(-3).reverse().map((insight, i) => (
                    <div key={i} className="bg-surface rounded-lg p-3 border border-border-subtle">
                      <div className="text-[10px] text-accent mb-1">{insight.sessionName}</div>
                      <p className="text-[11px] text-secondary line-clamp-2">{insight.summary}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-muted text-center py-3">
                  Complete questions with AI enabled to see insights
                </p>
              )}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-border-subtle">
          {userEmail && (
            <div className="mb-3 px-3 py-2.5 bg-surface rounded-xl text-xs">
              <div className="text-muted mb-1">Signed in as</div>
              <div className="text-primary truncate font-medium" title={userEmail}>{userEmail}</div>
            </div>
          )}

          <button
            onClick={onExport}
            className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-border-subtle text-primary text-[13px] font-medium rounded-xl hover:bg-surface-hover transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Markdown
          </button>

          <div className="flex gap-2">
            <button
              onClick={onOpenSettings}
              className="flex-1 flex items-center justify-center gap-1.5 text-[11px] text-muted hover:text-primary transition-colors py-2 rounded-lg hover:bg-surface"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
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
