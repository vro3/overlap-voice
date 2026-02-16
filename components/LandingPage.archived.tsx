import React, { useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
  onOpenSettings: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenSettings }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Settings Gear */}
      <button
        onClick={onOpenSettings}
        className="absolute top-6 right-6 p-2.5 text-muted hover:text-primary transition-colors rounded-lg hover:bg-surface"
        title="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* Wordmark */}
          <h1 className="text-[13px] font-semibold text-accent uppercase tracking-[0.2em] mb-10">
            THE OVERLAP
          </h1>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-display font-bold text-primary mb-6 leading-[1.1] tracking-tight">
            You know AI could help you.{' '}
            <span className="text-secondary">You just don't know how to tell it who you are.</span>
          </h2>

          {/* Subline */}
          <p className="text-lg md:text-xl text-muted font-light leading-relaxed max-w-xl mx-auto mb-12">
            This guided process extracts what you know, how you work, and what makes you different —
            so AI tools can actually be useful to you.
          </p>

          {/* CTA */}
          <button
            onClick={onStart}
            className="px-10 py-4 bg-accent text-background font-bold text-lg rounded-xl hover:bg-accent/90 transition-all shadow-glow hover:shadow-[0_0_30px_rgba(212,168,83,0.25)]"
          >
            Take the First Step
          </button>

          {/* Learn More */}
          <div className="mt-10">
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-muted hover:text-secondary text-[14px] transition-colors flex items-center gap-1.5 mx-auto"
            >
              Learn more
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${showMore ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMore && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left animate-fadeIn">
                <div className="bg-surface rounded-2xl border border-border-subtle p-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="text-primary font-display font-semibold mb-2">Talk or Type</h3>
                  <p className="text-muted text-[14px] leading-relaxed">
                    Answer questions by voice or text. Like explaining your business to a friend.
                  </p>
                </div>
                <div className="bg-surface rounded-2xl border border-border-subtle p-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-primary font-display font-semibold mb-2">82 Smart Questions</h3>
                  <p className="text-muted text-[14px] leading-relaxed">
                    Organized across 10 sections. Skip what doesn't apply. Come back anytime.
                  </p>
                </div>
                <div className="bg-surface rounded-2xl border border-border-subtle p-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <h3 className="text-primary font-display font-semibold mb-2">Download Your Brain</h3>
                  <p className="text-muted text-[14px] leading-relaxed">
                    Get a complete knowledge file you can feed into any AI tool.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center border-t border-border-subtle">
        <p className="text-[11px] text-muted/60">The Overlap v2.1</p>
      </div>
    </div>
  );
};

export default LandingPage;
