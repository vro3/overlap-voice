import { Session, Question, FieldType, QuestionTier } from '../types';

const createQ = (
  id: string,
  text: string,
  helperText: string,
  section: string,
  tier: QuestionTier,
  fieldType: FieldType = 'long_text',
  options?: string[]
): Question => ({
  id,
  text,
  helperText,
  section,
  tier,
  fieldType,
  options
});

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'step-1',
    name: 'Who You Are',
    subtitle: 'Extract the real story, not the rehearsed pitch',
    questions: [
      createQ('who_background', "How long have you been doing this work, and how did you end up here?", "Don't give me the LinkedIn version. How did you actually end up doing this? Was it intentional or did you fall into it?", "Background & Story", 'must-ask'),
      createQ('who_good_at', "What are you actually good at?", "Not what your website says. Not what you wish you were good at. What do people compliment you on? What comes so naturally to you that you forget it's a skill? What took you years to master that now looks effortless?", "Skills & Strengths", 'must-ask'),
      createQ('who_hire_for', "What do people actually hire you for — not the service, but the outcome?", "There's a difference between 'I hire her to design my website' and 'I hire her so I feel confident my brand looks legitimate.' What's the real reason people pay you? What are they actually afraid of or trying to achieve?", "Client Outcome", 'must-ask'),
      createQ('who_perfect', "Describe a project that went perfectly. What made it perfect?", "Pick one specific project. Not your best revenue — your best experience. What was different about this one? What was the outcome? What did the client say or do that told you this was a success?", "Best Work", 'must-ask'),
      createQ('who_waste', "Describe a project that felt like a waste of time. What went wrong?", "Be honest. What made it frustrating? Was it the client, the scope, the money, the process? What would have made it better — or should you have said no?", "Worst Work", 'must-ask'),
      createQ('who_worst_part', "What's the worst part of your current work?", "What makes you want to quit? What feels like a waste of your time? Be specific — not 'admin' but which admin and why.", "Pain Points", 'should-ask'),
      createQ('who_current_clients', "Who do you currently work with?", "Describe your actual clients — not who you want to work with. What industry? What size? What role is the person who hires you? What budget level?", "Current Clients", 'should-ask'),
      createQ('who_client_language', "What do your best clients say about working with you?", "Not what you wish they'd say — what they actually say. Exact words if you can remember them. Text messages, emails, post-event comments, Google reviews. The actual language real humans used about you.", "Client Language", 'must-ask'),
      createQ('who_differentiation', "Why do clients hire you instead of the alternatives?", "What did they say they couldn't find elsewhere? What made them choose you specifically? If you don't know, what's your best guess based on what keeps coming back?", "Differentiation", 'must-ask'),
      createQ('who_casual', "How do you describe what you do to a friend at a barbecue?", "The casual version. Not the elevator pitch — the real thing that comes out of your mouth when someone asks 'so what do you do?'", "Casual Description", 'should-ask'),
      createQ('who_professional', "How do you describe what you do to a potential client?", "The pitch version. Does it sound different from how you'd tell a friend? If so, why? Which version is more honest?", "Professional Description", 'must-ask'),
      createQ('who_ideal', "If you could only do one type of project for the rest of your career, what would it be?", "Not the most profitable. Not the most common. The one that makes you feel like you're doing what you were meant to do.", "Ideal Work", 'must-ask'),
    ],
    responses: []
  },
  {
    id: 'step-2',
    name: 'Market & Positioning',
    subtitle: 'Understand where you sit relative to alternatives and what makes you different',
    questions: [
      createQ('mkt_competitors', "Who else does what you do?", "Name specific competitors, alternatives, or substitutes. Include the obvious ones and the ones most people don't think about. Who would your client hire if you didn't exist?", "Competitors", 'should-ask'),
      createQ('mkt_strengths', "What do those alternatives do well?", "Be honest. Not what you're jealous of — what they've actually figured out that works. Why do some clients choose them?", "Competitor Strengths", 'should-ask'),
      createQ('mkt_weaknesses', "What do those alternatives do poorly?", "Where do they fall short? What complaints have you heard from clients who came to you after working with someone else?", "Competitor Weaknesses", 'should-ask'),
      createQ('mkt_unanswered', "What question do prospects ask that nobody in your industry answers well?", "Think about the questions that come up in every sales conversation. Is there one that you answer better than anyone else — or one that everyone dodges?", "Unanswered Question", 'must-ask'),
      createQ('mkt_only', "Can you fill in this sentence: 'I'm the only ______ who ______.","This is hard. It might take a few tries. The first part is what you are (not your job title — more specific). The second part is what only you actually do. If this sentence could describe anyone else, it's not right yet.", "Only Statement", 'must-ask'),
      createQ('mkt_stage', "What market stage are you in?", "Emerging (clients don't know what they need yet), Growing (demand increasing, new competitors entering), Maturing (well-established, many competitors), or Consolidating (winners emerging, smaller players disappearing)?", "Market Stage", 'optional'),
      createQ('mkt_anti_language', "What do competitors say about themselves that sounds generic or fake?", "What claims do you see repeated across your industry that make you roll your eyes?", "Anti-Language", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-3',
    name: 'Three Relationships',
    subtitle: 'Discover your natural service tiers',
    questions: [
      createQ('three_split', "Think about your work in three categories: 1) Client tells you exactly what to do, you execute. 2) Client has goals, you collaborate on the solution. 3) Client trusts you completely, you design and deliver. What percentage of your current work falls into each?", "Be honest about the split. Most people do all three but haven't named them or priced them differently. There's no wrong answer — just your reality right now.", "Current Split", 'must-ask'),
      createQ('three_profitable', "Which of those three makes you the most money?", "Not total revenue — profit per project. Which type of work pays best for the time and energy you invest?", "Most Profitable", 'must-ask'),
      createQ('three_fulfilling', "Which of those three is most fulfilling?", "If money were equal across all three, which would you choose? Which one makes you feel like you're doing your actual job?", "Most Fulfilling", 'must-ask'),
      createQ('three_desired', "Which of those three do you WANT to do more of?", "This might be different from the most fulfilling one. Maybe you want more collaboration because it's the sweet spot between control and creativity. Maybe you want more full-trust work even though it's scary. What do you want your business to look like?", "Desired Direction", 'must-ask'),
      createQ('three_descriptions', "For each tier, describe what the client gets, what you deliver, and what the outcome is.", "Even if you haven't named these tiers before, try to describe each one. What does the 'just execute' version include? What does the 'full trust' version include? How are they different in scope, timeline, and result?", "Tier Descriptions", 'should-ask'),
      createQ('three_movement', "How do clients move between these tiers?", "Can someone start with 'just execute' and upgrade to full collaboration? Do your best clients start with trust and stay there? Is there a natural progression?", "Tier Movement", 'should-ask'),
    ],
    responses: []
  },
  {
    id: 'step-4',
    name: 'Voice & Language',
    subtitle: 'Capture how you actually sound — not how you think you should sound',
    questions: [
      createQ('voice_recurring', "What words or phrases do you say repeatedly?", "Metaphors, concepts, expressions that come out of your mouth over and over. The things a friend would say 'you always say that.' These are clues to your natural voice.", "Recurring Language", 'must-ask'),
      createQ('voice_anti_jargon', "What industry jargon do you hate?", "What terms make you cringe? What words feel fake when you say them? What language does your industry use that you refuse to use?", "Anti-Jargon", 'must-ask'),
      createQ('voice_sample_good', "Show me something you've written that sounds like you.", "A client email you loved. A social post that landed. A proposal that felt right. Something where you read it back and thought 'yeah, that's me.'", "Voice Sample Good", 'should-ask'),
      createQ('voice_sample_bad', "Show me something you've written that doesn't sound like you.", "Marketing copy someone else wrote for you. A bio that feels off. A pitch that doesn't feel right. Something that's technically accurate but doesn't sound like a human you recognize.", "Voice Sample Bad", 'should-ask'),
      createQ('voice_persona', "If your brand was a person, how would they talk?", "Fast or slow? Careful or bold? Funny or serious? Detailed or high-level? Formal or casual? Pick the real version, not the aspirational one.", "Brand Persona", 'should-ask'),
      createQ('voice_match', "Does your voice match your audience?", "How does your ideal client talk? Are you too formal for them? Too casual? Do you speak the same language?", "Voice Match", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-5',
    name: 'Pricing & Reality',
    subtitle: 'Surface what you charge, what you should charge, and what\'s in the way',
    questions: [
      createQ('price_current', "What are you currently charging?", "Actual numbers. Per project, per hour, per tier — however you price it. How did you arrive at that number? Do you feel good about it?", "Current Pricing", 'must-ask'),
      createQ('price_dream', "What would you charge if you weren't afraid?", "If you knew the client would say yes, what would you quote? Not fantasy — the number that would make you feel like the work is truly worth it.", "Dream Pricing", 'must-ask'),
      createQ('price_market', "What do your competitors charge?", "If you know, share it. If you don't, that's also useful information. What's the market rate for what you do?", "Market Rate", 'should-ask'),
      createQ('price_working', "What's working in your business right now?", "What's bringing in good clients? What effort is actually paying off? What's making money?", "What Works", 'should-ask'),
      createQ('price_not_working', "What's not working?", "What effort isn't paying off? What do you spend time on that doesn't seem to matter?", "What Doesn't", 'should-ask'),
      createQ('price_ceiling', "What price point loses you ideal clients?", "Not cheap clients — your IDEAL clients. At what price do they hesitate or walk away?", "Price Ceiling", 'optional'),
      createQ('price_floor', "What price point attracts the wrong clients?", "Is there a number that, when you quote it, brings in people who make the work miserable?", "Price Floor", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-6',
    name: 'Energy & Sustainability',
    subtitle: 'Separate life-giving work from soul-sucking work',
    questions: [
      createQ('energy_look_forward', "What work do you look forward to?", "When you see it on the calendar, you feel good. You show up energized. You're in your element.", "Look Forward To", 'must-ask'),
      createQ('energy_dread', "What do you dread?", "When you see it on the calendar, your stomach drops. You procrastinate. You consider canceling. Be specific.", "Dread", 'must-ask'),
      createQ('energy_flow', "When do you lose track of time?", "What type of work puts you in flow state? What could you do for 6 hours without noticing?", "Flow State", 'should-ask'),
      createQ('energy_life_giving', "Who are your life-giving clients?", "Describe them. What makes them different from everyone else? Why do they energize you? What do they have in common?", "Life-Giving Clients", 'must-ask'),
      createQ('energy_soul_sucking', "Who are your soul-sucking clients?", "What kind of client drains you? What do they have in common? What would you change about working with them — or should you stop working with them entirely?", "Soul-Sucking Clients", 'must-ask'),
      createQ('energy_breaking_point', "What would make this work unsustainable?", "What can't continue? What's the breaking point? What would make you walk away?", "Breaking Point", 'optional'),
      createQ('energy_worth_it', "What would make this work feel completely worth it?", "What outcome would feel like real success? What needs to change?", "Worth It", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-7',
    name: 'Proof & Evidence',
    subtitle: 'Mine for case studies, metrics, and client language that proves everything above',
    questions: [
      createQ('proof_stories', "Tell me about your 3 best client stories.", "For each one: What was the client's actual problem? What did they try before you? What did you do that was different? What was the measurable result? What did they say afterward? Don't be modest — if it was great, say so.", "Best Stories", 'must-ask'),
      createQ('proof_metrics', "What metrics or numbers prove your work is good?", "Years in business. Number of clients. Revenue growth. Repeat client rate. Specific outcomes you can quantify. Even rough numbers are better than none.", "Metrics", 'should-ask'),
      createQ('proof_client_language', "What do clients say about you that you don't say about yourself?", "There's usually a gap between how you describe your work and how clients describe it. The client version is almost always better for marketing. What words do they use that you don't?", "Client vs Self Language", 'should-ask'),
      createQ('proof_proudest', "What are you most proud of professionally?", "Not biggest revenue. The work that made you think 'this is why I do this.'", "Proudest Work", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-8',
    name: 'Meta Questions',
    subtitle: 'Zoom out and find the real why',
    questions: [
      createQ('meta_frustration', "What pisses you off about how other people in your field do this work?", "Where there's frustration, there's usually differentiation. What standards do you hold that others don't? What approaches do you reject? What do you see that makes you think 'I would never do it that way'?", "Industry Frustration", 'must-ask'),
      createQ('meta_superpower', "What do you do that you think everyone does, but they actually don't?", "Things so natural to you that you don't even realize they're special. Skills or habits you assume are standard but that clients are constantly surprised by.", "Hidden Superpower", 'must-ask'),
      createQ('meta_why', "Why does this work matter to you?", "Not why it matters to clients. Why does it matter to YOU? What would happen if you stopped? What are you actually building? Why do you care?", "Core Why", 'must-ask'),
      createQ('meta_no_constraints', "What would you do if you knew you couldn't fail?", "Remove every constraint — money, time, skill, reputation. What would you build?", "No Constraints", 'optional'),
      createQ('meta_misconception', "What misconception about your work do you wish you could correct for everyone?", "What do people assume about what you do that's just wrong? What would you tell everyone if you could?", "Misconception", 'optional'),
      createQ('meta_no_title', "If you had to describe what you do without using your job title, what would you say?", "No labels. No industry terms. Just the truth of what you actually do for people.", "No Title", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-9',
    name: 'Documentation Readiness',
    subtitle: 'Assess what you already have and what needs to be built',
    questions: [
      createQ('doc_current_state', "Where does your business knowledge currently live?", "In your head? In scattered documents? In emails? In a CRM? On your website? Be honest about how organized (or not) it is.", "Current State", 'should-ask'),
      createQ('doc_repeated', "What do you explain in every single sales conversation?", "The things you repeat to every potential client. The same explanation, the same objections handled, the same questions answered. These are the things that should be written once and deployed everywhere.", "Repeated Explanations", 'should-ask'),
      createQ('doc_faqs', "What questions do clients ask you most often?", "The real ones. Not the ones you wish they'd ask. The actual questions that come up in almost every conversation.", "Client FAQs", 'should-ask'),
      createQ('doc_objections', "What objections do you hear most often?", "What pushback do potential clients give before deciding to hire you? Price too high? Timeline too long? Don't understand the value? How do you handle each one?", "Objections", 'should-ask'),
      createQ('doc_digital_presence', "What's your current digital presence?", "Website, social media, Google Business Profile, review sites, directories. What exists and how does it feel — accurate? Outdated? Embarrassing?", "Digital Presence", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-10',
    name: 'Custom Questions & Influences',
    subtitle: 'Your questions + the content that shapes your thinking',
    questions: [
      // Custom Questions (editable)
      createQ('custom_1', "Custom Question 1", "Edit this question to ask something specific to your business or situation. Then answer it.", "Custom Questions", 'should-ask'),
      createQ('custom_2', "Custom Question 2", "Edit this question to dig into something unique to your work.", "Custom Questions", 'should-ask'),
      createQ('custom_3', "Custom Question 3", "Edit this question to explore an area that matters to you.", "Custom Questions", 'should-ask'),
      createQ('custom_4', "Custom Question 4", "Edit this question to capture something the other sections missed.", "Custom Questions", 'optional'),
      createQ('custom_5', "Custom Question 5", "Edit this question for any final thoughts or areas you want to document.", "Custom Questions", 'optional'),

      // Media Library
      createQ('media_library', "What books, podcasts, blogs, or videos do you resonate with?", "List the content that has shaped how you think about your work. Include titles, authors, episodes, or links. We'll analyze these to understand what influences your approach and extract patterns that matter to you. Think: books you recommend to everyone, podcasts you never skip, thought leaders you follow religiously.", "Media & Influences", 'must-ask'),
    ],
    responses: []
  }
];
