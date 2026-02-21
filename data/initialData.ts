import { Session, Question, FieldType, QuestionTier, InputType } from '../types';

const createQ = (
  id: string,
  text: string,
  helperText: string,
  section: string,
  tier: QuestionTier,
  fieldType: FieldType = 'long_text',
  inputType: InputType = 'textarea',
  options?: string[],
): Question => ({
  id,
  text,
  helperText,
  section,
  tier,
  fieldType,
  inputType,
  options,
});

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'step-1',
    name: 'Who You Are',
    subtitle: 'Identity, transformation, and client feedback',
    questions: [
      createQ('who_background', "How long have you been doing this work? What was the path that brought you to doing what you do?", "Don't give me the LinkedIn version. Was this intentional or did you fall into it?", "Background", 'must-ask'),
      createQ('who_no_title', "If you couldn't use your job title, how would you describe what you actually do for people?", "No labels. No industry terms. Just the truth of what you actually do.", "Identity", 'must-ask'),
      createQ('who_transformation', "When someone works with you, what changes for them? What becomes possible that wasn't before?", "Think outcomes, not deliverables.", "Transformation", 'must-ask'),
      createQ('who_client_language', "What specific compliments from your best clients make you feel the most proud of your work? Share the actual testimonials or feedback if you can.", "Not what you wish they'd say — what they actually said. Copy and paste the exact words.", "Client Language", 'must-ask'),
      createQ('who_not_for', "Who is your work NOT for? What kind of client would you turn away?", "Sometimes the best positioning is knowing who you don't serve.", "Boundaries", 'should-ask'),
      createQ('who_casual', "How do you describe what you do to a stranger at a barbecue?", "The casual version. Not the elevator pitch — the real thing.", "Casual Description", 'should-ask'),
      createQ('who_credentials', "What credentials, certifications, or formal training do you have?", "List what's relevant. If none, that's fine too.", "Credentials", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-2',
    name: 'What You Do',
    subtitle: 'Services, process, and scope',
    questions: [
      createQ('what_deliverable', "When someone hires you, what do they actually get? What's the thing you deliver?", "Be specific about the tangible outcome.", "Deliverable", 'must-ask'),
      createQ('what_process', "Walk me through your process from the moment someone hires you to the moment the work is done.", "Step by step. What happens first, second, third?", "Process", 'must-ask'),
      createQ('what_scope', "What's included in your core offering? What's NOT included?", "Clear boundaries prevent scope creep.", "Scope", 'must-ask'),
      createQ('what_timeline', "How long does it typically take from start to finish?", "Typical timeline for your standard engagement.", "Timeline", 'should-ask'),
      createQ('what_involvement', "What do you need from the client for the work to go well?", "Time commitment, materials, access, decisions?", "Client Involvement", 'should-ask'),
      createQ('what_packages', "Do you offer different tiers or packages? If so, what distinguishes them?", "If you have different service levels.", "Packages", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-3',
    name: 'Market Position',
    subtitle: 'Alternatives, differentiation, and competitive landscape',
    questions: [
      createQ('mkt_alternatives', "If someone can't work with you, what are their other options? Who else does what you do?", "Name specific competitors or alternatives.", "Alternatives", 'must-ask'),
      createQ('mkt_strengths', "In your opinion, what do those alternatives do well?", "Be honest. What have they figured out?", "Competitor Strengths", 'should-ask'),
      createQ('mkt_weaknesses', "In your opinion, what do those alternatives do poorly or miss entirely?", "Where do they fall short in your view?", "Competitor Weaknesses", 'should-ask'),
      createQ('mkt_different', "What do you do differently than those alternatives?", "Your specific approach or method.", "Differentiation", 'must-ask'),
      createQ('mkt_better', "Why does that difference matter? What does it make possible?", "Connect the difference to client outcomes.", "Impact", 'must-ask'),
      createQ('mkt_category', "How do you describe your category when people ask what industry you're in?", "Your industry or category label.", "Category", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-4',
    name: 'Pricing & Value',
    subtitle: 'How you charge and why it\'s worth it',
    questions: [
      createQ('price_structure', "How do you charge? (Hourly, project, retainer, etc.)", "Your pricing model.", "Pricing Model", 'must-ask'),
      createQ('price_range', "What's the typical range for a project or engagement?", "Ballpark numbers help set expectations.", "Price Range", 'must-ask'),
      createQ('price_factors', "What factors change the price? (Scope, timeline, complexity, etc.)", "What makes something cost more or less?", "Price Factors", 'should-ask'),
      createQ('price_minimum', "What's the smallest project you'll take on? Is there a minimum?", "Your floor for engagement.", "Minimum", 'should-ask'),
      createQ('price_roi', "How do clients typically measure ROI or success when working with you?", "What outcomes prove the investment was worth it?", "ROI", 'must-ask'),
      createQ('price_payment', "What are your payment terms? (50% upfront, net 30, etc.)", "How and when do clients pay?", "Payment Terms", 'optional'),
      createQ('price_travel', "Do you charge for travel, expenses, or other add-ons?", "Additional costs beyond base price.", "Travel & Expenses", 'optional'),
      createQ('price_discounts', "Do you offer discounts for nonprofits, bulk projects, or referrals?", "Any special pricing structures.", "Discounts", 'optional'),
      createQ('price_increase', "When was the last time you raised your rates? Why?", "Pricing evolution tells a story.", "Rate History", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-5',
    name: 'Voice & Communication',
    subtitle: 'How you sound, what language you use',
    questions: [
      createQ('voice_sample_good', "Share 3 examples of writing that sounds like you — emails, blog posts, social content, or proposals.", "Pick three different formats if possible. Things where you thought 'yeah, that's me.'", "Voice Samples (Good)", 'must-ask'),
      createQ('voice_sample_bad', "Share an example of writing that doesn't sound like you at all.", "Something that's technically accurate but doesn't sound like a human you recognize.", "Voice Sample (Bad)", 'should-ask'),
      createQ('voice_words_use', "What words or phrases do you use all the time in your work?", "Metaphors, concepts, expressions that come out repeatedly.", "Language You Use", 'must-ask'),
      createQ('voice_words_avoid', "What words or phrases do you hate? What language feels wrong for your work?", "Banned language or industry jargon you refuse to use.", "Language You Avoid", 'must-ask'),
      createQ('voice_tone', "How would you describe your tone when you're communicating with clients?", "Fast or slow? Careful or bold? Funny or serious?", "Tone", 'should-ask'),
      createQ('voice_metaphors', "Are there metaphors or analogies you use to explain your work?", "Recurring ways you make concepts tangible.", "Metaphors", 'optional'),
      createQ('voice_humor', "Do you use humor in your client communication? If so, what kind?", "Self-deprecating? Observational? Dry?", "Humor", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-6',
    name: 'Proof & Stories',
    subtitle: 'Case studies, metrics, and what clients actually say',
    questions: [
      createQ('proof_stories', "Tell me about 2-3 of your best client stories — or even just one if you're early in your work.", "What was the problem? What did you do? What was the result? What did they say afterward?", "Client Stories", 'must-ask'),
      createQ('proof_metrics', "What measurable results have you helped clients achieve?", "Numbers, percentages, time saved, revenue increased.", "Metrics", 'should-ask'),
      createQ('proof_testimonials', "What's the best testimonial you've ever received?", "The one that made you feel seen.", "Testimonials", 'should-ask'),
      createQ('proof_industries', "What industries or client types have you worked with most?", "Your track record across different sectors.", "Industries", 'should-ask'),
      createQ('proof_portfolio', "Do you have a portfolio, case studies, or work samples you share with prospects?", "Existing proof documentation.", "Portfolio", 'optional'),
      createQ('proof_press', "Have you been featured in any publications, podcasts, or media?", "External validation and visibility.", "Press", 'optional'),
      createQ('proof_awards', "Have you won any awards or recognition in your field?", "Industry recognition matters.", "Awards", 'optional'),
      createQ('proof_client_types', "What's the profile of your ideal client? (Size, industry, stage, etc.)", "Who you do your best work for.", "Ideal Client", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-7',
    name: 'Client Experience',
    subtitle: 'From discovery to delivery and beyond',
    questions: [
      createQ('client_discovery', "What happens in your first conversation with a potential client?", "Your discovery or consultation process.", "Discovery", 'must-ask'),
      createQ('client_qualify', "How do you know if someone is a good fit to work with you?", "Your qualification criteria.", "Qualification", 'must-ask'),
      createQ('client_redflags', "What are the red flags that tell you someone is NOT a good fit?", "Warning signs you've learned to recognize.", "Red Flags", 'should-ask'),
      createQ('client_onboarding', "Once someone hires you, what's the onboarding process like?", "How do you kick things off?", "Onboarding", 'should-ask'),
      createQ('client_communication', "How often do you communicate with clients during a project?", "Check-ins, updates, touchpoints.", "Communication", 'optional'),
      createQ('client_tools', "What tools or platforms do you use to manage client work?", "Project management, communication tools.", "Tools", 'optional'),
      createQ('client_offboarding', "What happens when a project wraps up? How do you hand things off?", "Your project completion process.", "Offboarding", 'optional'),
      createQ('client_retention', "Do clients typically come back for more work? What brings them back?", "Repeat business patterns.", "Retention", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-8',
    name: 'Meta Questions',
    subtitle: 'Zoom out — what makes you different?',
    questions: [
      createQ('meta_superpower', "What have clients or colleagues told you that you do differently than others in your field?", "Not what you think — what have others actually pointed out?", "Superpower", 'must-ask'),
      createQ('meta_misunderstood', "What do people most often misunderstand about your work?", "Common misconceptions you have to correct.", "Misconceptions", 'should-ask'),
      createQ('meta_energy', "What part of your work gives you the most energy? What drains you?", "The sustainability question.", "Energy", 'should-ask'),
      createQ('meta_learn', "What have you learned about your work in the last year that changed how you do it?", "Evolution of your approach.", "Recent Learning", 'optional'),
      createQ('meta_future', "If this goes perfectly, where does your work go in the next 2-3 years?", "Your vision for the business.", "Future Vision", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-9',
    name: 'Documentation & Digital Presence',
    subtitle: 'What exists now + your online presence',
    questions: [
      createQ('doc_current_state', "Where do you currently store information you need to reference repeatedly — pricing, processes, templates, client details?", "In your head? Google Docs? CRM? Be specific about where different types of information live.", "Current State", 'must-ask'),
      createQ('doc_templates', "What templates, scripts, or documents do you reuse across clients?", "Proposals, contracts, onboarding docs, etc.", "Templates", 'should-ask'),
      createQ('doc_faqs', "What questions do you answer over and over again?", "The things you repeat to every prospect or client.", "FAQs", 'should-ask'),
      createQ('doc_objections', "What objections do you hear most often from potential clients, and how do you handle each one?", "Common pushback and your responses.", "Objections", 'must-ask'),
      createQ('doc_website_url', "What's your website URL?", "Your main website.", "Website", 'must-ask', 'short_text', 'url'),
      createQ('doc_linkedin_url', "What's your LinkedIn profile URL?", "Your personal LinkedIn profile.", "LinkedIn", 'should-ask', 'short_text', 'url'),
      createQ('doc_instagram_url', "What's your Instagram handle or profile URL?", "If you use Instagram for business.", "Instagram", 'optional', 'short_text', 'url'),
      createQ('doc_facebook_url', "What's your Facebook page or profile URL?", "Business page or professional profile.", "Facebook", 'optional', 'short_text', 'url'),
      createQ('doc_youtube_url', "What's your YouTube channel URL?", "If you have video content.", "YouTube", 'optional', 'short_text', 'url'),
      createQ('doc_tiktok_url', "What's your TikTok handle or profile URL?", "If you use TikTok for business.", "TikTok", 'optional', 'short_text', 'url'),
      createQ('doc_google_business', "What's your Google Business Profile URL?", "Your Google Business listing.", "Google Business", 'optional', 'short_text', 'url'),
      createQ('doc_reviews_urls', "List any review sites where you have profiles (Yelp, Google Reviews, industry-specific platforms).", "One URL per line.", "Review Sites", 'optional', 'long_text', 'url_multi'),
      createQ('doc_press_urls', "List any press coverage, interviews, podcasts, or articles featuring you or your work.", "One URL per line.", "Press Coverage", 'optional', 'long_text', 'url_multi'),
      createQ('doc_other_urls', "Any other relevant online presence? Portfolio sites, directories, Substack, Medium, etc.", "One URL per line.", "Other Presence", 'optional', 'long_text', 'url_multi'),
      createQ('media_books', "List books that have shaped how you think about your work.", "Title and author.", "Books", 'optional'),
      createQ('media_podcast_episodes', "List specific podcast episodes you reference frequently or that influenced your approach.", "Paste URLs if you have them.", "Podcasts", 'optional'),
      createQ('media_youtube_videos', "List YouTube videos that influenced your approach or that you share with clients.", "Paste URLs if you have them.", "Videos", 'optional'),
      createQ('media_articles_blogs', "List blog posts or articles you reference frequently in your work.", "Paste URLs.", "Articles", 'optional'),
      createQ('media_thought_leaders', "List thought leaders, authors, or creators you follow closely and whose work influences yours.", "Names or handles.", "Thought Leaders", 'optional'),
    ],
    responses: []
  },
  {
    id: 'step-10',
    name: 'Operations & Logistics',
    subtitle: 'Capacity, team, location, availability',
    questions: [
      createQ('ops_capacity', "How many clients can you serve at once?", "Your realistic capacity.", "Capacity", 'should-ask'),
      createQ('ops_waitlist', "Do you have a waitlist? How far out are you typically booked?", "Current demand and scheduling.", "Waitlist", 'optional'),
      createQ('ops_team', "Do you work solo or do you have a team? Who does what?", "Your operational structure.", "Team", 'optional'),
      createQ('ops_partners', "Do you partner with or refer work to other professionals?", "Your network and referral relationships.", "Partners", 'optional'),
      createQ('ops_location', "Where are you based? Do you work remotely, locally, or both?", "Geographic scope of your work.", "Location", 'optional'),
      createQ('ops_availability', "What's your typical availability for new projects?", "Lead time for new engagements.", "Availability", 'optional'),
    ],
    responses: []
  }
];

// The "router" question — shown standalone before entering the section flow
export const ROUTER_QUESTION: Question = createQ(
  'who_intention',
  "Imagine this process did its job perfectly. How does your life look different or better in the next three to six months?",
  "Not what you think the 'right' answer is — what would actually change if this works? Be specific about the friction you want gone.",
  "Router",
  'must-ask'
);

// ─── PERSONAL EXTRACTION ───────────────────────────────────────────────

export const PERSONAL_ROUTER_QUESTION: Question = createQ(
  'personal_intention',
  "Imagine this process did its job perfectly. How does your life look different or better in the next three to six months?",
  "Not the aspirational Instagram version. What specific friction would be gone? What would your Tuesday morning actually look like?",
  "Router",
  'must-ask'
);

export const PERSONAL_SESSIONS: Session[] = [
  {
    id: 'p-step-1',
    name: 'Getting Started',
    subtitle: 'Intentions, scope, and safety',
    questions: [
      createQ('personal_why_now', "Why are you drawn to doing this right now, in this season of your life?", "What happened recently — or keeps happening — that made you say \"okay, I need to look at my life more intentionally\"?", "Router", 'must-ask'),
      createQ('personal_scope', "Are there 1-2 areas of life you especially want this process to focus on first?", "For example: work, relationships, health, money, creativity, home, or \"I honestly want it all mapped.\" This helps us weight what matters most to you right now.", "Router", 'should-ask'),
      createQ('personal_boundaries', "Are there any topics you don't want to go into right now?", "Things that feel too raw, too private, or just \"not yet.\" You're allowed to keep some doors closed.", "Safety", 'should-ask'),
      createQ('personal_share_limits', "Is there anything you're okay writing here but do NOT want quoted or reflected back in your personal document?", "For example: sensitive stories, third-party details, or anything that's \"for context only.\" Name it and we'll respect it.", "Safety", 'should-ask'),
    ],
    responses: []
  },
  {
    id: 'p-step-2',
    name: 'Who You Are',
    subtitle: 'Core identity, values, and energy',
    questions: [
      createQ('id_description', "If you couldn't use your job title, your relationship roles, or your accomplishments — how would you describe who you are?", "Strip away the résumé. What's left when you remove everything you do for other people?", "Core Identity", 'must-ask'),
      createQ('id_origin', "What's the short version of how you became who you are? The real version, not the polished one.", "What shaped you? Was it deliberate or did life just happen?", "Origin", 'must-ask'),
      createQ('id_turning_points', "What have been 3-5 major turning points in your life so far?", "Times when everything changed — for better or worse. What happened, and what did it change in you?", "Turning Points", 'should-ask'),
      createQ('id_values_lived', "What do you actually prioritize with your time and money — not what you wish you prioritized?", "Look at your last month's calendar and bank statement. What story do they tell?", "Values (Lived)", 'must-ask'),
      createQ('id_values_aspirational', "What do you wish you prioritized more? What's the gap between who you are and who you want to be?", "Be specific. \"Be healthier\" doesn't count. What would healthy actually look like for you?", "Values (Aspirational)", 'must-ask'),
      createQ('id_nonnegotiables', "What are the things in your life you will not compromise on, no matter what?", "The lines you've drawn. The things that if they changed, you wouldn't recognize your life.", "Non-Negotiables", 'should-ask'),
      createQ('id_energy', "What gives you energy? What drains you? Be brutally specific.", "Not hobbies vs. chores. Think about the specific moments in a week where you feel alive vs. depleted.", "Energy Map", 'should-ask'),
      createQ('id_contradictions', "What's something about you that seems contradictory? Something that surprises people?", "The thing that doesn't fit the narrative. That's usually where the truth is.", "Contradictions", 'optional'),
    ],
    responses: []
  },
  {
    id: 'p-step-3',
    name: 'What You Want',
    subtitle: 'Vision, goals, and what\'s been in the way',
    questions: [
      createQ('want_vision', "If you could design the next chapter of your life with no constraints, what would it look like?", "Where are you? What are you doing on a typical day? Who's around you? How do you feel?", "Big Picture", 'must-ask'),
      createQ('want_goals', "What are the 3-5 specific things you want to change, build, or achieve in the next year?", "Not bucket-list dreams. Things you'd actually commit to if someone held you accountable.", "Specific Goals", 'must-ask'),
      createQ('want_blockers', "What has stopped you from making these changes already? Be honest.", "Is it time? Money? Fear? Clarity? Other people? All of the above?", "Blockers", 'must-ask'),
      createQ('want_past_attempts', "What have you already tried? What worked partially? What failed completely?", "Don't skip the failures. They're the most useful data.", "Past Attempts", 'should-ask'),
      createQ('want_success_criteria', "How will you know you've made progress? What does \"better\" actually look like in measurable terms?", "If you can't measure it, you can't track it. Get specific.", "Success Criteria", 'should-ask'),
      createQ('want_hidden', "Is there something you want but feel embarrassed or conflicted about wanting?", "This is a judgment-free zone. Naming it doesn't mean you have to chase it — it just helps the document tell the truth.", "Hidden Wants", 'optional'),
    ],
    responses: []
  },
  {
    id: 'p-step-4',
    name: 'Daily Life & Systems',
    subtitle: 'Routines, rhythms, and how your days actually work',
    questions: [
      createQ('daily_morning', "Walk me through your typical morning from the moment you wake up to the moment you start \"working\" or doing your main thing.", "Every detail. When do you check your phone? How long do you stay in bed? What do you eat?", "Morning", 'must-ask'),
      createQ('daily_evening', "Walk me through your typical evening from when you stop working to when you fall asleep.", "Same level of detail. When do you eat? Screen time? How do you wind down?", "Evening", 'must-ask'),
      createQ('daily_weekly', "Is there a rhythm to your week? Certain days for certain things? Or is every day improvised?", "What's structured vs. chaotic? Which days feel good and which feel wasted?", "Weekly Rhythm", 'should-ask'),
      createQ('daily_tools', "What tools, apps, or systems do you currently use to manage your life? (Calendar, to-do lists, budgets, etc.)", "What's working? What's a mess? What do you keep trying and abandoning?", "Tools & Systems", 'should-ask'),
      createQ('daily_decisions', "What decisions do you waste the most mental energy on repeatedly?", "Meals? What to wear? How to spend free time? Work priorities? These add up.", "Decision Fatigue", 'should-ask'),
      createQ('daily_motivation', "What actually motivates you in real life — not what \"should\" motivate you?", "Deadlines? Collaboration? Competition? Play? Public commitment? Quiet systems? Give real examples of times you followed through and what drove it.", "Motivation Style", 'should-ask'),
      createQ('daily_constraints', "What hard constraints do you have that are non-negotiable right now?", "Work hours, caregiving, health limits, commute, custody schedules, financial obligations. The stuff your life has to work around, not through force of will.", "Constraints", 'should-ask'),
      createQ('daily_environments', "Describe the physical spaces where you spend most of your time. Are they helping or hurting you?", "Your home, workspace, car. Do they feel organized or chaotic? Energizing or draining?", "Environments", 'optional'),
      createQ('daily_time_audit', "Where does your time actually go in a typical week? Estimate hours: work, commute, screens, sleep, exercise, relationships, solo time, chores.", "Don't guess optimistically. Track a real week if you can.", "Time Audit", 'optional'),
    ],
    responses: []
  },
  {
    id: 'p-step-5',
    name: 'Relationships & Community',
    subtitle: 'Your people, your gaps, and your boundaries',
    questions: [
      createQ('rel_inner_circle', "Who are the 3-5 people you talk to most? What role does each one play in your life?", "Not who you should talk to — who you actually do. Are those the right people?", "Inner Circle", 'must-ask'),
      createQ('rel_missing', "What's missing in your relationships or social life right now?", "Depth? Fun? Accountability? Someone who gets it? A community?", "Missing", 'must-ask'),
      createQ('rel_difficult', "Is there a relationship that's draining you or creating ongoing friction? What would resolving it look like?", "You don't have to name names. But be specific about the dynamic.", "Difficult", 'should-ask'),
      createQ('rel_communication', "How do you typically communicate with the people closest to you? What works? What doesn't?", "Are you the texter? The caller? The one who avoids hard conversations?", "Communication", 'should-ask'),
      createQ('rel_support', "When things get hard, who do you go to? Do you actually go to anyone?", "If the answer is \"no one,\" that's important information.", "Support", 'should-ask'),
      createQ('rel_community', "Are you part of any communities, groups, or regular gatherings that matter to you?", "Church, gym crew, book club, online group, mastermind — anything where you show up regularly.", "Community", 'optional'),
      createQ('rel_boundaries', "Where do you struggle to set boundaries with people? What happens when you do?", "The places where you say yes when you mean no.", "Boundaries", 'optional'),
    ],
    responses: []
  },
  {
    id: 'p-step-6',
    name: 'Health & Body',
    subtitle: 'Physical state, habits, and what\'s real',
    questions: [
      createQ('health_current', "Honest assessment: how do you feel physically on most days? Energy, sleep, pain, vitality?", "1-10 doesn't cut it. Describe what a normal day feels like in your body.", "Current State", 'must-ask'),
      createQ('health_exercise', "What's your current relationship with exercise? What have you done in the past that worked?", "Not what you should do. What you actually do — and what you've actually stuck with before.", "Exercise", 'must-ask'),
      createQ('health_food', "How do you eat? Not the ideal — the reality. What's your relationship with food like?", "Meal prep king? Fast food survivor? Stress eater? No judgment, just truth.", "Food", 'should-ask'),
      createQ('health_sleep', "How do you sleep? What time do you go to bed, wake up, and how do you feel when you do?", "Quality matters more than hours. What's disrupting your sleep if anything?", "Sleep", 'should-ask'),
      createQ('health_mental', "How are you doing mentally and emotionally? Any patterns you've noticed — anxiety, depression, burnout cycles?", "This isn't therapy. But if there are patterns affecting your life, they belong in the document.", "Mental Health", 'should-ask'),
      createQ('health_substances', "Do you use alcohol, caffeine, nicotine, or anything else regularly? What role does it play?", "Not a morality question. Just understanding what's in the system and why.", "Substances", 'optional'),
      createQ('health_medical', "Anything medical or physical you're managing that affects your daily life or plans?", "Chronic conditions, medications, injuries — things that affect what's realistic.", "Medical", 'optional'),
    ],
    responses: []
  },
  {
    id: 'p-step-7',
    name: 'Money & Resources',
    subtitle: 'Financial reality, relationship with money, and goals',
    questions: [
      createQ('money_current', "Give me the honest snapshot: income, savings, debt, monthly burn rate. Ballpark is fine.", "You don't need exact numbers. But \"fine\" vs. \"struggling\" vs. \"comfortable\" isn't specific enough.", "Current State", 'must-ask'),
      createQ('money_relationship', "What's your relationship with money? Does it stress you out, motivate you, bore you?", "How you feel about money often matters more than how much you have.", "Relationship", 'must-ask'),
      createQ('money_goals', "What are your financial goals in the next 1-3 years? What would \"enough\" look like?", "A number? A feeling? A lifestyle? Define what winning looks like financially.", "Goals", 'should-ask'),
      createQ('money_spending', "Where does your money go that you wish it didn't? Where do you not spend enough?", "The subscriptions you forgot about. The things you keep saying you'll invest in but don't.", "Spending Patterns", 'should-ask'),
      createQ('money_income', "Are you happy with your income? If not, what would it take to change it? What's realistic?", "Career move? Side hustle? Asking for a raise? Changing fields entirely?", "Income Potential", 'optional'),
      createQ('money_systems', "How do you currently manage money? Budget? Apps? Spreadsheet? Vibes?", "What system do you use, and is it actually working?", "Financial Systems", 'optional'),
    ],
    responses: []
  },
  {
    id: 'p-step-8',
    name: 'Voice & Communication',
    subtitle: 'How you sound, how you want to be spoken to',
    questions: [
      createQ('voice_natural', "How do you naturally talk? Are you formal, casual, sarcastic, warm, blunt, careful?", "Think about how you text your best friend vs. how you email your boss. Where on that spectrum is the real you?", "How You Sound", 'must-ask'),
      createQ('voice_samples', "Share 2-3 examples of how you actually write — texts, emails, social posts, journal entries. Things that sound like you.", "Pick things where you thought \"yeah, that's my voice.\" Not your professional voice unless that IS your voice.", "Writing Samples", 'must-ask'),
      createQ('voice_words_use_personal', "What words, phrases, or expressions do you use all the time?", "The stuff people would recognize as uniquely you. Catchphrases, recurring metaphors, verbal tics.", "Words You Use", 'should-ask'),
      createQ('voice_words_avoid_personal', "What language feels fake or wrong when it comes out of your mouth?", "Corporate speak? Self-help jargon? Certain phrases that make you cringe?", "Words You Hate", 'should-ask'),
      createQ('voice_coaching_style', "When you're trying to change something in your life, how do you like to be spoken to?", "Gentle or direct? More encouragement or more challenge? Short bullet points or longer reflection? What lands for you and what makes you shut down?", "Coaching Style", 'must-ask'),
      createQ('voice_humor_personal', "Do you use humor? What kind? When does it show up and when does it disappear?", "Dry? Dark? Self-deprecating? Dad jokes? Or mostly serious?", "Humor", 'optional'),
      createQ('voice_conflict', "How do you handle disagreements or uncomfortable conversations?", "Avoid? Confront? Joke through it? Shut down? Write a letter? Depends on the person?", "Conflict Style", 'optional'),
    ],
    responses: []
  },
  {
    id: 'p-step-9',
    name: 'Beliefs & Frameworks',
    subtitle: 'Worldview, inner critic, and what you\'ve learned',
    questions: [
      createQ('belief_worldview', "What do you believe about how the world works? What principles guide your decisions?", "Not the inspirational poster. The actual operating system running in your head.", "Worldview", 'must-ask'),
      createQ('belief_inner_critic', "If your inner critic had a voice, what would it say to you most often? In exact words.", "The specific phrases and tone it uses. Where do you think this voice came from originally?", "Inner Critic", 'must-ask'),
      createQ('belief_changed', "What's something you used to believe strongly that you've changed your mind about?", "The pivot tells more about you than the current position.", "Changed Minds", 'should-ask'),
      createQ('belief_lessons', "What's the hardest lesson you've learned in life so far? How did you learn it?", "The one that actually changed your behavior, not just your thinking.", "Hard Lessons", 'should-ask'),
      createQ('belief_fear', "What are you most afraid of? Not spiders — the real stuff. Failure? Being seen? Being alone? Wasting time?", "The fear that actually drives behavior when you're being honest with yourself.", "Fear", 'should-ask'),
      createQ('belief_spiritual', "Do you have a spiritual practice, faith tradition, or philosophical framework that matters to you?", "This can be organized religion, meditation, stoicism, \"I don't know but I'm curious\" — whatever's true.", "Spirituality", 'optional'),
      createQ('belief_purpose', "Do you have a sense of purpose or meaning? If so, how would you articulate it? If not, is that something you're looking for?", "Big question. Imperfect answers welcome.", "Purpose", 'optional'),
    ],
    responses: []
  },
  {
    id: 'p-step-10',
    name: 'Skills & Interests',
    subtitle: 'What you\'re good at, curious about, and not using',
    questions: [
      createQ('skills_natural', "What are you naturally good at — things that come easy to you that others seem to struggle with?", "Not your job skills unless those overlap. What do people come to you for help with?", "Natural Talents", 'must-ask'),
      createQ('skills_learned', "What skills have you deliberately developed? What took effort to get good at?", "The things you worked for vs. the things that came free.", "Learned Skills", 'should-ask'),
      createQ('skills_curiosities', "What are you currently curious about? What would you learn if you had unlimited time?", "Active interests, not \"I should\" interests.", "Curiosities", 'should-ask'),
      createQ('skills_creative', "Do you have any creative outlets? Things you make, build, write, play, or design?", "Active or dormant. Something you do now or something you used to do and miss.", "Creative Outlets", 'optional'),
      createQ('skills_consumption', "What do you consume? Books, podcasts, YouTube, music, games? What patterns do you notice?", "What you're drawn to reveals what you're thinking about.", "Consumption", 'optional'),
      createQ('skills_unused', "Is there a skill or talent you have that you're not using right now? Something that's going to waste?", "The thing that's sitting on the shelf.", "Unused", 'optional'),
    ],
    responses: []
  },
  {
    id: 'p-step-11',
    name: 'Documentation & Digital Life',
    subtitle: 'Where your information lives and what you need',
    questions: [
      createQ('doc_current_personal', "Where do you currently keep important information? Passwords, contacts, goals, ideas, health records?", "In your head? Notes app? Scattered across 14 platforms? Be honest about the mess.", "Current State", 'must-ask'),
      createQ('doc_digital', "What's your online presence? Social media, profiles, websites — what would someone find if they googled you?", "Is it accurate? Outdated? Embarrassing? Does it represent who you are now?", "Digital Footprint", 'should-ask'),
      createQ('doc_recurring', "What problems come up over and over in your life that better documentation or systems could solve?", "Forgetting appointments? Losing track of goals? Not having the right info when you need it?", "Recurring Problems", 'should-ask'),
      createQ('doc_ai_usage', "How do you currently use AI or technology to help manage your life? What's working and what isn't?", "ChatGPT, Claude, Siri, smart home, budgeting apps — whatever tools you're already using.", "AI Usage", 'should-ask'),
      createQ('doc_ideal', "If you had a perfect personal knowledge system — something that knew everything about you and could help you make decisions — what would you use it for first?", "The killer use case. The thing that would make you say \"this was worth it.\"", "Ideal System", 'must-ask'),
      createQ('doc_preferred_format', "How would you most like your personal gospel document to be written?", "Straightforward and practical? Poetic and reflective? Numbered principles? Letter to your future self? Describe what would feel like YOU.", "Preferred Format", 'must-ask'),
    ],
    responses: []
  },
];
