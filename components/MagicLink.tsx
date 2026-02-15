import React, { useState } from 'react';

interface MagicLinkProps {
  onComplete: (email: string) => void;
}

const MagicLink: React.FC<MagicLinkProps> = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }
    onComplete(trimmed);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full animate-fadeIn">
        <div className="bg-surface rounded-2xl border border-border-subtle p-8 md:p-10 shadow-card">
          <h2 className="text-2xl font-display font-bold text-primary mb-2">Before we start</h2>
          <p className="text-secondary mb-8">Your email lets us save your progress so you can come back anytime.</p>

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
              Continue
            </button>
          </form>

          <p className="text-muted text-sm text-center mt-6">No account needed. Just your email so we can save your answers.</p>
        </div>
      </div>
    </div>
  );
};

export default MagicLink;
