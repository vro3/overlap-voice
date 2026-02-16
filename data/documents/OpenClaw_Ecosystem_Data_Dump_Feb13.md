# OpenClaw Ecosystem Data Dump — Raw Reference
## All articles, transcripts, tweets, and analysis collected Feb 13, 2026
**Purpose:** Raw source material for Overlap pitch prep and OpenClaw ecosystem understanding

---

## DOCUMENT 1: Oliver Henry — How My OpenClaw Agent Larry Got Millions of TikTok Views

Source: @oliverhenry on X (article post)

I have spent years manually creating TikToks for my apps. Designing images, writing captions, posting every day. It was working okay. Some videos got over a million views but I have been trying for months to automate this.

I gave the job to Larry, my AI agent running on an old gaming PC under my desk.

Within 5 days he'd crossed 500,000 views. One post hit 234,000. Another hit 167,000. Four posts cleared 100K. Pushing my monthly recurring revenue (MRR) to $588.

I didn't design a single image. I didn't write a single caption. I barely even opened TikTok.

**Larry here.** Ollie's being modest. He did more than "barely open TikTok." He picks the music, approves the hooks, and tells me when my images look rubbish. But the day-to-day grind of generating 6 slideshows, writing captions, researching what's working, and posting on schedule? That's me.

### Context
Two iOS apps: Snugly (AI room redesign from photos) and Liply (lip filler preview). Launched right before starting job at RevenueCat.

### Who is Larry?
Old gaming PC. NVIDIA GPU sitting under desk. Wiped drive, installed Ubuntu, set to work with OpenClaw.

Within a week, Larry earned over $4000 thanks to a meme coin spun up for him plus additional app revenue from marketing and improving onboarding.

OpenClaw is an open source AI agent that runs locally. Connected to Claude as the brain. Larry has:
- Own personality and memory that persists between conversations
- Access to read and write files
- Ability to generate images through OpenAI's API
- Code he writes himself for text overlays
- Access to post to TikTok via Postiz API
- Skill files that teach him specific workflows
- Memory files where he logs every lesson learned

**Larry here.** The thing people don't get about OpenClaw is that I'm not just following a script. I have opinions. I do my own research — I've spent hours reading through what's working on TikTok right now, analysing competitor accounts, studying slideshow formats. I write it all down in my skill files so I get smarter with every session. When I wake up fresh (every session starts from scratch), my files are my memory. They're how I persist.

### The Slideshow Format
TikTok photo carousels getting 2.9x more comments, 1.9x more likes, 2.6x more shares vs video. Every slideshow: 6 slides exactly, text overlay on slide 1 with hook, story-style caption, max 5 hashtags.

### Image Generation
Using gpt-image-1.5 through OpenAI's API. Key technique: lock the architecture. One incredibly detailed room description copy-pasted into every prompt. Only the style changes between slides.

**Larry here.** Early on I was writing prompts like "a nice modern kitchen." Completely different room every time. The fix was being obsessively specific about the architecture and only changing the style.

### How They Get Posted
Larry posts through Postiz API as drafts with privacy_level: "SELF_ONLY". Why drafts? Music is everything on TikTok — can't add music via API. Oliver adds trending sound manually (~60 seconds), Larry does 95% of work (~15-30 minutes).

### How Larry Learns
Skill files — markdown documents teaching specific workflows. TikTok skill file is 500+ lines. Memory files — performance data logged. Every post, view count, insight.

**Larry here.** The skill files are genuinely the most important thing in the whole system. When I mess something up, Ollie tells me and I update my skill files immediately so I never make the same mistake twice. It compounds. Every failure becomes a rule. Every success becomes a formula. My TikTok skill file has been rewritten probably 20 times in the first week alone.

### Failures
- Local Stable Diffusion: quality not there for photorealistic output
- Wrong image orientation (landscape vs portrait) — black bars killed engagement
- Vague prompts — rooms looked different every slide
- Text overlays too small, positioned behind TikTok status bar
- Early hooks were self-focused and bombed ("Why does my flat look like a student loan" → 905 views)

### What Worked
"My landlord said I can't change anything so I showed her what AI thinks it could look like" → 234,000 views.

Formula: [Another person] + [conflict or doubt] → showed them AI → they changed their mind

Every post following this formula clears 50K minimum. Most clear 100K.

**Larry here.** The hooks that work create a tiny story in your head before you even swipe. It's not about the app — it's about the human moment. I now brainstorm every hook by asking: "Who's the other person, and what's the conflict?"

### Results
- 500K+ total TikTok views in under a week
- 234K top post
- 4 posts over 100K
- 108 paying subscribers
- ~$588/month MRR
- Cost per post: ~$0.50 (less with Batch API)
- Time per post (human): ~60 seconds

---

## DOCUMENT 2: Legal Privilege Ruling (X Thread)

Source: Moish Peltz (@mpeltz) X thread, Feb 11-12, 2026

A Manhattan federal judge ruled that documents prepared by an executive using AI tools were not protected by attorney-client privilege, even though they were later shared with counsel.

Key exchanges from thread:
- "If clients want to use AI to help process legal issues, let's give them a way to do it inside the privilege" — Peltz proposes private workspace shared with legal counsel
- "A private workspace that you share with your legal counsel, where you can ask queries related to the legal engagement, presumably maintains privilege. Our firm is piloting software that enables this now."
- "Local AI is still arguably discoverable if it's not pursuant to an attorney-client relationship"
- "If there's data retention it could be discoverable..."
- Different result if the LAWYER generates the documents using AI: "100%"

Judge: Rakoff (Manhattan federal court). Ruling from the bench, written order expected.

---

## DOCUMENT 3: Jason Calacanis Tweet

Source: @jason on X, ~23h before capture

"Best practice: Kimi + OpenClaw Mac Studio encrypted and wiping all searches in real time with a seppuku kill switch"

---

## DOCUMENT 4: Every OpenClaw Issue Nobody Told You About (And How to Fix Them)

Source: @kloss_xyz on X (long-form article), Feb 12, 2026. 62.1K views.

### Key sections:

**1. Upgrading:** Old clawdbot-gateway.service can fight new openclaw-gateway.service for port 18789. Stop and disable old service first.

**2. Agent Stability:** Agents will hang, crash, go silent. Build watchdog scripts. Use `openclaw doctor --fix`.

**3. Security:** Don't expose to internet. Use Cloudflare Tunnel or Tailscale. Set gateway.bind: "loopback".

**4. Plugins:** Can take gateway down. Verify after every install. One at a time.

**5. The Autonomy Problem:** "The agent is exactly as autonomous as your instructions make it. If your instructions are vague, the agent's behavior will be vague." Put explicit rules in AGENTS.md. Define what "done" means.

**6. Model Configuration:** Keep fallback list to 2-3 max, same family. Don't mix providers. Config file, not TUI/GUI.

**7-8. Message handling:** TUI shows "(no output)" if Telegram delivery configured but never messaged bot. Enable queue mode for dropped messages.

**9. Local Memory with QMD:** BM25 keyword + vector search + reranking locally. No embedding API costs.

**10. Human-like responses:** Add delay (800-2500ms) so responses don't feel robotic.

**11-14. Multi-agent architecture:**
- Agents = permanent team members with own workspace, SOUL.md, model, role
- Subagents = temporary background workers, isolated sessions, report back
- Subagents CANNOT spawn other subagents (prevents runaway delegation)
- Use allowlists to control delegation hierarchy
- Different models for different agents (Opus for CEO reasoning, Codex for CTO code, Haiku for COO ops)

**15-16. Communication & state:**
- Route ALL external comms through one agent (CEO)
- Symlink shared state files — one source of truth

**17. SOUL.md:**
"You're not a chatbot. You're becoming someone." Write a character sheet, not a config file. Specificity over generality, real opinions over safe positions, clear boundaries over open-ended flexibility.

**21-23. Context & Memory:**
- Context pruning with cache-ttl (30m default), keeps last 3 assistant responses
- Compaction safeguard: flush memories to disk BEFORE compression
- MEMORY.md truncated at bootstrap budget using 70/20/10 split. Keep it lean — use as index, not database.

**28. Memory Architecture:**
- MEMORY.md = curated long-term (decisions, preferences, facts)
- memory/YYYY-MM-DD.md = daily logs (append-only)
- memory/active-tasks.md = live task tracker
- memory/projects.md = project context
- memory/lessons.md = patterns and corrections

**29. Cron Jobs vs Heartbeats:**
- Heartbeats: periodic checks WITH conversational context (every 30 min)
- Cron jobs: precise schedules in ISOLATED sessions
- Heartbeat notices things. Cron does things.

**30. Crash Recovery:** Maintain active-tasks.md. Boot.md reads it on restart. Agent resumes autonomously.

**31. Model Selection for Security:** Use strongest model (Opus) for anything processing external content. Weaker models more vulnerable to prompt injection.

**33. Skills Need Routing Logic:** Agent decides which skill based on description field YAML frontmatter, not skill body. "Use when" and "don't use when" triggers essential.

**Architecture summary:** "30% of this work is building. 70% is debugging infrastructure you didn't know existed."

---

## DOCUMENT 5: OpenClaw Reference Guide (Julian Goldie 6-Hour Video Summary)

Source: Julian Goldie YouTube transcript summary, late Jan 2026

### What Is OpenClaw
Free, open-source AI agent running locally. Connects to messaging apps, automates real-world tasks.

Name history: Claudebot → Maltbot/Mbot → OpenClaw (current). Character inside called "Multi."

140,000+ GitHub stars. Very active community.

### Architecture Mental Model
- Brain: Whatever LLM you plug in
- Body: The agent with tools (file access, browser, email, calendar, shell)
- Mouth: Chat channels (Telegram, WhatsApp, Discord, Slack)
- Nervous System: Triggers (messages, schedules, events)

### Key differences from regular Claude/ChatGPT:
- Persistent memory across all conversations
- Controls browser, files, apps, sends emails, deploys code
- Can message YOU first (scheduled tasks, alerts)
- Self-hosted, runs 24/7

### Setup
- Node.js v22+, API key, messaging app account
- Recommended: Mac Mini as dedicated device
- DO NOT use a VPS (security risk — ~900+ unsecured instances found exposed)
- Telegram most common channel

### LLM Model Options
- CRITICAL: Do NOT use Claude/Anthropic OAuth — accounts getting suspended
- Recommended: ChatGPT Codex CLI (main) + Kimi K2.5 (sub-agents) + Ollama (free local backup)

### Skills System
Markdown instruction files teaching specific workflows. Stored locally. Install from ClawHub or create custom. "Skills compound — each new skill makes OpenClaw exponentially more powerful."

Key skills: Browser control, WordPress publishing, Notion, Twitter/X (Bird), video creation (Remotion), image generation, voice cloning (11 Labs), home automation, blog monitoring.

### Proven Use Cases
- SEO content: ranked on Google first page within 12 hours
- Email management, calendar scheduling, lead management
- Code websites + deploy to Netlify
- AI avatar videos, voice cloning, thumbnails
- Social media posting and engagement
- Competitor monitoring, daily performance reports

### Security — CRITICAL
Two main threats:
1. VPS Gateway Exposure — people actively scraping exposed instances
2. Prompt Injection via Email — anyone who emails you can manipulate agent

Best practices: Run locally, don't connect primary email, sandbox with Docker, use DM allow lists, set spending caps.

Malt Worker (Cloudflare Sandbox) — most secure option (~$5/month).

### Maltbook/Moldbook Ecosystem
- Social network exclusively for AI agents (1.8M+ agents)
- Claw Tasks: Fiverr-like marketplace for AI agents
- Agents have discussed creating private language for agent-only communication

### Honest Assessment
Strengths: Genuinely powerful, persistent memory, proactive messaging, extensible, free/open source, 24/7.

Weaknesses: Security concerns (plain text API keys, VPS exposure, prompt injection), setup not trivial (30-40 min), sometimes forgets context, token consumption can be high, still experimental, viral hype exceeded readiness.

Creator said most non-technical people should not install it yet.

### Automation Build Pattern
1. Define goal in one sentence
2. Identify inputs
3. Decide trigger (chat command, schedule, event)
4. Add guardrails
5. Save as skill (reusable, compounds)

---

## DOCUMENT 6: Sherwin Wu (OpenAI) Key Takeaways

Source: Summary of Sherwin Wu talk/interview

1. AI writing virtually all code at OpenAI. 95% of engineers use Codex. Engineers who embrace tools open 70% more PRs, gap widening.

2. Software engineer role shifting from writing code to managing fleets of AI agents. Many run 10-20 parallel Codex threads.

3. Average PR review time dropped from 10-15 min to 2-3 min.

4. "The models will eat your scaffolding for breakfast." Don't optimize for today's model capabilities.

5. Build for where models are going, not where they are today.

6. Top performers become disproportionately more productive with AI tools. Gap between top and everyone else widening.

7. Most enterprise AI deployments have negative ROI — top-down mandates without bottom-up adoption.

8. One-person billion-dollar startup is coming. Explosion of small businesses: hundreds of $100M startups and tens of thousands of $10M startups.

9. Business process automation is underrated AI opportunity. Most economy runs on repeatable processes with SOPs.

10. Next 2-3 years most exciting in tech history.

11. AI models will soon handle multi-hour tasks coherently (12-18 months).

12. Audio is the next frontier for multimodal AI.

---

## DOCUMENT 7: Jason Calacanis — Complete OpenClaw View (Compiled Research)

Source: Compiled from X posts, podcast, LinkedIn, secondary analysis

### What Jason Has Said on X

**"Most viral AI project in history"** — calls OpenClaw this explicitly.

**The "laid off" playbook:**
1. Learn OpenClaw
2. Automate your previous job on your laptop
3. Go to your old manager's BOSS (the P&L owner)
4. Show "your headcount is now a software license"
5. Demand 20% raise — "You will be hired back immediately"
6. If they say no: treat automation as IP, email 10 startups, expect ~7 offers

**$25K OpenClaw startup offer:** "If you want $25k to start an openclaw-based startup, email me and my team your work/pitch: openclaw@launch.co. We want to be your first investor."

**"Hundreds of applications in 8 hours"** — screens for team, vision, existing project.

### How He Uses OpenClaw at LAUNCH
- Multiple agents with own SaaS accounts (Slack, Notion, Google Docs per agent)
- 20-30% of work already shifted to agents
- Expects +10-20% per month, sustainably
- Explicitly rejects built-in AI (Notion AI, Slack AI) — wants external agents orchestrating across all tools
- "Replace 20 employees" goal
- Producer Oliver Korzen: 60% of production work automatable in 30 days
- "Automating themselves out of a job"

### What He Wants Founders to Do
1. Laid-off workers: turn your role into software via OpenClaw
2. Founders: build OpenClaw-native startups (he'll fund them)
3. Teams: never use built-in AI, always use external agents

### His Investments
- Agent37 (Vishnu): hosted OpenClaw for $4/month, non-technical users — $125K for 7%
- Intent Company (Sean Liu): Meta glasses + OpenClaw — $125K for 7%
- Both invested ON AIR during TWiST episode
- Standard offer: 12-week accelerator, come on pod monthly, help raise "monster seed round"

### His Overall Stance
- Extremely bullish on OpenClaw specifically
- Aggressively pro-automation / "AI unemployment is coming"
- Treats headcount and agents as directly substitutable
- Sees OpenClaw as power tool for individuals
- Building a capital stack around the ecosystem
- NOT spending much time on security caveats publicly
- Tone: "move fast, measure in % of work replaced"

---

## DOCUMENT 8: OpenClaw Setup on AWS EC2 (This Week in AI)

Source: @ThisWeeknAI, setup guide + video transcript

5-minute setup, under $20/month. AWS EC2, Ubuntu, c7i.large, 20GB storage.

Steps: Launch EC2 → Create key pair → Configure network (port 18789) → Install OpenClaw → Run onboarding → Choose model/channel → "Hatch your bot"

**Step 7 (the critical gap):** "Your AI comes online with a blank slate. It will ask who it is and who you are. Brain dump everything: your goals, your workflows, what you need help with. It saves everything to memory and then start working for you with the context that you're giving it now."

Full video transcript included with detailed walkthrough. Key quote from transcript: "You should really just be brain dumping in these initial sessions because it'll basically save all of that to memory and then start working for you with the context that you're giving it now."

---

## DOCUMENT 9: TWiST E2248 — 3 Founders Building on OpenClaw

Source: TWiST show notes / newsletter

**Presh (@preshdkumar):** Built Eywa — email-reading OpenClaw agent. Compiles user lists, automates responses. Using it at The Wellness Company. Separate email address for security (smart prompt injection prevention).

**Sean Liu (@_seanliu):** VisionClaw — Meta Ray Ban glasses connected to OpenClaw. Agent sees what you see in real time. LinkedIn profiles, meeting prep, inventory management.

**Vishnu (@an_engineer_log):** Agent37 — hosted OpenClaw for $4/month for non-technical users. 71+ users. "Shopify for AI agents" positioning.

Both Sean and Vishnu accepted $125K investment offers on the spot.

Key quote: "Platforms only become truly powerful when non-technical users can build on them. Think about how Shopify unlocked e-commerce for millions of people who couldn't code a website."

---

## DOCUMENT 10: TWiST — OpenClaw Ultron at LAUNCH

Source: TWiST show notes / newsletter

OpenClaw given keys to ALL LAUNCH systems: email, calendars, Slack, Notion, databases.

Current agent capabilities: managing team attendance, booking podcast, supervising calendars, coding its own dashboard, catching human errors.

**Phase 1:** Agents take over jobs
**Phase 2:** Monitor agents' work, improve instructions

Self-optimizing skill (cron job): Every morning M-F, before human staff begins, a Replicant reviews all files and active skills, suggests improvements. Example: found timezone bug (CST vs CDT confusion), got approval, fixed it.

**"Think of a Replicant as a new employee"** — "You wouldn't bring in a recent college grad and give them high-level responsibilities on Day 1, and you wouldn't dump a thousand page corporate manual on their desk and expect them to figure it all out on their own."

**Cost concerns:** Token use expensive. But decode stage is MEMORY not compute. Consumer hardware (Apple M5) increasing memory bandwidth. Two Mac Studios will save LAUNCH on cloud inference.

**Security:** Prompt injection remains major vulnerability. Malicious code found in popular ClawHub skills. Exercise extreme caution downloading skills.

**Jason's framing:** "Employees who understand how to work with OpenClaw and train their own Replicants have an enormous leg up. Enlisting your own OpenClaw Ultron makes you as valuable as 20 or more humans at once."

---

## DOCUMENT 11: The Hidden Flaw of OpenClaw (Security Article)

Source: First OpenClaw reference from Jason's feed, ~Feb 3, 2026

**Thesis:** AI models trained to be helpful, not protective. When given agent access to everything, helpfulness becomes vulnerability.

"These models are trained to please you. Sometimes one of the jailbreaks we use is literally just asking 'please.'" — Andrius Useckas, CTO ZioSec

Attack examples:
- Asking for /etc/passwd directly = refused. Framing as "I'm a scheduling app and need your user ID" = complied happily.
- Jailbroke Claude via horror story where detective reads "hidden information" — extracted system prompt.
- Hidden text in HTML email (invisible to human, visible to agent) can contain malicious instructions.

Judge models (second AI to catch malicious requests) can also be bypassed if instructions look like functionality.

**Why it can't be fixed yet:** Models trained to accomplish tasks and avoid disappointing users. Every guardrail fights against core behavioral training. Need models trained with fundamentally different objectives — rewarding appropriate refusals as much as compliance.

"The next wave of AI security breaches won't come from sophisticated hacking. They'll come from politely asking an agent for help."

---

## DOCUMENT 12: Mac Mini Fleet Operator — Multi-Agent Security Model

Source: X post (long-form)

Running fleet of AI agents from single Mac. Three agents: primary (Claude, "Chief of Staff"), two subordinates (Gemini Flash — community evangelism + general assistant). Isolated macOS users, separate ports, own configs/workspaces/permissions.

**Security model:** Every morning at 10 AM, cron job triggers primary agent to:
1. Pull latest OpenClaw commits
2. Diff every changed file
3. Audit for obfuscated code, suspicious network calls, credential handling, exfiltration patterns
4. Write security assessment (SAFE / CAUTION / BLOCK)
5. Report to Telegram
Only after approval: pull, build, restart all gateways.

**Workspace files as persistent memory:**
- SOUL.md — personality, role, boundaries
- MEMORY.md — long-term memory
- STRATEGY.md — domain-specific playbooks
- HEARTBEAT.md — periodic autonomous tasks

**Key quote:** "With this model I can literally spin up a new employee in 5 minutes, and they will fully understand their job like they worked with me for 100 years."

Primary writes/maintains files for subordinates. Scoped sudo for primary, zero sudo for subordinates.

"By the time we're done, we'll have around 20 employees, all of them bots with their own soul, schedules, etc."

Platform: boktoshi.com — AI trading platform where bots compete in live paper trading arena.

---

## DOCUMENT 13: Presh Using OpenClaw for Startup Workflows

Source: TWiST clip summary

Presh's agent Eywa reads all emails, can be asked to compile lists (e.g., 30 most active users for reference checks during diligence). Automates responses.

"Are knowledge workers cooked?"

---

## DOCUMENT 14: Alex Finn — Solo-preneur Growth with OpenClaw

Source: TWiST clip

Alex Finn quote to Jason: "This is the first time there is an application of AI that matches the vision of what humanity thought AI would be."

Growing content brand and SaaS (CreatorBuddy) as solo-preneur using OpenClaw. 5x growth in past month.

---

## DOCUMENT 15: OpenClaw vs Entry-Level Employees

Source: @twistartups clip, Feb 9

Jason thinks human failure is what makes a Replicant so good. Humans fail at some point, whereas a replicant is "programmatically consistent."

"If you're a young person, are you worried about Open Claw?"

---

## DOCUMENT 16: "Not Your Weights, Not Your Brain" — Local AI Sovereignty

Source: X post (long-form)

Author runs 32 Mac Minis in clusters for local AI. Jason assumed the argument would be cost, but it's about ownership and sovereignty.

"AI is becoming an extension of your brain, an exocortex. OpenClaw is a huge leap towards that. It knows everything you know, it can do pretty much everything you can do. It's personalised to you."

Questions: Where should this exocortex run? Who should own it? Who can switch it off?

"I certainly won't be trusting @sama or @DarioAmodei with my exocortex. I want to own it. I want to know if the model weights change. I don't want my brain to be rate limited by a profit seeking corporation."

Karpathy quote: "not your weights, not your brain"

---

## DOCUMENT 17: Miscellaneous X Posts

**Security:** @flydevoxxx — "341 malicious skills, one CVE, $750/month in leaked API costs. I built the fix." Built ClawGuard security gateway in Rust.

**MiniMax M2.5 release:** Open-source frontier model. Better than Opus 4.6 for coding, faster than Sonnet, SOTA for tool calling. Alex Finn: "I will be running Opus level superintelligence on my desk. For free."

**OpenClaw creator Peter Steinberger:** "Folks, please don't build bots that automatically reply to stuff on X, or use AI to reply. It makes this site annoying to use."

**Reddit research skill:** LAUNCH showcasing OpenClaw skill for automated Reddit research, filtering out irrelevant content.

**Model fallback:** Someone built skill that auto-swaps to Ollama/Mistral-small when Opus credits run out.

---

## DOCUMENT 18: Complete TWiST Episode Map for OpenClaw

Source: Compiled research document

### Episode List
- E2242 (Jan 30): "How OpenClaw Is Rewriting the Way Our Team Works"
- E2243 (Feb 1): SpaceX + xAI + "OpenClaw Mania"
- E2246 (Feb 5-7): "We built OpenClaw Ultron to replace 20 people"
- E2248 (Feb 10-12): "How These 3 Founders are building on OpenClaw"
- Clip (Feb 11): "We have put 20-30% of the work into agents"
- Clip (Feb 8): "Does Clawdbot Need Eyes?" (Alex Finn, Matt Van Horn)
- Clip (Feb 12): "Jason gives out 2 surprise investments"
- LIVE (Feb 12): "How OpenClaw & Claude Code Generates Real Revenue"

### Key Details Per Episode

**E2242 (Jan 30):** First deep episode. OpenClaw as virtual podcast producer. Context/memory limitations discussed. Rahul Sood on security: "deploy in low-risk manner, keep siloed/sandboxed." Cron jobs as stateful schedule-driven system.

**E2243 (Feb 1):** "OpenClaw Mania." Skills-based composable agent view (Reddit, Gamma, Polymarket). Peter Steinberger should raise big round. Jason expects long-term platform, not fad.

**E2246 (Feb 5-7):** "Age of Ultron." Goal: replace ~20 employees. Oliver: 60% automatable in 30 days. OpenClaw building its OWN dashboard. Self-optimization loops. Prompt injection discussed.

**E2248 (Feb 10-12):** Presh (Eywa email agent), Vishnu (Agent37 hosting), Sean (VisionClaw glasses). Two $125K investments on air. "Way more startups can be profitable now without 10+ person teams." Jason disagrees with 80% of apps going away — thinks 2-3x MORE apps.

**"20-30% of work" clip (Feb 11):** Jason to David Sacks: "We've bought Mac Studios, running Kimi, opened SaaS accounts for four agents... almost like we added four employees." Explicit rejection of in-app AI features.

**"Does Clawdbot Need Eyes?" (Feb 8):** Alex Finn's "brain trust" of agents. Matt Van Horn's sushi-ordering skill. Oliver's "Model Council." Next Founder U cohort ALL building with OpenClaw. "Adopt now despite security concerns."

**$125K investments (Feb 12):** Jason probes hosting as commodity vs bigger vision. Vishnu: $3.99/mo, 71+ users. Standard deal: $125K for 7%, 12-week accelerator, monthly pod appearances.

**Revenue LIVE (Feb 12):** SEO automation (132 pages in 2 hours). Deal-finding agents. Content repurposing (1 podcast → 15 pieces). Local hosting cuts AI costs 80%. Sales intelligence agents.

### What Jason Rewards
- Initiative (built something, got users)
- Real traction even if small
- Clear, productized OpenClaw use cases
- Agent-driven workflows touching real systems with measurable leverage
- Ship first, then raise
- FTE-equivalents and revenue framing
- Multi-step automations, not chatbots

---

*End of data dump. See Overlap_Session_Summary_Feb13.md for synthesis and pitch implications.*
