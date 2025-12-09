import React, { useState } from 'react';

interface LandingPageProps {
  onLogin: (email: string) => void;
  isLoading: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    onLogin(trimmedEmail);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 relative flex-shrink-0">
              <div className="absolute top-0 left-0 w-7 h-7 rounded-full bg-red mix-blend-screen opacity-90"></div>
              <div className="absolute top-0 right-0 w-7 h-7 rounded-full bg-navy mix-blend-screen opacity-90"></div>
              <div className="absolute top-2 left-2 w-3 h-4 bg-orange mix-blend-screen opacity-50"></div>
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-primary">
              The Overlap
            </h1>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6 leading-tight">
            Let's Find Your<br />
            <span className="text-orange">Competitive Edge</span>
          </h2>

          <p className="text-xl text-secondary font-light mb-10 leading-relaxed max-w-lg">
            I'm going to ask you some questions about your business. Just talk — like you're explaining it to a friend. I'll pull out the positioning gold.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                Drop your email so you can pick up where you left off
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-4 bg-surface border border-border rounded-lg text-primary placeholder-gray-500 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/50 text-lg"
                disabled={isLoading}
                autoFocus
              />
              {error && (
                <p className="mt-2 text-red-400 text-sm">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full py-4 bg-orange text-white font-bold text-lg rounded-lg hover:bg-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  Let's Go
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-surface flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="text-xs text-secondary">Voice-First</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-surface flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-xs text-secondary">AI Insights</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-surface flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <p className="text-xs text-secondary">Auto-Save</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center border-t border-border">
        <p className="text-xs text-gray-600">
          Everything auto-saves. Come back anytime with the same email.
        </p>
        <p className="text-xs text-gray-700 mt-2">v1.0.4</p>
      </div>
    </div>
  );
};

export default LandingPage;
