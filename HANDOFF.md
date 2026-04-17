# HANDOFF — overlap/voice-app
Generated 2026-04-16 by overnight audit agent (Haiku 4.5)

## What it does
Overlap Voice App is an AI-powered knowledge extraction tool built on Gemini. Users answer guided interview questions (via text or voice) about their business or personal knowledge, then the system synthesizes responses into structured Markdown. Supports two extraction modes:
- **Business mode**: Multi-session interview about company/product knowledge
- **Personal mode**: Personal knowledge extraction interviews

Key features:
- Voice input + transcription (Gemini Speech-to-Text)
- Two-question router (Business/Personal selection)
- Auto-save to Google Sheets + Vercel KV storage
- Admin panel (PIN-protected: 1999)
- Real-time analysis and markdown generation
- Vision-based process screen (ProcessVisionScreen)

## Run it (verified commands)
```bash
npm install
npm run dev          # Vite dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
```

**Prerequisites:** Node.js, GEMINI_API_KEY in .env.local

## State today
- **Deployed URL:** overlap-voice.vercel.app
- **Last commit:** 8e3544e (chore: expand .gitignore)
- **Dirty?:** No (working tree clean, main branch up-to-date with origin)
- **Version:** 2.1.0

## Tech stack
- **Framework:** React 19 + TypeScript + Vite 6
- **API:** Google Gemini (@google/genai 1.31.0)
- **Persistence:** Google Sheets + Vercel KV
- **Deploy:** Vercel (configured via .vercel/)
- **Storage:** .env.local holds GEMINI_API_KEY

## Missing pieces
1. **Error boundaries** — No React error boundaries; crashes could break UI
2. **Offline support** — No service worker or offline mode (KV/Sheets fallback only)
3. **Rate limiting** — Gemini API calls not rate-limited or cached
4. **Test coverage** — Zero tests (no jest/vitest config)
5. **Type safety** — Some components use `any` types
6. **Session recovery** — Auto-save to KV but no graceful recovery UI if load fails

## Overlaps
- **vrcg-system:** No direct overlap. Overlap Voice App is standalone AI extraction tool.
- **Broader Overlap project:** Part of "The Overlap" methodology (Vince's AI knowledge extraction system). **Project status: ON HOLD**
- **Related:** Uses Gemini (like vrcg-system potential integrations) but separate deployment and ownership.

## Recommended next step
1. **If reviving:** Add error boundaries + session recovery UI
2. **If archiving:** Document the methodology somewhere (see `Claude-OVERLAP.md` for context), then mark repo as archived
3. **Current state:** Stable and deployed. No immediate action needed unless feature requests come in.
