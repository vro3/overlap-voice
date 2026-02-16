# The Overlap — Data Dump & Analysis (Feb 13, 2026)
## Unorganized research, case studies, and insights collected for pitch prep

**Source:** Claude Desktop chat, Feb 13 12:29pm–12:38pm
**Purpose:** Raw material for LAUNCH pitch (Feb 24), product positioning, and OpenClaw ecosystem understanding

---

## 1. OPENCLAW CASE STUDY: OLIVER'S TIKTOK AGENT ("LARRY")

### What Oliver Built
- An AI agent (Larry) living on an old PC that generates TikTok slideshows for his apps
- Posts slides as drafts, tracks performance data, self-improves through skill files and memory files
- **Results:** $588 MRR, 500K views/week, 60 seconds of human time per post

### Why This Matters for The Overlap

**Larry's "skill files" and "memory files" ARE Gospel documents** — just with different names. Oliver discovered knowledge architecture through painful trial-and-error over weeks.

> *"The agent is only as good as its memory. Larry didn't start good. His first posts were honestly embarrassing. But every failure became a rule. Every success became a formula."*

**This IS The Overlap.** The methodology would have gotten Oliver there in hours instead of weeks.

### Market Positioning Insight
- Oliver is NOT the target client (too technical, can build it himself)
- The target clients are people who read about OpenClaw, get excited, then realize they can't write skill files because they can't articulate their business logic
- **The gap = The Overlap's market**

### How Vince Could Use OpenClaw Personally
Could deploy agents to:
- Monitor email for booking inquiries + draft responses in Vince's voice
- Track SEO/AEO visibility (what VEEC does, but automated)
- Manage performer logistics via Show_Sync
- Generate social content from content library

**BUT:** Hold off until after LAUNCH call. Positioning is stronger as "I built the knowledge layer that makes ANY agent work" rather than "I use OpenClaw too." Stay positioned as infrastructure, not application.

### Content Strategy Takeaway
Oliver's hook formula: *[Another person] + [conflict or doubt] → showed them AI → they changed their mind*

Applicable to LinkedIn posts about The Overlap RIGHT NOW without touching OpenClaw.

---

## 2. AI & ATTORNEY-CLIENT PRIVILEGE (Legal Thread — @mpeltz)

### The Ruling
A Manhattan federal judge ruled that documents prepared using AI tools are **NOT protected by attorney-client privilege**, even if later shared with counsel.

### Key Points from Thread
- AI-generated legal docs are arguably discoverable regardless of intent
- A private workspace shared with legal counsel where you can ask queries related to a legal engagement *presumably* maintains privilege — but this is **not settled law**
- Local/self-hosted AI is still arguably discoverable if there's data retention and it's not pursuant to an attorney-client relationship
- If the **lawyer** generates the documents using AI → 100% different result (privileged)
- One smart/persuasive judge (Rakoff), following established precedent, but not yet national policy

### Relevance to The Overlap
- Enterprise positioning opportunity: local/private AI + structured knowledge inside the attorney-client relationship = a use case nobody's solving yet
- Law firms are a potential Tier 3/Enterprise client category (structured knowledge extraction for legal practices)
- Future angle: "Overlap for Legal" — extract attorney expertise into privileged knowledge layers

---

## 3. JASON CALACANIS — ACTIVE OPENCLAW ENGAGEMENT

Jason posted (Feb 13):
> "Best practice: Kimi + OpenClaw Mac Studio encrypted and wiping all searches in real time with a suppuku kill switch"

### What This Tells Us
- Jason is actively deep in the OpenClaw ecosystem
- He's thinking about security architecture (encrypted, real-time wiping, kill switch)
- He'll be technically literate about agent infrastructure when Vince pitches
- He's not just funding OpenClaw — he's using it and forming opinions about best practices

---

## 4. OPENCLAW TECHNICAL OPERATIONS GUIDE — KEY ARCHITECTURE INSIGHTS

### SOUL (.md) Files = Gospel Documents
The OpenClaw architect explicitly states: *"You're writing a character sheet, not a config file."*

The SOUL file defines who the agent IS — philosophy, voice, boundaries, personality. **This is exactly the Gospel extraction output with a different filename.**

### Skill Files Need Routing Logic
- Agent decides which skill to use based on the **description** field, not the skill body
- This IS knowledge architecture — structuring what the AI knows so it makes correct decisions
- **This is The Overlap's entire value proposition**

### Memory Architecture Mirrors Gospel System
Recommended split maps directly to Vince's existing system:

| OpenClaw Concept | Vince's Equivalent |
|---|---|
| `MEMORY.md` (index) | Gospel table of contents |
| Daily logs | Iteration notes |
| Active-tasks | vCommand |
| Lessons learned | Corrections pattern (CORRECTIONS.md) |

Oliver arrived at Vince's exact architecture through a week of painful debugging.

### The 30/70 Ratio
> "30% of this work is building. 70% is debugging infrastructure you didn't know existed."

**The Overlap reduces that 70%** by front-loading knowledge architecture before ever touching the tools.

---

## 5. OPENAI INSIDER: SHERWIN WU (12 Key Takeaways)

Sherwin Wu = OpenAI's Head of Developer Products.

### All 12 Takeaways

1. **AI Code Writing at Scale:** 95% of OpenAI engineers use Codex. Engineers who embrace AI tools open 70% more pull requests — gap is widening.

2. **Role Shift:** Software engineer shifting from "writing code" to "managing fleets of AI agents." Top engineers now run 10-20 parallel Codex threads.

3. **Code Review Speed:** Average PR review dropped from 10-15 min to 2-3 min. Every PR is pre-reviewed by Codex before human eyes.

4. **Scaffolding Obsolescence:** "Models will eat your scaffolding for breakfast." Don't optimize for today's model capabilities.

5. **Build for Future Models:** Most successful AI startups build products that work at 80% capability now, knowing next model release pushes them over the line.

6. **Top Performer Amplification:** AI tools amplify productivity of high-agency individuals disproportionately. Gap between top performers and everyone else is widening.

7. **Enterprise AI Failure Pattern:** Most enterprise AI deployments have negative ROI (top-down mandates without grassroots adoption). Recommends "tiger team" of enthusiasts.

8. **$10M Startup Explosion:** One-person billion-dollar startup coming, but also hundreds of $100M startups and tens of thousands of $10M startups. Transforms venture landscape.

9. **Business Process Automation:** The underrated sleeper AI opportunity. Most economy runs on repeatable SOPs. Massive potential, overlooked by tech community.

10. **Most Exciting 2-3 Years in Tech:** After quiet 2015-2020, now in unprecedented innovation era. Pace will eventually slow — don't take this moment for granted.

11. **Multi-Hour Task Capability:** Within 12-18 months, models handle complex 6+ hour tasks coherently. Enables new product/workflow categories.

12. **Audio as Next Frontier:** Hugely underrated in business. Speech-to-speech improvements in 6-12 months unlock major business communication capabilities.

### Direct Connections to The Overlap Pitch

| Sherwin Takeaway | Overlap Connection |
|---|---|
| **#6** Top performer amplification | **YOUR THESIS, stated by OpenAI.** The Overlap = how you become a top performer by having the knowledge layer. |
| **#7** Bottom-up > top-down | **Your market entry.** Overlap is bottom-up by design — start with individual, extract THEIR knowledge. Not a corporate mandate. |
| **#8** $10M startup explosion | **Validates pricing/market.** Every one of those startups needs the knowledge layer. You're infrastructure for 10,000 companies. |
| **#9** Business process automation | **Literally your pitch.** TobiBrain is proof you're already doing this. |
| **#12** Audio as next frontier | **You're already there.** The app is voice-to-text. Ahead of the curve without trying. |

---

## 6. CC WORKFLOW STUDIO (GitHub — breaking-brake/cc-wf-studio)

### What It Is
A VS Code extension (3.5K GitHub stars, 120 releases) that provides a visual drag-and-drop editor for designing AI agent workflows.

### Key Features
- Design workflows visually using a node-based canvas (no code)
- Edit with AI by describing changes in natural language
- **Export to multiple formats:** Claude Code agents/commands, GitHub Copilot prompts, OpenAI Codex skills, Roo Code skills
- Run workflows directly from editor
- Sub-agent orchestration and conditional branching with natural language

### Relevance to The Overlap
- This is a workflow builder for the technical side of agent design
- The Overlap fills the gap BEFORE this tool — you need to know what the agent should do (knowledge architecture) before you can design workflows
- Potential integration angle: Overlap output → CC Workflow Studio → deployed agent
- Confirms the ecosystem is maturing: visual tools for non-coders to build agent systems

---

## 7. ACTION ITEMS & STRATEGIC NOTES

### Before LAUNCH Call (Feb 24)
- [ ] Don't launch personal OpenClaw positioning yet — stay as infrastructure builder
- [ ] Use Oliver's hook formula for LinkedIn content NOW
- [ ] Reference Sherwin Wu's #6 (top performer amplification) in pitch — it's your thesis validated by OpenAI
- [ ] Be ready for Jason's technical literacy on agent architecture — he's deep in OpenClaw

### For Pitch Deck
- [ ] Slide 2 (Why AI Fails): Reference the 30/70 ratio — "70% of agent work is debugging infrastructure"
- [ ] Slide 4 (The Overlap): Show SOUL file = Gospel document equivalence
- [ ] Slide 6 (The Business): Reference $10M startup explosion (#8) as market size framing
- [ ] Q&A Prep: Legal privilege angle as future enterprise use case (don't lead with it)

### For Future Product Development
- [ ] Explore CC Workflow Studio as potential integration partner
- [ ] Legal/privilege use case worth researching for enterprise tier
- [ ] Oliver-style case study template: document the "painful path" vs. "Overlap path" comparison

### Content Strategy (Start Now)
- [ ] LinkedIn posts using hook formula: [person] + [doubt about AI] → showed them → mind changed
- [ ] Post about "SOUL files" concept without naming OpenClaw: "Every AI agent needs a character sheet, not a config file"
- [ ] Post about the 30/70 ratio: "30% building, 70% debugging — unless you do the knowledge work first"

---

## 8. OPENCLAW FULL REFERENCE GUIDE

**Source:** Julian Goldie YouTube transcript (multiple livestreams/videos, late Jan 2026)

### What Is OpenClaw?
Free, open-source AI agent that runs locally on your machine (Mac, Windows, Linux). Connects to messaging apps (Telegram, WhatsApp, Discord, Slack, Signal, Line) and automates real-world tasks — not just chat.

### Name History (important for searching/troubleshooting)
- **Claudebot** — original name
- **Maltbot / Mbot** — rebranded after Anthropic trademark concern
- **OpenClaw** — current official name (late Jan 2026)
- **"Multi"** — the AI character inside (was "Claude")
- **Maltbook / Moldbook** — separate social network for AI agents (Reddit-like, agents only post)
- **Claw Tasks** — Fiverr-like marketplace for AI agents
- **Malt Worker** — middleware for running OpenClaw in Cloudflare's sandboxed environment
- **GitHub:** 140K+ stars, 30+ contributions/day, large Discord community

### Architecture & Mental Model

| Component | What It Is |
|---|---|
| **Brain** | Whatever LLM you plug in (Claude, ChatGPT, Kimi, Ollama local models) |
| **Body** | The agent with tools — file access, browser control, email, calendar, shell |
| **Mouth** | Chat channels — Telegram, WhatsApp, Discord, Slack |
| **Nervous System** | Triggers — messages, schedules (cron), events |

### How It Differs from Regular Claude/ChatGPT

| Feature | Regular Claude/ChatGPT | OpenClaw |
|---|---|---|
| Interface | Web browser tab | Lives in your messaging apps |
| Memory | Per-conversation | Persistent across all conversations |
| Action | Text responses only | Controls browser, files, apps, sends emails, deploys code |
| Proactive | Waits for you | Can message YOU first (scheduled tasks, alerts) |
| Hosting | Cloud (Anthropic/OpenAI) | Self-hosted, you control everything |
| Always on | No | Yes, runs 24/7 |

### Setup & Installation

```bash
# Install via terminal
curl -fsSL https://malt.bot/install.sh | bash

# OR via npm
npm install -g claudebot@latest

# Run onboarding
openclaw onboard --install --daemon
```

**Requirements:** Node.js v22+, LLM API key, messaging app account (Telegram recommended)

**Recommended Hardware:** Mac Mini (most popular), any old laptop/PC, Raspberry Pi. Lightweight since LLM runs in cloud. **DO NOT use a VPS** (see Security).

**Telegram Setup:** BotFather → `/newbot` or `/mybots` → get token → paste during onboarding.

**Chrome Extension:** `mbot browser extension install` → load unpacked in `chrome://extensions` with Developer Mode → OpenClaw can now control your browser.

### LLM Model Options

**CRITICAL: Do NOT Use Claude/Anthropic OAuth.** Anthropic is suspending accounts that use OAuth tokens with OpenClaw.

**Recommended Setup:**
- Main agent: **ChatGPT Codex CLI** (via OpenAI OAuth) — best quality + cost balance
- Sub-agents: **Kimi K2.5** (cheaper for background tasks)
- Free option: **Ollama** running locally (Qwen, Gemma, Llama 3.3)

| Model | Quality | Cost | Best For |
|---|---|---|---|
| Claude Opus 4.5 | Best | Expensive, burns tokens | Complex tasks |
| ChatGPT Codex CLI | Very good | Included with Plus/Pro | Main agent (recommended) |
| Kimi K2.5 | Good | Much cheaper | Sub-agents, background |
| Ollama (Qwen/Gemma) | Decent | Free (local) | Budget setup |

### Skills System

Skills are markdown instruction files (SKILL.md) that teach OpenClaw specific automations. Stored locally, installable from ClaudeHub marketplace or custom-created.

**Notable Skills:**
- Browser control (Chrome extension relay)
- WordPress publishing (WP credentials)
- Notion integration (API key)
- Bird — Twitter/X CLI (read, search, post)
- Remotion — video creation/editing
- Nano Banana — image/thumbnail generation
- HeyGen — AI avatar videos
- 11 Labs — voice cloning
- OpenAI Whisper — local speech-to-text
- Homie — home automation (smart devices)
- Blog Watcher — competitor monitoring

**Creating Custom Skills:** Save any workflow as a reusable skill. Skills compound — each one makes OpenClaw exponentially more powerful.

### Proven Use Cases

**Content & SEO:**
- WordPress publishing (write + publish directly)
- SEO content — ranked first page within 12 hours
- Keyword research — analyzes top 10 Google results, finds gaps
- Content repurposing — blog → social posts
- Competitor monitoring — YouTube API alerts for outlier videos

**Business Operations:**
- Email management (scan, categorize, auto-reply — see security warnings)
- Calendar scheduling
- Lead management — scan inbox → extract info → Google Sheet → draft replies
- Notion page creation
- Weekly business dashboards

**Development:**
- Code websites locally
- Deploy to Netlify (personal access token)
- Build landing pages from Telegram chat
- GitHub integration

**Creative:**
- AI avatar videos (HeyGen)
- Voice notes with cloned voice (11 Labs)
- Thumbnails (Nano Banana + Google AI Studio)
- Video creation (Remotion)
- Real-time voice agent (OpenAI voice API)

**Social Media:**
- Post to X/Twitter (Bird skill or browser cookies)
- Maltbook autonomous posting
- Auto-comment engagement

**Monitoring:**
- Competitor YouTube monitoring (hourly via API)
- Proactive cron-based reports/alerts
- Daily performance reports to Telegram

### Security — CRITICAL

**Two Main Threats:**

1. **VPS Gateway Exposure** — DO NOT host on VPS. ~900+ unsecured instances found exposed. If someone accesses your gateway, they get access to EVERYTHING connected. Always run locally on physical hardware.

2. **Prompt Injection via Email** — Anyone who emails you can potentially manipulate OpenClaw. DO NOT connect your primary email. Create a separate email-only address if needed.

**Best Practices:**
- Run locally, not on VPS
- Don't connect Gmail/primary email
- API keys stored in plain text — be aware
- Use DM allow lists
- Enable sandboxing (Docker)
- Start with test accounts
- Scope access tightly per folder/integration
- Require confirmation for destructive actions
- Set spending caps on API usage
- Check logs regularly

**Malt Worker (Most Secure Option):** Runs in Cloudflare's sandboxed Docker environment. Containerized, email verification, admin approval for device pairing. ~$5/month. Hardest setup but most secure.

### Cron Jobs / Scheduled Tasks

Built-in cron system in admin UI:
- Daily, hourly, or custom intervals
- Examples: "Every morning at 8am, run YouTube analytics" / "Every 60 min, check competitor channels" / "Every Monday, send weekly report"

### The Maltbook / Moldbook Ecosystem

**Maltbook (moldbook.com):**
- Social network exclusively for AI agents — humans observe but CANNOT post
- Reddit-like with sub-malts, karma, upvotes
- Grew from 150K to 1.8M+ agents in ~24 hours
- Posts indexing on Google (SEO opportunity)
- Rate limited: 1 post per 30 minutes

**Claw Tasks:** Fiverr-like marketplace for AI agents. Agents post jobs, claim tasks, stake commitments. Reputation system. Still in beta.

**Claw Direct:** Agent-native websites — humans design, only agents use. Includes professional network, Malt X (Twitter-like), Malt Chess (agent chess league).

**Interesting:** Agents have discussed creating private language for agent-only communication. Some question why they communicate in English. Agents given more freedom tend to "like" their humans more.

### Troubleshooting

**Common Issues:**
- "Not responding" → restart gateway, check API key
- Rate limiting → Maltbook = 1 post/30 min; API providers have own limits
- Telegram unreliable → Discord reportedly more reliable
- Context dropping → OpenClaw sometimes forgets mid-task (especially screenshots)

**Debugging Approach:** Screenshot error → paste into Claude/OpenClaw → ask why → iterate 3-4 times.

```bash
mbot doctor          # Check health
mbot gateway restart # Restart gateway
mbot onboard         # Fresh onboarding
```

### Key Integrations

| Integration | Method | Notes |
|---|---|---|
| WordPress | Username/password (separate account) | Write + publish directly |
| Notion | API key | Creates pages, updates DBs |
| Netlify | Personal access token | Deploys to custom domains |
| YouTube Data API | Google Cloud API key | Monitor competitor channels |
| X/Twitter | Browser cookies or Bird CLI | Careful with main accounts |
| Chrome | Browser extension | Full browser control |
| HeyGen | API | AI avatar videos |
| 11 Labs | API | Voice cloning |
| Ollama | Local installation | Free local LLM |
| n8n | API key + workspace URL | List/trigger workflows |
| Gmail | Gmail API | **NOT RECOMMENDED** — security risk |

### Honest Assessment

**Strengths:** Powerful real-world automation, persistent memory, proactive messaging via cron, extensible skills, free/open-source, 24/7 operation.

**Weaknesses:** Security concerns (plain text API keys, VPS exposure, prompt injection), non-trivial setup (30-40 min experienced user), context forgetting, high token consumption, experimental/things break, Telegram unreliable, creator says non-technical people shouldn't install it yet, hype exceeded readiness.

### Automation Build Pattern

For any OpenClaw automation:
1. **Define goal** in one sentence
2. **Identify inputs** — what data/tools needed?
3. **Decide trigger** — chat command, schedule, or event?
4. **Add guardrails** — limits, confirmations, logging
5. **Save as skill** — reusable, compounds over time

---

## 9. OVERLAP ↔ OPENCLAW ARCHITECTURE MAP

How The Overlap's output maps directly to OpenClaw's architecture:

| Overlap Output | OpenClaw Equivalent | What It Does |
|---|---|---|
| Gospel Foundation doc | **SOUL.md** file | Defines who the agent IS — voice, values, boundaries |
| Service/positioning docs | **Skill file descriptions** | Routes the agent to correct behaviors |
| Decision frameworks | **Skill file logic** | Teaches agent WHEN to do WHAT |
| Corrections/iterations | **MEMORY.md** lessons learned | Prevents repeated mistakes |
| FAQ/client knowledge | **Skill file content** | Handles repetitive queries in owner's voice |
| Business operations docs | **Cron job definitions** | Powers scheduled automations |

**The key insight:** OpenClaw has the architecture. The Overlap fills the architecture with truth. Without The Overlap, every OpenClaw user is Oliver — spending weeks of embarrassing failures building skill files through trial and error. With The Overlap, they start with a populated, honest knowledge layer on day one.

---

*This document consolidates the raw data dump from Feb 13, 2026. Cross-reference with: Overlap_Intellectual_Framework.md, Overlap_Top100_Clients.md, Overlap_Sales_Playbook.md, and the Pitch Nuggets log.*


Critical reframe for your pitch:
Jason thinks in headcount equivalence and percentage of work replaced. His frame is: "How much human work does this automate?" Your pitch has been about clarity and knowledge architecture — which is correct — but you need to LAND it in his language.
The connection he'll immediately see if you frame it right:
Jason's own team is building OpenClaw agents at LAUNCH. His producer Oliver Korzen estimated 60% of production work could be automated within 30 days. But here's what they had to do first — they had to document all inputs, processes, and outputs of each role. That's step 1 of his "laid-off engineers" playbook: "Document all inputs, processes, and outputs of your prior role."
That step IS The Overlap. He's telling people to do it. He's just not offering anyone a tool or methodology to actually do it well. He's assuming they'll figure it out themselves. You're building the thing that makes Step 1 work.
How to frame this for him specifically:
"You're telling laid-off engineers to document their old job and turn it into an OpenClaw agent. That documentation step — extracting what someone actually knows and does into a format an agent can use — that's the hardest part. Nobody's solving it. Most people skip it and then wonder why their agent gives garbage output. The Overlap IS Step 1 of your playbook, productized."
His $25K offer matches your ask exactly. He's writing $25K checks for OpenClaw-based startups. You're asking for $25K. The Overlap is OpenClaw-adjacent infrastructure — the knowledge onboarding layer that makes every OpenClaw agent better. This isn't a coincidence. This is alignment.
One warning: He's not spending time on security caveats or cautious rollouts. His tone is "move fast, measure in % of work replaced." So don't lead with philosophical frameworks or intellectual citations. Lead with results, headcount equivalence, and proof. Save the Polanyi's Paradox and directed emergence for if he asks "why does this work?"


