// demoData.ts — v1.0 — 2026-06-11
// A fully-believable example session for the guided demo walkthrough.
// No API calls, nothing saved. The persona is a fictional keynote speaker /
// team-culture consultant ("Marcus Webb") — a solo expert whose value lives
// almost entirely in his head, which is exactly who The Overlap is built for.
// Answers are voice-y on purpose: the whole point of the tool is capturing how
// someone actually sounds, so generic filler would undersell it.

export const DEMO_EMAIL = 'marcus@example.com';

// The router / "vision" question from the magic-link screen.
export const DEMO_ROUTER_ANSWER =
  "Honestly? I'd stop being the bottleneck. Right now every proposal, every discovery call, every \"can you just look at this\" runs through me. If this works, my team could answer a client the way I would — in my words — without me in the room. I'd get my mornings back and stop turning down work just because I'm the only one who can do it.";

// Seeded answers keyed by question id (see data/initialData.ts).
// Sections 1–6 are filled in (must-ask + key should-ask); later sections are
// left blank on purpose, so the session reads like a real one in progress.
export const DEMO_ANSWERS: Record<string, string> = {
  // ── Step 1 · Who You Are ───────────────────────────────────────────
  who_background:
    "Fifteen years. I started as a middle manager who kept getting handed the \"broken\" teams — great talent, terrible morale. I was supposed to fix the numbers; what I actually did was fix how people talked to each other, and the numbers followed. A VP noticed, asked me to do it for three other teams, and somewhere in there I realized this was the job, not a detour from it. Went out on my own in 2018.",
  who_no_title:
    "I help teams that have quietly stopped trusting each other start again. Most of the time the strategy is fine and the talent is there — what's broken is that people have given up on each other and nobody's said it out loud. I make it safe to say the thing nobody's saying, and I give them a way to work that doesn't depend on everyone being best friends.",
  who_transformation:
    "Meetings stop being theater. People start disagreeing in the room instead of in the parking lot afterward. The good ones stop quietly updating their résumés. Leaders tell me the room finally feels honest — that they can bring a hard problem to their team and actually get help instead of nodding.",
  who_client_language:
    "The one that sticks with me: a COO said, \"You didn't teach us anything we didn't already know — you just made it impossible to keep pretending.\" Another wrote, \"For the first time in two years I left an offsite with more energy than I walked in with.\" And one I'll never forget: \"My team didn't change. The way I lead them did.\"",
  who_not_for:
    "Founders who want a motivational speaker to spray confetti on a culture they have no intention of changing. If leadership wants the team \"fixed\" but won't sit in the room and be uncomfortable themselves, I'm the wrong call. I've turned down good money over this — it never works, and it burns my name.",
  who_casual:
    "I tell people I help teams that secretly can't stand each other figure out how to do great work anyway. That usually gets a laugh, and then a \"wait — can you call my boss.\"",

  // ── Step 2 · What You Do ───────────────────────────────────────────
  what_deliverable:
    "Three things, usually: a keynote that names the real problem out loud so nobody can un-hear it, a two-day working offsite where the team actually practices the hard conversations, and a 90-day follow-through plan so it doesn't evaporate the Monday after. The deliverable people remember is the offsite. The one that actually works is the 90 days.",
  what_process:
    "Discovery first — I interview six to ten people across levels, privately, and I promise I'll never attribute a quote. Then I write a \"state of the room\" memo that tells leadership the truth they've been protected from. We run the keynote or offsite. Then four follow-up sessions over 90 days where the team reports back on what they tried and where it broke.",
  what_scope:
    "Included: the interviews, the memo, the live session, the 90-day cadence, and direct text access to the leader during that window. Not included: org redesign, comp decisions, HR investigations, or being the person who delivers news leadership should deliver themselves. I'm a coach, not a human shield.",
  what_timeline:
    "Start to finish is about four months — two to three weeks of discovery, the session, then the 90-day follow-through. I won't do a one-and-done keynote with no follow-up anymore. It makes everyone feel great for a week and changes nothing.",
  what_involvement:
    "The leader has to be in the room and has to go first — answer the hard question before they ask their team to. I need honest access to people and a promise that nobody gets punished for what they tell me. If I can't get that, I'd rather not start.",

  // ── Step 3 · Market Position ───────────────────────────────────────
  mkt_alternatives:
    "Big-name keynote speakers, the McKinsey-style culture consultancies, and the personality-assessment crowd — Myers-Briggs, Predictive Index, the colored-dot workshops.",
  mkt_strengths:
    "The speakers are genuinely great on stage and make people feel something for an hour. The big firms bring real rigor and frameworks that hold up. The assessments give people a shared language fast, and that's not nothing.",
  mkt_weaknesses:
    "The speakers leave and nothing changes — it's a sugar high. The big firms produce a beautiful 80-slide deck nobody opens again. And the assessments become an excuse: \"well, I'm a high-D, that's just how I am.\" None of them stick around for the messy part where the actual change happens.",
  mkt_different:
    "I stay for the 90 days, and I do the private interviews first so the live session is built on what's actually true in that specific room — not a generic talk I give everywhere. I'm not selling a framework. I'm holding the room while they do the hard thing.",
  mkt_better:
    "Because the change doesn't happen on stage. It happens three weeks later, when someone finally says the hard thing in a real meeting and the world doesn't end. If I'm not there for that part, I'm just entertainment with a worksheet.",

  // ── Step 4 · Pricing & Value ───────────────────────────────────────
  price_structure:
    "Per engagement, not hourly. One fee covers discovery through the full 90 days. I stopped charging hourly years ago — it punished me for being fast and made clients watch the clock instead of doing the work.",
  price_range:
    "A full engagement — discovery, keynote or offsite, and the 90-day follow-through — runs $28K to $55K depending on team size and number of locations. A standalone keynote with no follow-up is $12K, but I'll usually talk you out of it.",
  price_roi:
    "Retention, mostly. Most clients come to me because they're bleeding their best people. We track regrettable attrition before and after — one client last year went from losing four senior people in six months to zero the following year. That math makes my fee look like a rounding error.",
  price_factors:
    "Team size, number of locations, and how bad it's gotten. A team that's merely tense moves faster than a team that's actively at war. Travel adds cost. Multiple offsites add cost.",

  // ── Step 5 · Voice & Communication ─────────────────────────────────
  voice_words_use:
    "\"Name it.\" \"Say the thing.\" \"What's the conversation you're not having?\" I talk a lot about the \"parking-lot meeting\" — the real meeting that happens after the meeting. And \"safe enough,\" never just \"safe\" — I don't promise comfort, I promise it won't blow up.",
  voice_words_avoid:
    "\"Synergy.\" \"Alignment\" used as a verb. \"Radical candor\" — it's been turned into a license to be a jerk. Anything that sounds like it came off a motivational poster. And I never say \"culture fit\" — it's usually code for \"people like me.\"",
  voice_tone:
    "Warm but direct. I'll make you laugh and then ask something that makes the room go quiet. I'm not the yelling kind of honest — I'm the kind that says the uncomfortable thing gently enough that you can actually hear it.",

  // ── Step 6 · Proof & Stories ───────────────────────────────────────
  proof_stories:
    "A 200-person software company had a leadership team that smiled in meetings and knifed each other in Slack. Discovery surfaced that two VPs hadn't had a real conversation in a year. We got them in a room, named it, and built a weekly 20-minute \"no-deck\" check-in. Six months later their eNPS went from 18 to 61 and those two VPs co-presented at the all-hands. I did not see that coming.",
  proof_metrics:
    "Across clients: regrettable attrition down an average of 40% in the year after, and \"I trust my leadership\" survey scores up 20–30 points. One manufacturing client cut their time-to-resolve-conflict — an actual metric they track — from weeks to days.",
  proof_testimonials:
    "\"You didn't teach us anything we didn't already know — you just made it impossible to keep pretending.\" I put it on my website because it's the most honest thing anyone's said about the work.",
};
