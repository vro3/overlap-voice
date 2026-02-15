// chunker.ts — v1.0.0 — 2026-02-14
// Splits large markdown knowledge bases into topic-organized chunks
// Used to prepare Overlap extraction output for RAG search

export interface Chunk {
  id: string;
  sourceFile: string;
  sectionTitle: string;
  content: string;
  lineStart: number;
  lineEnd: number;
  wordCount: number;
  topics: string[];
}

export interface ChunkedDocument {
  sourceFile: string;
  totalLines: number;
  totalWords: number;
  chunks: Chunk[];
  index: string;
}

export function chunkByHeaders(markdown: string, sourceFile: string): ChunkedDocument {
  const lines = markdown.split('\n');
  const chunks: Chunk[] = [];

  let currentTitle = 'Introduction';
  let currentContent: string[] = [];
  let currentLineStart = 1;
  let chunkIndex = 0;
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    }

    if (!inCodeBlock && /^#{1,3}\s+/.test(line) && currentContent.length > 0) {
      const content = currentContent.join('\n').trim();
      if (content.length > 20) {
        chunks.push({
          id: `${sourceFile}-chunk-${chunkIndex}`,
          sourceFile,
          sectionTitle: currentTitle,
          content,
          lineStart: currentLineStart,
          lineEnd: i,
          wordCount: content.split(/\s+/).length,
          topics: [],
        });
        chunkIndex++;
      }

      currentTitle = line.replace(/^#+\s+/, '').trim();
      currentContent = [];
      currentLineStart = i + 1;
    } else {
      currentContent.push(line);
    }
  }

  const lastContent = currentContent.join('\n').trim();
  if (lastContent.length > 20) {
    chunks.push({
      id: `${sourceFile}-chunk-${chunkIndex}`,
      sourceFile,
      sectionTitle: currentTitle,
      content: lastContent,
      lineStart: currentLineStart,
      lineEnd: lines.length,
      wordCount: lastContent.split(/\s+/).length,
      topics: [],
    });
  }

  const index = chunks
    .map((c, i) => `${i + 1}. **${c.sectionTitle}** (${c.wordCount} words, lines ${c.lineStart}-${c.lineEnd})`)
    .join('\n');

  return {
    sourceFile,
    totalLines: lines.length,
    totalWords: markdown.split(/\s+/).length,
    chunks,
    index,
  };
}
