// search.ts — v1.1.0 — 2026-02-15
// Searches chunked knowledge base using keyword matching + Gemini answer generation

import { GoogleGenAI } from '@google/genai';
import { createClient } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const kv = createClient({
  url: process.env.STORAGE_REST_API_URL!,
  token: process.env.STORAGE_REST_API_TOKEN!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST required' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API_KEY not configured' });
  }

  const { query, limit = 5 } = req.body as { query: string; limit?: number };
  if (!query) {
    return res.status(400).json({ error: 'query required' });
  }

  const sanitizedQuery = query.replace(/[<>{}[\]\\\/]/g, '').slice(0, 500);
  const safeLimit = Math.min(Math.max(1, Number(limit) || 5), 20);

  try {
    // 1. Get master index
    const index = await kv.get<{ documents: Array<{ file: string; chunks: number; words: number }> }>('knowledge:index');
    if (!index) {
      return res.status(404).json({ error: 'No knowledge base ingested. Run POST /api/knowledge/ingest first.' });
    }

    // 2. Search chunks by keyword matching
    const queryTerms = sanitizedQuery.toLowerCase().split(/\s+/).filter((t: string) => t.length > 2);
    const matchedChunks: Array<{ chunk: any; score: number }> = [];

    for (const doc of index.documents) {
      const docData = await kv.get<{ chunkIds?: string[] }>(`doc:${doc.file}`);
      if (!docData) continue;

      for (const chunkId of (docData.chunkIds || [])) {
        const chunk = await kv.get<{ sectionTitle: string; content: string; sourceFile: string; lineStart: number; lineEnd: number }>(`chunk:${chunkId}`);
        if (!chunk) continue;

        const contentLower = `${chunk.sectionTitle} ${chunk.content}`.toLowerCase();
        let score = 0;
        for (const term of queryTerms) {
          const matches = contentLower.split(term).length - 1;
          score += matches;
        }

        if (score > 0) {
          matchedChunks.push({ chunk, score });
        }
      }
    }

    matchedChunks.sort((a, b) => b.score - a.score);
    const topChunks = matchedChunks.slice(0, safeLimit);

    if (topChunks.length === 0) {
      return res.status(200).json({
        answer: `I couldn't find anything in the knowledge base matching "${sanitizedQuery}". Try different keywords.`,
        sources: [],
      });
    }

    // 3. Generate answer with Gemini
    const context = topChunks
      .map((m, i) => `[Source ${i + 1}: ${m.chunk.sourceFile} — ${m.chunk.sectionTitle}]\n${m.chunk.content.slice(0, 1500)}`)
      .join('\n\n---\n\n');

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a knowledge base assistant. Answer the user's question using ONLY the provided sources. If the sources don't contain enough information, say so. Cite sources by number [Source N].

QUESTION: ${sanitizedQuery}

SOURCES:
${context}

Answer concisely and accurately. Always cite which source(s) you're drawing from.`,
      config: { temperature: 0.2 },
    });

    const answer = response?.text || 'Unable to generate answer.';

    return res.status(200).json({
      answer,
      sources: topChunks.map(m => ({
        file: m.chunk.sourceFile,
        section: m.chunk.sectionTitle,
        snippet: m.chunk.content.slice(0, 200),
        score: m.score,
        lineRange: `${m.chunk.lineStart}-${m.chunk.lineEnd}`,
      })),
    });
  } catch (error: any) {
    console.error('Knowledge search error:', error);
    return res.status(500).json({ error: 'Search failed' });
  }
}
