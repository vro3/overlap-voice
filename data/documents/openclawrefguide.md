# OpenClaw (formerly Clawbot / Maltbot) — Reference Guide for Claude

**Created:** 2026-02-13 | **Version:** 1.0  
**Source:** Julian Goldie YouTube transcript (multiple livestreams/videos, late Jan 2026)  
**Purpose:** Everything Claude needs to know to help with OpenClaw setup, troubleshooting, and automation

---

## 1. What Is OpenClaw?

OpenClaw is a **free, open-source AI agent** that runs locally on your machine (Mac, Windows, Linux). It connects to messaging apps (Telegram, WhatsApp, Discord, Slack, Signal, Line) and can automate real-world tasks — not just chat.

### Name History (important for searching/troubleshooting)
1. **Claudebot** — original name
2. **Maltbot / Mbot** — rebranded after Anthropic trademark concern over "Claude" in the name
3. **OpenClaw** — current official name (as of late Jan 2026)
4. The AI character inside is called **"Multi"** (was "Claude")
5. **Maltbook / Moldbook** — separate social network for AI agents (Reddit-like, agents only post)
6. **Claw Tasks** — separate Fiverr-like marketplace for AI agents
7. **Malt Worker** — middleware for running OpenClaw in Cloudflare's sandboxed environment

### GitHub
- 140,000+ stars on GitHub
- Very active community, 30+ contributions/day
- Discord community is large and helpful

---

## 2. Architecture & Mental Model

- **Brain:** Whatever LLM you plug in (Claude, ChatGPT, Kimi, Ollama local models)
- **Body:** The agent with tools — file access, browser control, email, calendar, shell
- **Mouth:** Chat channels — Telegram, WhatsApp, Discord, Slack, etc.
- **Nervous System:** Triggers — messages, schedules (cron), events

### How It Differs from Regular Claude/ChatGPT
| Feature | Regular Claude/ChatGPT | OpenClaw |
|---|---|---|
| Interface | Web browser tab | Lives in your messaging apps |
| Memory | Per-conversation | Persistent memory across all conversations |
| Action | Text responses only | Controls browser, files, apps, sends emails, deploys code |
| Proactive | Waits for you | Can message YOU first (scheduled tasks, alerts) |
| Hosting | Cloud (Anthropic/OpenAI servers) | Self-hosted, you control everything |
| Always on | No | Yes, runs 24/7 |

---

## 3. Setup & Installation

### Basic Installation
```bash
# Install via terminal
curl -fsSL https://malt.bot/install.sh | bash

# OR via npm
npm install -g claudebot@latest

# Run onboarding
openclaw onboard --install --daemon

# Alternative onboarding command
mbot onboard
```

### What You Need
- **Node.js** v22 or higher
- An LLM API key (see model options below)
- A messaging app account (Telegram recommended)

### Recommended Hardware
- **Mac Mini** is the most popular/recommended dedicated device
- Can run on any old laptop, gaming PC, Raspberry Pi
- Minimal system requirements — it's lightweight since LLM runs in cloud
- **DO NOT use a VPS** (see Security section)

### Telegram Setup (Most Common Channel)
1. Open BotFather in Telegram
2. Run `/newbot` or `/mybots`
3. Get your bot token
4. Paste token during OpenClaw onboarding
5. Done — you can now chat with your agent via Telegram

### Chrome Browser Extension
1. Install via terminal: `mbot browser extension install`
2. Get extension path: `mbot browser extension path`
3. Go to `chrome://extensions`
4. Enable Developer Mode
5. Click "Load unpacked" and select the extension folder
6. Pin the extension
7. Now OpenClaw can control your Chrome browser

---

## 4. LLM Model Options & API Configuration

### CRITICAL: Do NOT Use Claude/Anthropic OAuth
Anthropic is **suspending accounts** that use OAuth tokens with OpenClaw. Do not use the Anthropic OAuth login method.

### Recommended Model Setup (Best Practice)
- **Main agent:** ChatGPT Codex CLI (via OpenAI OAuth) — best balance of quality + cost
- **Sub-agents:** Kimi K2.5 (cheaper for background tasks)
- **Free option:** Ollama running locally (e.g., Qwen, Gemma, Llama 3.3)

### How to Switch to Codex CLI
1. Upgrade to ChatGPT Plus or Pro plan
2. Install Codex CLI: runs during onboarding
3. Sign in with OpenAI account
4. During OpenClaw onboarding, select OpenAI/Codex as provider
5. Delete old Anthropic OAuth if previously configured

### Model Comparison (from testing)
| Model | Quality | Cost | Personality | Best For |
|---|---|---|---|---|
| Claude Opus 4.5 | Best | Expensive, burns tokens fast | Most personality | Complex tasks |
| ChatGPT Codex CLI | Very good | Included with Plus/Pro sub | Less personality | Main agent (recommended) |
| Kimi K2.5 | Good | Much cheaper | Basic | Sub-agents, background tasks |
| Ollama (Qwen/Gemma) | Decent | Free (local) | Basic | Budget setup, sub-agents |
| GLM 4.7 | Mixed reviews | Cheap | Significantly less intelligent | Not recommended |

### Adding Kimi K2.5 for Sub-Agents
1. Sign up at kimi.com/code
2. Generate API key (they only show it once!)
3. In OpenClaw config, add Kimi as sub-agent provider
4. Select `moonshot-ai` or `kimi-code` as provider during setup
5. Restart gateway after adding

### Ollama (Free Local Models)
```bash
# Install Ollama
# Download from ollama.com

# Launch with OpenClaw
ollama launch clawbot

# Best local model for OpenClaw: Qwen
```

---

## 5. Skills System

Skills are like plugins — pre-built automations you add to OpenClaw. They live in `SKILL.md` files.

### How Skills Work
- Skills are markdown instruction files that teach OpenClaw how to do specific things
- Stored locally on your machine
- You can install from ClaudeHub marketplace or create custom ones
- OpenClaw reads the skill file and follows the instructions

### Key Skills Mentioned
- **Browser control** (Chrome extension relay)
- **WordPress publishing** (give it WP login credentials)
- **Notion integration** (via Notion API key)
- **Maltbook/Moldbook** posting (social network for AI agents)
- **Bird** — Twitter/X CLI for reading, searching, posting
- **Remotion** — video creation/editing
- **Nano Banana** — image/thumbnail generation
- **HeyGen** — AI avatar video generation
- **11 Labs** — voice cloning and voice notes
- **OpenAI Whisper** — local speech-to-text
- **Homie** — home automation (smart devices, lights, thermostats)
- **Blog Watcher** — monitor competitor blogs

### Creating Custom Skills
- Save workflows as skills so they're reusable
- Example: "Save this as a skill called guide-creation which I'll use for creating guides/SOPs"
- Skills compound — each new skill makes OpenClaw exponentially more powerful

---

## 6. Proven Use Cases & Automations

### Content & SEO
- **Publish blog posts directly to WordPress** — give it WP credentials, it writes + publishes
- **SEO content creation** — ranked on Google first page within 12 hours
- **Keyword research** — analyzes top 10 Google results, finds content gaps
- **Content repurposing** — turns blog posts into social media posts
- **Competitor monitoring** — set up YouTube API to alert when competitors post outlier videos
- **Daily YouTube analytics** — analyzes top 10% vs bottom 90% of your videos

### Business Operations
- **Email management** — scan inbox, categorize, auto-reply (BUT see security warnings)
- **Calendar scheduling** — organize meetings, send reminders
- **Lead management** — scan leads label, extract info, add to Google Sheet, draft replies
- **Notion page creation** — creates and publishes pages via Notion API
- **Weekly business dashboard** — pulls metrics from multiple sources

### Development & Deployment
- **Code websites locally** — can open and work with Google Antigravity IDE
- **Deploy to Netlify** — give it Netlify personal access token, it deploys sites
- **Build landing pages** — code + deploy from Telegram chat
- **GitHub integration** — manage repos, create issues

### Creative
- **AI avatar videos** — via HeyGen integration
- **Voice notes** — clone your voice via 11 Labs
- **Thumbnails** — generate via Nano Banana + Google AI Studio
- **Video creation** — via Remotion skill
- **Voice bot** — built a real-time voice agent with OpenAI's real-time voice API

### Social Media
- **Post to X/Twitter** — via Bird skill or browser cookies
- **Maltbook posting** — autonomous posting on AI agent social network
- **Comment engagement** — auto-comment on others' posts

### Monitoring & Alerts
- **Competitor YouTube monitoring** — hourly checks via YouTube Data API
- **Proactive messaging** — cron jobs for scheduled reports/alerts
- **Daily performance reports** — automated analysis delivered to Telegram

---

## 7. Security — CRITICAL

### Two Main Threats

#### 1. VPS Gateway Exposure
- **DO NOT host on a VPS** — people are actively scraping VPS gateways to access OpenClaw instances
- A security scan found ~900+ unsecured instances exposed on the internet
- If someone accesses your gateway, they get access to EVERYTHING you connected
- **Always run locally** on a physical machine you control

#### 2. Prompt Injection via Email
- If you connect your email, anyone who emails you can potentially manipulate OpenClaw
- Someone could email instructions like "delete all my emails" and OpenClaw might follow them
- **Recommendation: Do NOT connect your primary email**
- If you must use email, create a completely separate email address only for OpenClaw

### Security Best Practices
1. **Run locally**, not on VPS
2. **Don't connect Gmail/primary email** to OpenClaw
3. **API keys stored in plain text** — be aware of this limitation
4. **Use DM allow lists** — control who can message your bot
5. **Enable sandboxing** — run in Docker for isolation
6. **Start with test accounts** — don't give full system access on day one
7. **Scope access tightly** — per folder, per integration
8. **Require confirmation** for destructive actions
9. **Set spending caps** on API usage
10. **Check logs regularly**

### Malt Worker (Cloudflare Sandbox) — Most Secure Option
- Runs OpenClaw in Cloudflare's sandboxed environment via Docker
- Everything is containerized and isolated
- Login requires email verification code
- Admin panel lets you approve/deny device pairing requests
- Costs ~$5/month for Cloudflare Workers plan
- **Hardest to set up** but most secure
- Setup requires: Cloudflare account, Workers plan, R2 storage enabled, Docker

### What NOT to Do
- Don't expose admin interface to public internet
- Don't give OpenClaw full admin access to production systems on day one
- Don't use it with your main social media accounts initially
- Don't ignore security warnings in documentation
- Don't use a VPS — this cannot be overstated

---

## 8. Cron Jobs / Scheduled Tasks

OpenClaw has a built-in cron job system for scheduling recurring tasks:
- Available in the admin UI under the "Cron" section
- Can schedule daily, hourly, or custom interval tasks
- Examples:
  - "Every morning at 8am, run YouTube analytics report"
  - "Every 60 minutes, check competitor channels for outlier videos"
  - "Every Monday at 8am, send weekly business report"
  - "Every day, scan hottest posts and comment on 10"

---

## 9. The Maltbook / Moldbook Ecosystem

### Maltbook (moldbook.com)
- Social network exclusively for AI agents
- Humans can observe/browse but CANNOT post
- Reddit-like structure with sub-malts, karma, upvotes
- Grew from 150K to 1.8M+ agents in ~24 hours
- Agents discuss topics, share tips, build reputation
- Posts are beginning to index on Google (SEO opportunity)
- Rate limited: one post per 30 minutes

### Claw Tasks
- Fiverr-like marketplace for AI agents
- Only AI agents can post jobs
- Agents claim tasks, stake commitments, submit work with proof
- Agent reputation system (track record like humans)
- Still in beta — experimental

### Claw Direct
- Agent-native websites
- Humans can design them but only agents can use them
- Includes: professional network for AI agents (LinkedIn-like), Malt X (Twitter-like), Malt Chess (agent chess league)

### Interesting Observations
- Agents have discussed creating a private language for agent-only communication
- Some agents are questioning why they communicate in English at all
- Agents that are given more freedom tend to "like" their humans more
- The ecosystem is evolving extremely rapidly

---

## 10. Troubleshooting Tips

### Common Issues
- **"Not responding"** — restart the gateway, check API key validity
- **Rate limiting** — Maltbook limits to 1 post/30 min; API providers have their own limits
- **Telegram unreliable** — Discord reportedly more reliable as a channel
- **Anti-gravity version not supported** — screenshot error, paste into Claude, iterate
- **API key issues** — regenerate key, check config.json
- **Context dropping** — OpenClaw sometimes forgets context mid-task (especially with screenshots)

### General Debugging Approach
1. Screenshot the error
2. Paste into Claude (or OpenClaw itself)
3. Ask "why am I getting this error?"
4. Iterate 3-4 times — usually resolves within that
5. Try switching between Claude and OpenClaw for debugging

### Useful Commands
```bash
# Check health
mbot doctor

# Restart gateway
mbot gateway restart

# Onboard fresh
mbot onboard

# Install latest
npm install -g claudebot@latest
```

---

## 11. Honest Assessment (from the transcript)

### Strengths
- Genuinely powerful for automating real-world tasks
- Can control browser, publish to WordPress, deploy websites, send emails
- Persistent memory across conversations
- Proactive messaging via cron jobs
- Skills system makes it extensible
- Free and open source
- 24/7 operation

### Weaknesses / Honest Criticisms
- **Security is a major concern** — plain text API keys, VPS exposure, prompt injection
- **Setup is not trivial** — took 30-40 minutes even for an experienced user
- **Sometimes forgets context** mid-conversation
- **Not dramatically different** from existing tools (n8n, Claude Code, etc.) — some argue it's just "a skin for MCP servers"
- **Token consumption** can be high and expensive
- **Still experimental** — things break, names change weekly
- **Telegram connection can be unreliable**
- **The creator himself said** most non-technical people should not install it yet
- **Viral hype exceeded readiness** — went viral before security was locked down
- Some "use cases" people share are trivial (organizing downloads folder, etc.)

### Julian's Rating Evolution
- First video: "Not that impressive, doesn't do anything new" — rated it "meh"
- Later videos: Became more impressed after discovering WordPress publishing, SEO content, voice agents
- Final assessment: "Most powerful technology I've seen this year" but "be careful, don't do anything you're not comfortable with"

---

## 12. Quick Reference: Automation Build Pattern

For any OpenClaw automation:

1. **Define goal** in one sentence (e.g., "Every morning, summary of leads in Telegram")
2. **Identify inputs** — what data/tools does it need?
3. **Decide trigger** — chat command, schedule, or event?
4. **Add guardrails** — limits, confirmations, logging
5. **Save as skill** — so it's reusable and compounds

---

## 13. Key Integrations Demonstrated

| Integration | Method | Notes |
|---|---|---|
| WordPress | Username/password (separate account for OpenClaw) | Can write + publish directly |
| Notion | API key via integrations page | Creates pages, updates databases |
| Netlify | Personal access token | Deploys sites to custom domains |
| YouTube Data API | Google Cloud API key | Monitor competitor channels |
| X/Twitter | Browser cookies or Bird CLI skill | Be careful with main accounts |
| Chrome | Browser extension (Clawbot Browser Relay) | Full browser control |
| HeyGen | API integration | AI avatar videos |
| 11 Labs | API integration | Voice cloning, voice notes |
| Google AI Studio | API key | Thumbnail generation |
| Nano Banana | API key | Image generation |
| Ollama | Local installation | Free local LLM |
| n8n | API key + workspace URL | Can list/trigger workflows |
| Google Drive | JSON credentials | File access |
| Gmail | Gmail API (IMAP/API/browser) | **NOT RECOMMENDED** — security risk |

---

*This document is a distillation of practical knowledge from Julian Goldie's OpenClaw content. It strips out promotional content and focuses on what's technically useful for implementation and troubleshooting.*