// KnowledgeSearch.tsx — v1.0.0 — 2026-02-14
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
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Knowledge Base Search</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Ask a question about your knowledge base..."
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 8,
            border: '1px solid #333', background: '#1a1a1a', color: '#fff',
            fontSize: 14,
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            background: loading ? '#444' : '#2563eb', color: '#fff',
            cursor: loading ? 'wait' : 'pointer', fontSize: 14, fontWeight: 500,
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div style={{ padding: 12, background: '#3b1010', borderRadius: 8, color: '#f87171', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {result && (
        <div>
          <div style={{
            padding: 16, background: '#111', borderRadius: 8, marginBottom: 16,
            border: '1px solid #333', lineHeight: 1.6,
          }}>
            <div style={{ whiteSpace: 'pre-wrap', color: '#e5e5e5' }}>{result.answer}</div>
          </div>

          {result.sources.length > 0 && (
            <div>
              <h3 style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>Sources</h3>
              {result.sources.map((src, i) => (
                <div key={i} style={{
                  padding: 10, background: '#1a1a1a', borderRadius: 6, marginBottom: 8,
                  border: '1px solid #262626', fontSize: 13,
                }}>
                  <div style={{ fontWeight: 500, color: '#93c5fd' }}>
                    {src.file} — {src.section}
                  </div>
                  <div style={{ color: '#888', marginTop: 4 }}>
                    {src.snippet}...
                  </div>
                  <div style={{ color: '#555', marginTop: 2, fontSize: 11 }}>
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
