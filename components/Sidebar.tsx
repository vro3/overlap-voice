import React from 'react';
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

  return (
    <aside className="w-64 bg-sidebar border-r border-border flex flex-col flex-shrink-0 z-30 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 relative flex-shrink-0">
            <div className="absolute top-0 left-0 w-5 h-5 rounded-full bg-red mix-blend-screen opacity-90"></div>
            <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-navy mix-blend-screen opacity-90"></div>
            <div className="absolute top-1.5 left-1.5 w-2 h-3 bg-orange mix-blend-screen opacity-50"></div>
        </div>
        <h1 className="text-lg font-display font-bold tracking-tight text-primary leading-none">The<br/>Overlap</h1>
      </div>
      
      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-0.5 custom-scrollbar">
        <div className="px-3 mb-4">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Your Workflow</span>
        </div>
        {sessions.map((session, index) => {
          const isComplete = session.responses.length === session.questions.length && session.questions.length > 0;
          const isActive = activeSessionId === session.id;
          
          return (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full flex items-center px-3 py-3 text-sm rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? 'bg-surface text-white font-medium'
                  : 'text-secondary hover:text-white hover:bg-surface/50'
              }`}
            >
              {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange rounded-l-lg"></div>
              )}
              
              <div className="flex items-center w-full">
                  <div className={`w-6 flex-shrink-0 flex items-center justify-center mr-2`}>
                     {isComplete ? (
                         <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                     ) : (
                         <span className={`text-[10px] font-mono ${isActive ? 'text-orange' : 'text-gray-600'}`}>{(index + 1).toString().padStart(2, '0')}</span>
                     )}
                  </div>
                  <span className="truncate">{session.name}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-sidebar">
         {/* User info */}
         {userEmail && (
           <div className="mb-3 px-2 py-2 bg-background/50 rounded text-xs">
             <div className="text-gray-500 mb-1">Signed in as</div>
             <div className="text-primary truncate" title={userEmail}>{userEmail}</div>
           </div>
         )}

         <button
            onClick={handleExport}
            className="w-full mb-2 flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-border text-primary text-sm font-medium rounded hover:bg-gray-700 transition-colors"
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export Data
         </button>

         <div className="flex gap-2">
           <button
             onClick={onReset}
             className="flex-1 text-xs text-secondary hover:text-red-400 transition-colors text-center py-2"
           >
             Reset
           </button>
           {onLogout && (
             <button
               onClick={onLogout}
               className="flex-1 text-xs text-secondary hover:text-orange transition-colors text-center py-2"
             >
               Sign Out
             </button>
           )}
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;