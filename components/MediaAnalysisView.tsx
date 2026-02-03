import React, { useState, useEffect } from 'react';

interface MediaAnalysisProps {
  mediaLibraryResponse: string;
}

interface MediaItem {
  title: string;
  author?: string;
  type: string;
  keyThemes?: string[];
}

interface MediaAnalysis {
  parsedMedia: MediaItem[];
  commonThemes: string[];
  languagePatterns?: string[];
  mentalModels?: string[];
  valuesAlignment: string;
  businessAlignment: string;
  recommendedDirection?: string;
}

const MediaAnalysisView: React.FC<MediaAnalysisProps> = ({ mediaLibraryResponse }) => {
  const [analysis, setAnalysis] = useState<MediaAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeMedia = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-media-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaList: mediaLibraryResponse })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze media library');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('Failed to analyze your media library. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mediaLibraryResponse && !analysis) {
      analyzeMedia();
    }
  }, [mediaLibraryResponse]);

  if (!mediaLibraryResponse) {
    return (
      <div className="bg-surface rounded-2xl border border-border-subtle p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p className="text-muted text-sm">Answer the Media Library question to see your influence analysis</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-surface rounded-2xl border border-border-subtle p-12 text-center">
        <div className="w-12 h-12 border-[3px] border-border border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted text-sm">Analyzing your influences...</p>
        <p className="text-muted/60 text-xs mt-2">Extracting themes, patterns, and mental models</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-soft/20 border border-danger/20 rounded-2xl p-8 text-center">
        <p className="text-danger text-sm mb-4">{error}</p>
        <button
          onClick={analyzeMedia}
          className="text-xs text-accent hover:text-accent/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent/10 to-info/10 rounded-2xl border border-accent/20 p-6">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div>
            <h3 className="text-lg font-display font-semibold text-primary mb-2">Your Influence Analysis</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Based on the books, podcasts, blogs, and videos you resonate with, here's what we discovered about how you think and communicate.
            </p>
          </div>
        </div>
      </div>

      {/* Parsed Media */}
      {analysis.parsedMedia && analysis.parsedMedia.length > 0 && (
        <div className="bg-surface rounded-xl border border-border-subtle p-6">
          <h4 className="text-[10px] font-semibold text-muted uppercase tracking-[0.12em] mb-4">Your Media Diet</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.parsedMedia.map((item, i) => (
              <div key={i} className="bg-background rounded-lg p-3 border border-border-subtle">
                <div className="flex items-start gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium capitalize">
                    {item.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{item.title}</p>
                    {item.author && <p className="text-xs text-muted mt-0.5">{item.author}</p>}
                  </div>
                </div>
                {item.keyThemes && item.keyThemes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.keyThemes.map((theme, j) => (
                      <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/10 text-muted">
                        {theme}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Themes */}
      {analysis.commonThemes && analysis.commonThemes.length > 0 && (
        <div className="bg-info-soft/20 border border-info/10 rounded-xl p-6">
          <h4 className="text-[10px] font-semibold text-info uppercase tracking-[0.12em] mb-3">Recurring Themes</h4>
          <ul className="space-y-2">
            {analysis.commonThemes.map((theme, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                <span className="text-info mt-1">→</span>
                <span className="leading-relaxed">{theme}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Language Patterns */}
      {analysis.languagePatterns && analysis.languagePatterns.length > 0 && (
        <div className="bg-highlight-soft/20 border border-highlight/10 rounded-xl p-6">
          <h4 className="text-[10px] font-semibold text-highlight uppercase tracking-[0.12em] mb-3">Language Patterns</h4>
          <p className="text-xs text-muted mb-3">How these sources communicate</p>
          <ul className="space-y-2">
            {analysis.languagePatterns.map((pattern, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                <span className="text-highlight mt-1">→</span>
                <span className="leading-relaxed">{pattern}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mental Models */}
      {analysis.mentalModels && analysis.mentalModels.length > 0 && (
        <div className="bg-success-soft/20 border border-success/10 rounded-xl p-6">
          <h4 className="text-[10px] font-semibold text-success uppercase tracking-[0.12em] mb-3">Mental Models</h4>
          <p className="text-xs text-muted mb-3">Frameworks reflected across your influences</p>
          <ul className="space-y-2">
            {analysis.mentalModels.map((model, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                <span className="text-success mt-1">→</span>
                <span className="leading-relaxed">{model}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Values Alignment */}
      <div className="bg-accent-soft/20 border border-accent/20 rounded-xl p-6">
        <h4 className="text-[10px] font-semibold text-accent uppercase tracking-[0.12em] mb-3">What This Reveals About You</h4>
        <p className="text-sm text-secondary leading-relaxed">{analysis.valuesAlignment}</p>
      </div>

      {/* Business Alignment */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
        <h4 className="text-[10px] font-semibold text-primary uppercase tracking-[0.12em] mb-3">How This Shows Up In Your Work</h4>
        <p className="text-sm text-secondary leading-relaxed">{analysis.businessAlignment}</p>
      </div>

      {/* Recommended Direction */}
      {analysis.recommendedDirection && (
        <div className="bg-gradient-to-br from-success/10 to-info/10 rounded-xl border border-success/20 p-6">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-[10px] font-semibold text-success uppercase tracking-[0.12em] mb-2">Recommended Positioning Direction</h4>
              <p className="text-sm text-secondary leading-relaxed">{analysis.recommendedDirection}</p>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center pt-4">
        <button
          onClick={analyzeMedia}
          className="text-xs text-muted hover:text-accent transition-colors inline-flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Re-analyze
        </button>
      </div>
    </div>
  );
};

export default MediaAnalysisView;
