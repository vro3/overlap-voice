// KnowledgeSearch.tsx — v1.1.0 — 2026-06-12
// Search interface for Overlap client knowledge bases

import { useState } from 'react';

interface SearchSource {
  file: string;
  section: string;
  snippet: string;
  score: number;
  lineRange: string;
}

interface SearchResult {
  answer: string;
  sources: SearchSource[];
}

export function KnowledgeSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/knowledge/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[700px] mx-auto p-6">
      <h2 className="text-xl font-semibold text-primary mb-4">Knowledge Base Search</h2>

      <div data-tour="overlap-search" className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Ask a question about your knowledge base..."
          className="flex-1 px-3.5 py-2.5 rounded-lg border border-border-subtle bg-surface text-primary placeholder-muted/60 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="px-5 py-2.5 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
          {error}
        </div>
      )}

      {result && (
        <div>
          <div className="p-4 mb-4 rounded-xl bg-surface border border-border-subtle leading-relaxed">
            <div className="whitespace-pre-wrap text-primary">{result.answer}</div>
          </div>

          {result.sources.length > 0 && (
            <div>
              <h3 className="text-[11px] font-semibold text-muted uppercase tracking-[0.15em] mb-2">Sources</h3>
              {result.sources.map((src, i) => (
                <div key={i} className="p-2.5 mb-2 rounded-lg bg-surface border border-border-subtle text-[13px]">
                  <div className="font-medium text-accent">
                    {src.file} — {src.section}
                  </div>
                  <div className="text-muted mt-1">
                    {src.snippet}...
                  </div>
                  <div className="text-muted/70 mt-0.5 text-[11px]">
                    Lines {src.lineRange} · Relevance: {src.score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
