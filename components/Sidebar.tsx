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
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onSelectSession, onReset, userEmail, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    // Flatten all responses from all sessions
    const allResponses: any[] = [];
    sessions.forEach(session => {
        session.responses.forEach(res => {
            const question = session.questions.find(q => q.id === res.questionId);
            allResponses.push({
                Step: session.name,
                Section: question?.section || '',
                Question: res.questionText,
                Transcription: res.transcription,
                Summary: res.summary
            });
        });
    });

    if (allResponses.length === 0) {
        alert("No data to export yet.");
        return;
    }

    downloadCsv(allResponses, 'The_Overlap_Export.csv');
  };

  const handleSelectSession = (id: string) => {
    onSelectSession(id);
    setIsOpen(false); // Close on mobile after selection
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
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="px-3 mb-5">
          <span className="text-[10px] font-semibold text-muted uppercase tracking-[0.12em]">Your Workflow</span>
        </div>
        {sessions.map((session, index) => {
          const isComplete = session.responses.length === session.questions.length && session.questions.length > 0;
          const isActive = activeSessionId === session.id;

          return (
            <button
              key={session.id}
              onClick={() => handleSelectSession(session.id)}
              className={`w-full flex items-center px-3 py-3 text-[13px] rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-surface text-primary font-medium'
                  : 'text-secondary hover:text-primary hover:bg-surface-hover'
              }`}
            >
              {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-accent rounded-full"></div>
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
            Export Data
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