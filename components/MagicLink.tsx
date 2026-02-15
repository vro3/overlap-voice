import React, { useState } from 'react';

interface MagicLinkProps {
  onComplete: (email: string) => void;
}

const MagicLink: React.FC<MagicLinkProps> = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }
    setSent(true);
    setTimeout(() => onComplete(trimmed), 2000);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center animate-fadeIn">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-primary mb-3">Check your email!</h2>
          <p className="text-secondary">We sent a magic link to <span className="text-primary font-medium">{email}</span></p>
          <p className="text-muted text-sm mt-4">Redirecting you now...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full animate-fadeIn">
        <div className="bg-surface rounded-2xl border border-border-subtle p-8 md:p-10 shadow-card">
          <h2 className="text-2xl font-display font-bold text-primary mb-2">Welcome</h2>
          <p className="text-secondary mb-8">Enter your email to save your progress and pick up where you left off anytime.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                className="w-full px-4 py-4 bg-background border border-border rounded-xl text-primary placeholder-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-lg"
                autoFocus
              />
              {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={!email.trim()}
              className="w-full py-4 bg-accent text-background font-bold text-lg rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send me a magic link
            </button>
          </form>

          <p className="text-muted text-sm text-center mt-6">No password needed. We'll send you a link to continue anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default MagicLink;
