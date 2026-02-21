// ingest.ts — v1.4.0 — 2026-02-21
// Ingests markdown files from data/documents/, chunks them, stores in Vercel KV

import { createClient } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { chunkByHeaders } from '../../src/lib/chunker.js';
import fs from 'fs';
import path from 'path';
// ESM package ("type":"module") — use process.cwd() which resolves to /var/task in Vercel
// includeFiles in vercel.json copies data/documents/ to /var/task/data/documents/

const kv = createClient({
  url: process.env.STORAGE_REST_API_URL!,
  token: process.env.STORAGE_REST_API_TOKEN!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST required' });
  }

  const authHeader = req.headers['authorization'];
  if (!process.env.CRON_SECRET) {
    console.error('[Ingest] CRON_SECRET not configured');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const docsDir = path.join(process.cwd(), 'data/documents');
    const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));

    const results: Array<{ file: string; chunks: number; words: number }> = [];

    for (const file of files) {
      const content = fs.readFileSync(path.join(docsDir, file), 'utf-8');
      const chunked = chunkByHeaders(content, file);

      for (const chunk of chunked.chunks) {
        await kv.set(`chunk:${chunk.id}`, chunk);
      }

      await kv.set(`doc:${file}`, {
        sourceFile: file,
        totalLines: chunked.totalLines,
        totalWords: chunked.totalWords,
        chunkCount: chunked.chunks.length,
        chunkIds: chunked.chunks.map(c => c.id),
        index: chunked.index,
      });

      results.push({
        file,
        chunks: chunked.chunks.length,
        words: chunked.totalWords,
      });
    }

    await kv.set('knowledge:index', {
      documents: results,
      totalChunks: results.reduce((sum, r) => sum + r.chunks, 0),
      totalWords: results.reduce((sum, r) => sum + r.words, 0),
      ingestedAt: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      documents: results,
      totalChunks: results.reduce((sum, r) => sum + r.chunks, 0),
    });
  } catch (error: any) {
    console.error('Knowledge ingest error:', error);
    return res.status(500).json({ error: 'Ingestion failed' });
  }
}
