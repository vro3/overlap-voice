import React from 'react';

interface ProcessVisionScreenProps {
  onStart: () => void;
  onOpenSettings: () => void;
  onSkip?: () => void;
}

const ProcessVisionScreen: React.FC<ProcessVisionScreenProps> = ({ onStart, onOpenSettings, onSkip }) => {
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
        <div className="max-w-4xl w-full">
          {/* Wordmark */}
          <h1 className="text-[13px] font-semibold text-accent uppercase tracking-[0.2em] mb-10 text-center">
            THE OVERLAP
          </h1>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-display font-bold text-primary mb-8 leading-[1.1] tracking-tight text-center">
            What would it look like if this actually worked?
          </h2>

          {/* Subline */}
          <p className="text-lg md:text-xl text-muted font-light leading-relaxed max-w-2xl mx-auto mb-16 text-center">
            Not "worked" in the abstract. Worked for you. Right now. In the next 90 days.
          </p>

          {/* Vision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Column 1: The Problem */}
            <div className="bg-surface rounded-2xl border border-border-subtle p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-danger/60 mt-2 flex-shrink-0" />
                <h3 className="text-primary font-display font-semibold text-lg">Without This</h3>
              </div>
              <ul className="space-y-3 text-muted text-[15px] leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-secondary/40 mt-1">→</span>
                  <span>You spend 3 hours explaining yourself to a new AI tool</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary/40 mt-1">→</span>
                  <span>It generates something technically correct but doesn't sound like you</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary/40 mt-1">→</span>
                  <span>You're back to manual work because you can't trust it with the details</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary/40 mt-1">→</span>
                  <span>The tool sits unused. You go back to doing it yourself.</span>
                </li>
              </ul>
            </div>

            {/* Column 2: The Vision */}
            <div className="bg-surface rounded-2xl border border-border-subtle p-8 border-accent/30 bg-accent/5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-success/60 mt-2 flex-shrink-0" />
                <h3 className="text-primary font-display font-semibold text-lg">With The Overlap</h3>
              </div>
              <ul className="space-y-3 text-muted text-[15px] leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-accent/60 mt-1">→</span>
                  <span>You spend 90 minutes answering real questions about how you actually work</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent/60 mt-1">→</span>
                  <span>You get a knowledge file that sounds exactly like you</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent/60 mt-1">→</span>
                  <span>You paste it into any AI tool and get back work that matches your standards</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent/60 mt-1">→</span>
                  <span>You actually use it. For 30 days straight. Then it becomes normal.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="bg-surface rounded-2xl border border-border-subtle p-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-display font-bold text-accent mb-2">90min</div>
                <div className="text-sm text-muted">Your time to extract what you know</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-display font-bold text-accent mb-2">20K+</div>
                <div className="text-sm text-muted">Line knowledge base you can reuse immediately</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-display font-bold text-accent mb-2">30min</div>
                <div className="text-sm text-muted">Time saved per week (first month, proven)</div>
              </div>
            </div>
          </div>

          {/* The Process */}
          <div className="mb-16">
            <h3 className="text-primary font-display font-semibold text-xl mb-6 text-center">Here's how it works</h3>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Answer Questions (Your Way)', desc: 'Talk or type. Skip what doesn\'t apply. No corporate questions, no fake setup.' },
                { step: '2', title: 'We Extract Your Voice', desc: '82 strategic questions across 10 sections. Organized. Designed for how AI actually learns.' },
                { step: '3', title: 'You Get a Knowledge File', desc: 'Complete markdown file of your brain. Download it. Use it everywhere. Forever.' },
                { step: '4', title: 'You Use It (Immediately)', desc: 'Paste into Claude, ChatGPT, your tools. Watch how much better they work when they know you.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-bold text-sm">{step}</span>
                  </div>
                  <div className="pt-1">
                    <h4 className="text-primary font-semibold mb-1">{title}</h4>
                    <p className="text-muted text-[15px]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onStart}
              className="px-10 py-4 bg-accent text-background font-bold text-lg rounded-xl hover:bg-accent/90 transition-all shadow-glow hover:shadow-[0_0_30px_rgba(212,168,83,0.25)]"
            >
              Show Me What This Looks Like
            </button>
            {onSkip && (
              <button
                onClick={onSkip}
                className="px-8 py-4 text-muted hover:text-primary text-[14px] transition-colors"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center border-t border-border-subtle">
        <p className="text-[11px] text-muted/60">The Overlap v2.2</p>
      </div>
    </div>
  );
};

export default ProcessVisionScreen;
