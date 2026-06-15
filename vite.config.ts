import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// v2.0.0 — 2026-06-15
// Removed the process.env.* `define` block: no client code referenced those
// vars (the Gemini key lives only in the serverless /api functions, read from
// process.env at runtime on Vercel), so the define was dead config and a
// standing footgun. Tailwind is compiled via postcss.config.js (auto-detected).
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
