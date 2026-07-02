// ErrorBoundary.tsx — v1.0.0 — 2026-07-02
// App-wide crash guard. A render-time throw anywhere below this boundary
// shows a recovery screen instead of a blank white page — critical for a
// tool where users invest 20-60 minutes typing answers. Their progress is
// held in localStorage, so a reload recovers it.

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log a message string, not the full user-context object.
    console.error('[Overlap] Unhandled render error:', error.message, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-background text-primary flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-display font-medium mb-3">Something went wrong</h1>
          <p className="text-secondary leading-relaxed mb-6">
            The app hit an unexpected error. Your answers are saved on this device — reload
            to pick up where you left off. If it keeps happening, use the Restore option with
            a downloaded backup.
          </p>
          <button
            onClick={this.handleReload}
            className="px-5 py-2.5 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
