import React from 'react';
import { Session } from '../types';
import { generateMarkdown, downloadMarkdown } from '../utils/generateMarkdown';

interface OutputScreenProps {
  email: string;
  sessions: Session[];
  answers: Record<string, string>;
  routerAnswer: string;
  aiEnabled: boolean;
  onStartOver: () => void;
}

const OutputScreen: React.FC<OutputScreenProps> = ({ email, sessions, answers, routerAnswer, aiEnabled, onStartOver }) => {
  const answeredCount = Object.values(answers).filter((v: string) => v?.trim()).length + (routerAnswer ? 1 : 0);

  const handleDownload = () => {
    const md = generateMarkdown(email, sessions, answers, routerAnswer, aiEnabled);
    downloadMarkdown(md, email);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full text-center animate-fadeIn">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-success/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">Your knowledge has been captured.</h1>
        <p className="text-secondary text-lg mb-2">You answered {answeredCount} questions across {sessions.length} sections.</p>
        <p className="text-muted mb-10">This is the foundation that any AI system can use to understand you and your work.</p>

        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-background font-bold text-lg rounded-xl hover:bg-accent/90 transition-colors mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download as Markdown
        </button>

        <div className="bg-surface rounded-2xl border border-border-subtle p-8 mt-8 text-left">
          <h3 className="text-[11px] font-semibold text-muted uppercase tracking-[0.15em] mb-4">Coming Soon</h3>
          <div className="space-y-3">
            {['Save to OpenClaw', 'Export to Claude', 'Export to ChatGPT', 'Connect to your website'].map(item => (
              <div key={item} className="flex items-center gap-3 text-muted text-[14px]">
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-border" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <button onClick={onStartOver} className="mt-10 text-muted hover:text-primary text-[14px] transition-colors">
          Start a new extraction
        </button>
      </div>
    </div>
  );
};

export default OutputScreen;
