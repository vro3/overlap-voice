// The Overlap v3.0 — February 15, 2026
// Systematically polished using Vince's review patterns
import { Session, Question, FieldType, QuestionTier, InputType } from '../types';

const createQ = (
  id: string,
  text: string,
  helperText: string,
  section: string,
  tier: QuestionTier,
  fieldType: FieldType = 'long_text',
  options?: string[],
  _isCustomizable?: boolean
): Question => ({
  id,
  text,
  helperText,
  section,
  tier,
  fieldType,
  inputType: 'textarea' as InputType,
  options,
});

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'step-1',
    name: 'Who You Are',
    subtitle: 'Extract the real story, not the rehearsed pitch',
    questions: [
      createQ('who_intention', "Imagine this process did its job perfectly. How does your life look different or better in the next three to six months?", "Not what you think the 'right' answer is — what would actually change if this works? Don't say 'better marketing.' Say 'I want to stop rewriting my bio every time someone asks.' Be specific about the friction you want gone.", "Desired Outcome", 'must-ask'),
      createQ('who_background', "How long have you been doing this work? What was the path that brought you to doing what you do?", "Don't give me the LinkedIn version. Was this intentional or did you fall into it? What changed in your life that led to this?", "Background & Story", 'must-ask'),
      createQ('who_good_at', "What are the specific elements of your work that you're genuinely good at? Not the end result — the underlying skills that make the end result possible.", "Not 'I'm good at performing' but 'I'm good at reading a room and adjusting energy in real-time.' The competencies that enable your outcomes.", "Skills & Strengths", 'must-ask'),
      createQ('who_hire_for', "What do people actually hire you for — not the service, but the outcome?", "There's a difference between 'I hire her to design my website' and 'I hire her so I feel confident my brand looks legitimate.' What's the real fear or desire they're addressing?", "Client Outcome", 'must-ask'),
      createQ('who_perfect', "Describe a specific project that went perfectly. What made it perfect?", "Pick one project. Not your best revenue — your best experience. What was different about this one? What was the outcome? What did the client say or do that told you this was a success?", "Best Work", 'must-ask'),
      createQ('who_waste', "Describe a specific project that felt like a waste of time. What went wrong?", "Be honest. Was it the client? The scope? The money? The process? What would have made it better — or should you have just said no?", "Worst Work", 'must-ask'),
      createQ('who_worst_part', "What part of your work consistently creates problems, eats time, or makes you consider quitting?", "Be specific — not 'admin' but which part of admin drains you most. Not 'difficult clients' but what those clients actually do. What's the operational problem, not just the feeling?", "Pain Points", 'should-ask'),
      createQ('who_current_clients', "Who actually hires you? What types of clients or companies pay for your work?", "Describe your actual clients — not who you want to work with. What industry? What size? What role is the person who hires you? What budget level?", "Current Clients", 'should-ask'),
      createQ('who_client_language', "What specific compliments from your best clients make you feel the most proud of your work? Share the actual testimonials or feedback if you can.", "Not what you wish they'd say — what they actually said. Copy and paste the exact words. Text messages, emails, reviews, voice messages transcribed. The actual language real humans used about you.", "Client Language", 'must-ask'),
      createQ('who_differentiation', "Why do clients hire you instead of the alternatives?", "What did they say they couldn't find elsewhere? What made them choose you specifically? If you don't know, what's your best guess based on what keeps coming back?", "Differentiation", 'must-ask'),
      createQ('who_unspoken_value', "What do you do for clients that they don't know you do for them?", "The invisible work. The unspoken benefits. The value you create that they don't realize is happening or that they take for granted.", "Hidden Value", 'should-ask'),
      createQ('who_casual', "How do you describe what you do to a stranger at a barbecue?", "The casual version. Not the elevator pitch — the real thing that comes out of your mouth when someone asks 'so what do you do?'", "Casual Description", 'should-ask'),
      createQ('who_professional', "How do you describe what you do when pitching a potential client?", "The pitch version. Does it sound different from how you'd tell a friend? If so, why? Which version is more honest?", "Professional Description", 'must-ask'),
      createQ('who_ideal', "If you could only do one type of project for the rest of your career, what would it be?", "Not the most profitable. Not the most common. The one that makes you feel like you're doing what you were meant to do.", "Ideal Work", 'must-ask'),
      createQ('who_no_title', "If you couldn't use your job title, how would you describe what you actually do for people?", "No labels. No industry terms. Just the truth of what you actually do.", "No Title", 'should-ask'),
    ],
    responses: []
  },
  {
    id: 'step-2',
    name: 'Market & Positioning',
    subtitle: 'Understand where you sit relative to alternatives and what makes you different',
    questions: [
      createQ('mkt_competitors', "Who do clients compare you to or consider instead of you?", "Name specific competitors, alternatives, or substitutes. Include the obvious ones and the ones most people don't think about. Who would they hire if you didn't exist?", "Competitors", 'should-ask'),
      createQ('mkt_strengths', "In your opinion, what do those alternatives do well?", "Be honest. Not what you're jealous of — what they've actually figured out that works. Why do some clients choose them over you?", "Competitor Strengths", 'should-ask'),
      createQ('mkt_weaknesses', "In your opinion, what do those alternatives do poorly?", "Where do they fall short? What complaints have you heard from clients who came to you after working with someone else?", "Competitor Weaknesses", 'should-ask'),
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
      createQ('three_profitable', "Which of those three makes you the most money per project?", "Not total revenue — profit per project. Which type of work pays best for the time and energy you invest?", "Most Profitable", 'must-ask'),
      createQ('three_fulfilling', "Which of those three is most fulfilling to you?", "If money were equal across all three, which would you choose? Which one makes you feel like you're doing your actual job?", "Most Fulfilling", 'must-ask'),
      createQ('three_desired', "Which of those three do you WANT to do more of?", "This might be different from the most fulfilling one. Maybe you want more collaboration because it's the sweet spot between control and creativity. Maybe you want more full-trust work even though it's scary. What do you want your business to look like?", "Desired Direction", 'must-ask'),
      createQ('three_descriptions', "For each tier, describe what the client gets, what you deliver, and what the outcome is.", "Even if you haven't named these tiers before, try to describe each one. What does the 'just execute' version include? What does the 'full trust' version include? How are they different in scope, timeline, and result?", "Tier Descriptions", 'should-ask'),
      createQ('three_movement', "How do clients move between these tiers?", "Do clients start with 'just execute' and upgrade to full collaboration? Do your best clients start with trust and stay there? Is there a natural progression?", "Tier Movement", 'should-ask'),
    ],
    responses: []
  },
  {
    id: 'step-4',
    name: 'Voice & Language',
    subtitle: 'Capture how you actually sound — not how you think you should sound',
    questions: [
      createQ('voice_recurring', "What words or phrases do you say repeatedly?", "Metaphors, concepts, expressions that come out of your mouth over and over. The things a friend would say 'you always say that.' These are clues to your natural voice.", "Recurring Language", 'must-ask'),
      createQ('voice_anti_jargon', "What industry terms confuse your clients or make their eyes glaze over?", "What terms make you cringe? What words feel fake when you say them? What language does your industry use that you refuse to use?", "Anti-Jargon", 'must-ask'),
      createQ('voice_sample_good', "Share 3 examples of writing that sounds like you — emails, blog posts, social content, or proposals.", "Pick three different formats if possible. Client emails you're proud of. Social posts that landed. Proposals that felt right. Things where you read them back and thought 'yeah, that's me.'", "Voice Sample Good", 'should-ask'),
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
      createQ('price_market', "What do your competitors actually charge?", "If you know, share it. If you don't, that's also useful information. What's the market rate for what you do?", "Market Rate", 'should-ask'),
      createQ('price_working', "What's actually working in your business right now?", "What's bringing in good clients? What effort is actually paying off? What's generating revenue or fulfillment?", "What Works", 'should-ask'),
      createQ('price_not_working', "What's not working?", "What effort isn't paying off? What do you spend time on that doesn't seem to matter? What would you cut if you could?", "What Doesn't", 'should-ask'),
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
      createQ('energy_look_forward', "What types of work do you look forward to?", "When you see it on the calendar, you feel good. You show up energized. You're in your element. What do these projects have in common?", "Look Forward To", 'must-ask'),
      createQ('energy_dread', "What types of work do you dread?", "When you see it on the calendar, your stomach drops. You procrastinate. You consider canceling. Be specific — what patterns show up?", "Dread", 'must-ask'),
      createQ('energy_flow', "What type of work puts you in flow state? What could you do for 6 hours without noticing?", "The work where time disappears. Where you forget to check your phone. Where you're completely absorbed.", "Flow State", 'should-ask'),
      createQ('energy_life_giving', "Describe your life-giving clients. What makes them different?", "What makes them energize you? Why do you love working with them? What do they have in common — behaviors, not demographics?", "Life-Giving Clients", 'must-ask'),
      createQ('energy_soul_sucking', "Describe your soul-sucking clients. What patterns do they share?", "What kind of client drains you? What do they have in common? What would you change about working with them — or should you stop working with them entirely?", "Soul-Sucking Clients", 'must-ask'),
      createQ('energy_breaking_point', "What would make this work unsustainable for you?", "What can't continue? What's the breaking point? What would make you walk away entirely?", "Breaking Point", 'optional'),
      createQ('energy_worth_it', "What outcome would make you feel like this work was truly worth it?", "Not money — though money counts. What needs to be true for you to feel good about doing this?", "Worth It", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-7',
    name: 'Proof & Evidence',
    subtitle: 'Mine for case studies, metrics, and client language that proves everything above',
    questions: [
      createQ('proof_stories', "Tell me about 2-3 of your best client stories — or even just one if you're early in your work.", "For each one: What was the client's actual problem? What did they try before you? What did you do that was different? What was the measurable result? What did they say afterward? If you have documented case studies, great. If not, just tell the story. Don't be modest.", "Best Stories", 'must-ask'),
      createQ('proof_metrics', "What metrics or numbers prove your work delivers results?", "Years in business. Number of clients. Revenue growth. Repeat client rate. Specific outcomes you can quantify. Even rough numbers are better than none.", "Metrics", 'should-ask'),
      createQ('proof_client_language', "What specific phrases appear repeatedly when clients describe your work?", "There's usually a gap between how you describe your work and how clients describe it. The client version is almost always better for marketing. What words or phrases show up across multiple testimonials, reviews, or feedback? What do they say that you don't say about yourself?", "Client vs Self Language", 'should-ask'),
      createQ('proof_proudest', "What work makes you most proud professionally?", "Not biggest revenue. The work that made you think 'this is why I do this.'", "Proudest Work", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-8',
    name: 'Meta Questions',
    subtitle: 'Zoom out and find the real why',
    questions: [
      createQ('meta_frustration', "What frustrates you about how other people in your field do this work?", "Where there's frustration, there's usually differentiation. What standards do you hold that others don't? What approaches do you reject? What do you see that makes you think 'I would never do it that way'?", "Industry Frustration", 'must-ask'),
      createQ('meta_superpower', "What have clients or colleagues told you that you do differently than others in your field?", "Not what you think makes you special — what have others actually pointed out? 'I've never had someone do X before.' 'Most people don't do Y.' 'I didn't expect Z.' What surprises people about how you work?", "Hidden Superpower", 'must-ask'),
      createQ('meta_why', "Why does this work matter to you — not to your clients, to you?", "What would happen if you stopped doing this? What are you actually building? What's the deeper reason you keep going?", "Core Why", 'must-ask'),
      createQ('meta_no_constraints', "What would you do if you knew you couldn't fail?", "Remove every constraint — money, time, skill, reputation. What would you build?", "No Constraints", 'optional'),
      createQ('meta_misconception', "What misconception about your work do you wish you could correct for everyone?", "What do people assume about what you do that's just wrong? What would you tell everyone if you could?", "Misconception", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-9',
    name: 'Documentation Readiness',
    subtitle: 'Assess what you already have and what needs to be built',
    questions: [
      createQ('doc_current_state', "Where do you currently store information you need to reference repeatedly — pricing, processes, templates, client details?", "In your head? Scattered across Google Docs? In emails you have to search for? In a CRM? On your website? In notebooks? Be specific about where different types of information live and how hard it is to find when you need it.", "Current State", 'should-ask'),
      createQ('doc_repeated', "What do you explain in every single sales conversation?", "The things you repeat to every potential client. The same explanation, the same objections handled, the same questions answered. These are the things that should be written once and deployed everywhere.", "Repeated Explanations", 'should-ask'),
      createQ('doc_faqs', "What questions do clients ask you most often?", "The real ones. Not the ones you wish they'd ask. The actual questions that come up in almost every conversation.", "Client FAQs", 'should-ask'),
      createQ('doc_objections', "What objections do you hear most often from potential clients, and how do you handle each one?", "What pushback do they give before deciding to hire you? Price too high? Timeline too long? Don't understand the value? For each objection, what's your response that actually addresses their concern?", "Objections", 'should-ask'),

      // Digital Presence — Structured URL collection for ingestion pipeline
      createQ('doc_website_url', "What's your website URL?", "Your main website. We'll scrape this to extract your About page, services, testimonials, and any other content that shows who you are and what you do.", "Website", 'must-ask'),
      createQ('doc_linkedin_url', "What's your LinkedIn profile URL?", "Your personal LinkedIn profile. We'll extract your headline, about section, experience, and recommendations.", "LinkedIn", 'should-ask'),
      createQ('doc_instagram_url', "What's your Instagram handle or profile URL?", "If you use Instagram for your business. We'll analyze captions, content themes, and engagement patterns.", "Instagram", 'optional'),
      createQ('doc_facebook_url', "What's your Facebook page or profile URL?", "Your business page or professional profile. We'll extract your about section and any public posts.", "Facebook", 'optional'),
      createQ('doc_youtube_url', "What's your YouTube channel URL?", "If you have video content. We'll analyze video titles, descriptions, and transcripts.", "YouTube", 'optional'),
      createQ('doc_tiktok_url', "What's your TikTok handle or profile URL?", "If you use TikTok for your business. We'll analyze your content themes and captions.", "TikTok", 'optional'),
      createQ('doc_google_business', "What's your Google Business Profile URL?", "Your Google Business listing. We'll extract your business description and reviews.", "Google Business", 'optional'),
      createQ('doc_reviews_urls', "List any review sites where you have profiles or listings (Yelp, Google Reviews, industry-specific sites).", "One URL per line. We'll extract reviews and ratings to understand how clients describe your work.", "Review Sites", 'optional'),
      createQ('doc_press_urls', "List any press coverage, interviews, podcasts, or articles written about you.", "One URL per line. We'll extract quotes, descriptions, and how others position your work.", "Press & Interviews", 'optional'),
      createQ('doc_other_urls', "Any other relevant online presence? Portfolio sites, directories, Substack, Medium, etc.", "One URL per line. Anything else that shows who you are professionally.", "Other Links", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-10',
    name: 'Custom Questions & Influences',
    subtitle: 'Your questions + the content that shapes your thinking',
    questions: [
      // Custom Questions (editable)
      createQ('custom_1', "Custom Question 1", "Edit this question to ask something specific to your business or situation. Then answer it.", "Custom Questions", 'should-ask', 'long_text', undefined, true),
      createQ('custom_2', "Custom Question 2", "Edit this question to dig into something unique to your work.", "Custom Questions", 'should-ask', 'long_text', undefined, true),
      createQ('custom_3', "Custom Question 3", "Edit this question to explore an area that matters to you.", "Custom Questions", 'should-ask', 'long_text', undefined, true),
      createQ('custom_4', "Custom Question 4", "Edit this question to capture something the other sections missed.", "Custom Questions", 'optional', 'long_text', undefined, true),
      createQ('custom_5', "Custom Question 5", "Edit this question for any final thoughts or areas you want to document.", "Custom Questions", 'optional', 'long_text', undefined, true),

      // Media & Influences — Structured collection for content ingestion
      createQ('media_books', "List books that have shaped how you think about your work.", "Title and author for each. Example: 'The Lean Startup by Eric Ries'. We'll extract frameworks, language patterns, and philosophies you resonate with.", "Books", 'must-ask'),
      createQ('media_podcast_episodes', "List specific podcast episodes you reference or recommend often.", "Paste the URL for each episode (Spotify, Apple Podcasts, YouTube, etc.). We'll extract transcripts and analyze what resonates.", "Podcast Episodes", 'should-ask'),
      createQ('media_youtube_videos', "List YouTube videos that influenced your approach to your work.", "Paste the URL for each video. We'll extract transcripts and identify frameworks or language you've adopted.", "YouTube Videos", 'should-ask'),
      createQ('media_articles_blogs', "List blog posts or articles you reference frequently.", "Paste URLs. These should be articles that shaped how you think about your industry, process, or philosophy.", "Articles & Blogs", 'should-ask'),
      createQ('media_thought_leaders', "List thought leaders, authors, or creators you follow closely.", "Names or social handles. People whose work consistently influences how you think and communicate.", "Thought Leaders", 'should-ask'),
    ],
    responses: []
  }
];
