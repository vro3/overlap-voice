---
status: built — verified locally, not yet deployed
outcome: "Watch a 60-second demo" button on the entry screen loads a seeded example session ("Marcus Webb," a fictional team-culture consultant) and runs a 10-step spotlight tour across the whole flow — sections, a question, voice input, autosave, modes, review, the Markdown output, and knowledge search. Non-destructive: real answers/email untouched. tsc clean, build green. Verified via Preview MCP screenshots (all 10 steps + clean exit).
---

# Overlap Voice App — Demo Walkthrough

## Why
People need to see how the tool works without doing a full extraction first —
same idea as the VEEC "Watch demo" tour. A button on the magic-link entry screen
loads a fully-populated example session and runs a guided spotlight walkthrough
so a newcomer (or a pitch audience) sees the whole arc in ~60 seconds.

## Design
- **Non-destructive.** Demo data overlays app state in-memory only
  (`effectiveAnswers` / `effectiveRouter` / `effectiveEmail`). The user's real
  `answers`, `routerAnswer`, and `email` are never written. Auto-save is guarded
  off while `demoMode` is true. Exit restores the real (untouched) state and
  returns to the entry screen. Verified: after the tour, the real session is
  still 0% / empty.
- **Seeded persona.** "Marcus Webb," a fictional leadership keynote speaker /
  team-culture consultant — a solo expert whose value lives in his head, which is
  exactly who The Overlap is for. Sections 1–6 are answered with voice-y, specific
  answers; later sections are left blank so it reads like a real session in
  progress (output screen shows "27 questions across 10 sections").
- **Tour.** A bespoke spotlight overlay (`DemoTour`, ported from VEEC and
  re-themed to the warm-amber palette, no `lucide-react`). A step list drives the
  app to the right screen, scrolls an anchored `[data-tour="..."]` element into
  view, dims everything else, and shows a card with Back / Next / Skip and
  "Step X of N." Robust to lazy screen mounts via element polling; falls back to a
  centered card when an anchor isn't found. Keyboard: →/Enter next, ← back, Esc exit.

## Steps (10)
intro → sections → a question → voice (Talk) → autosave/progress → modes →
review → Markdown output → knowledge search → outro CTA.

## Files
- `data/demoData.ts` (new) — `DEMO_ANSWERS`, `DEMO_ROUTER_ANSWER`, `DEMO_EMAIL`.
- `components/DemoTour.tsx` (new) — spotlight tour overlay.
- `App.tsx` — `DEMO_STEPS` config, `demoMode`/`demoStep` state, step→screen
  effect, effective-data overlay, auto-save guard, render `DemoTour`, demo handlers.
- `components/MagicLink.tsx` — "Watch a 60-second demo" button (`onWatchDemo`).
- `Sidebar.tsx` / `StepView.tsx` / `QuestionCard.tsx` / `ReviewScreen.tsx` /
  `OutputScreen.tsx` / `KnowledgeSearch.tsx` — `data-tour` anchors.

## Done When
- [x] "Watch demo" loads seeded data and starts the tour from the entry screen.
- [x] Tour walks every screen (questions → review → output → search),
      spotlighting real populated elements; Next/Back/Skip/Esc work.
- [x] Exiting restores the user's real state untouched (verified: 0% / empty).
- [x] `tsc --noEmit` clean; `npm run build` green.

## Notes / follow-ups
- The "Talk" mic spotlight only renders when the browser supports
  SpeechRecognition (Chrome/Edge); otherwise that step falls back to a centered
  card — acceptable and self-explanatory.
- Pre-existing: the Knowledge Search "Search" button uses a hard-coded blue
  (`#2563eb`) instead of the amber accent — slightly off-theme when spotlighted.
  Out of scope here; flagged separately.
- Deploy auto-publishes to overlap-voice.vercel.app on push to `main`.
