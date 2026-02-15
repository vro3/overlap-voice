// ingest.ts — v1.0.0 — 2026-02-14
// Ingests markdown files from data/documents/, chunks them, stores in Vercel KV

import { kv } from '@vercel/kv';
import { chunkByHeaders } from '../../src/lib/chunker';
import fs from 'fs';
import path from 'path';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST required' }), { status: 405 });
  }

  try {
    const docsDir = path.join(process.cwd(), 'data', 'documents');
    const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));

    const results: Array<{ file: string; chunks: number; words: number }> = [];

    for (const file of files) {
      const content = fs.readFileSync(path.join(docsDir, file), 'utf-8');
      const chunked = chunkByHeaders(content, file);

      for (const chunk of chunked.chunks) {
        await kv.set(`chunk:${chunk.id}`, JSON.stringify(chunk));
      }

      await kv.set(`doc:${file}`, JSON.stringify({
        sourceFile: file,
        totalLines: chunked.totalLines,
        totalWords: chunked.totalWords,
        chunkCount: chunked.chunks.length,
        chunkIds: chunked.chunks.map(c => c.id),
        index: chunked.index,
      }));

      results.push({
        file,
        chunks: chunked.chunks.length,
        words: chunked.totalWords,
      });
    }

    await kv.set('knowledge:index', JSON.stringify({
      documents: results,
      totalChunks: results.reduce((sum, r) => sum + r.chunks, 0),
      totalWords: results.reduce((sum, r) => sum + r.words, 0),
      ingestedAt: new Date().toISOString(),
    }));

    return new Response(JSON.stringify({
      success: true,
      documents: results,
      totalChunks: results.reduce((sum, r) => sum + r.chunks, 0),
    }));
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
