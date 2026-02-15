// search.ts — v1.0.0 — 2026-02-14
// Searches chunked knowledge base using keyword matching + Gemini answer generation

import { GoogleGenAI } from '@google/genai';
import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

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

  try {
    // 1. Get master index
    const indexRaw = await kv.get('knowledge:index') as string | null;
    if (!indexRaw) {
      return res.status(404).json({ error: 'No knowledge base ingested. Run POST /api/knowledge/ingest first.' });
    }
    const index = typeof indexRaw === 'string' ? JSON.parse(indexRaw) : indexRaw;

    // 2. Search chunks by keyword matching
    const queryTerms = query.toLowerCase().split(/\s+/).filter((t: string) => t.length > 2);
    const matchedChunks: Array<{ chunk: any; score: number }> = [];

    for (const doc of index.documents) {
      const docMeta = await kv.get(`doc:${doc.file}`) as string | null;
      if (!docMeta) continue;
      const docData = typeof docMeta === 'string' ? JSON.parse(docMeta) : docMeta;

      for (const chunkId of (docData.chunkIds || [])) {
        const chunkRaw = await kv.get(`chunk:${chunkId}`) as string | null;
        if (!chunkRaw) continue;
        const chunk = typeof chunkRaw === 'string' ? JSON.parse(chunkRaw) : chunkRaw;

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
    const topChunks = matchedChunks.slice(0, limit);

    if (topChunks.length === 0) {
      return res.status(200).json({
        answer: `I couldn't find anything in the knowledge base matching "${query}". Try different keywords.`,
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

QUESTION: ${query}

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
    return res.status(500).json({ error: error.message });
  }
}
