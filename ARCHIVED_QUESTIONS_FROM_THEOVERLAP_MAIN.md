# Archived Questions from /theoverlap-main
**Date Archived:** February 15, 2026
**Source:** `/theoverlap-main/voice-app/data/initialData.ts` v2.6
**Status:** NOT DEPLOYED - these were polished in wrong repository

---

## Context

These 106 questions were polished on February 14-15, 2026 in the `/theoverlap-main` repository, which was later discovered to be a separate codebase from the deployed app. The deployed app uses `/overlap-voice` with 66 questions.

This archive preserves the polish work in case any questions or phrasing improvements are worth porting to the deployed version.

---

## Question Structure (13 Steps, 106 Questions)

### Step 1: Your Story (9 questions)
- Origin, expertise, current reality, client outcome
- IDs: `intake_intention`, `story_*`

### Step 2: How Clients Buy (7 questions)
- Discovery, decision process, conversion
- IDs: `buy_*`

### Step 3: Energy & Boundaries (10 questions)
- What drains you, what energizes you, boundaries
- IDs: `energy_*`

### Step 4: Business Reality (10 questions)
- Revenue, capacity, constraints
- IDs: `reality_*`

### Step 5: Voice & Language (8 questions)
- How you talk about your work
- IDs: `voice_*`

### Step 6: Market & Industry (11 questions)
- Competition, positioning, market dynamics
- IDs: `market_*`

### Step 7: Core Belief (7 questions)
- Contrarian views, operating principles
- IDs: `belief_*`

### Step 8: Service Structure (12 questions)
- How you package and deliver work
- IDs: `service_*`

### Step 9: Pricing Deep Dive (10 questions)
- Pricing strategy, positioning, value capture
- IDs: `pricing_*`

### Step 10: Proof & Evidence (8 questions)
- Results, case studies, credibility
- IDs: `proof_*`

### Step 11: AI & Documentation (9 questions)
- AI usage, knowledge storage
- IDs: `ai_*`, `knowledge_*`

### Step 12: Reality Check (11 questions)
- Verification questions referencing earlier answers
- IDs: `reality_claim_*`

### Step 13: Custom Questions (6 questions)
- User-defined slots
- IDs: `custom_*`

---

## Key Polish Principles Applied

1. **Specific not vague** — "WHICH part of admin work" not just "admin"
2. **Behavioral not demographic** — "how they work" not "who they are"
3. **Operational not emotional** — "consistently creates problems" not "worst part"
4. **Plain language not jargon** — "what worries you" not "what could disrupt"
5. **Terms explained** — scope creep, tire-kickers, social proof clarified
6. **Depth added** — unspoken benefits, hidden value, underlying skills
7. **Reality checks** — "not what you wish it was, but what it really is"
8. **Actionable prompts** — "Look at your last 5 invoices"

---

## Notable Differences from Deployed Version

The deployed `/overlap-voice` version (66 questions) uses:
- Different step structure (10 steps vs 13)
- Different ID scheme (`who_*`, `mkt_*`, `three_*` vs `story_*`, `buy_*`, `reality_*`)
- Different question phrasing and focus
- Fewer total questions (66 vs 106)

Only **11 question IDs** overlap between the two versions.

---

## Features Unique to /theoverlap-main

1. **Quick Start Router** — 5-question intake flow
2. **Track Assignment System** — Questions tagged with tracks (QUICK_START, FOUNDATION, REFINEMENT, AI_READINESS, FULL_PROCESS)
3. **Reality Check Step** — Dynamic questions that reference earlier answers

These features were NOT in the deployed `/overlap-voice` app.

---

## Recommendation

Review the deployed 66 questions in `/overlap-voice` and selectively port any polish improvements or new questions that add value. Do NOT wholesale replace the deployed questions with this archived set — they serve different purposes and have different structures.

---

**Archived by:** Claude Sonnet 4.5
**Repository deleted:** /theoverlap-main (February 15, 2026)
