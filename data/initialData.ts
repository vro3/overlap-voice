import { Session, Question, FieldType } from '../types';

const createQ = (
  id: string,
  text: string,
  helperText: string,
  section: string,
  fieldType: FieldType = 'long_text',
  options?: string[]
): Question => ({
  id,
  text,
  helperText,
  section,
  fieldType,
  options
});

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'step-1',
    name: 'Intake',
    subtitle: 'Background, clients, work, market, business reality, vision',
    questions: [
      // Your Background
      createQ('bg_years', "How long have you been doing this work?", "Years of experience. How did you get started?", "Your Background", 'short_text'),
      createQ('bg_good_at', "What are you actually good at?", "What do people compliment you on? What comes naturally to you? What took years to master?", "Your Background"),
      createQ('bg_worst_part', "What's the worst part of your current work?", "What makes you want to quit? What feels like a waste of your time?", "Your Background"),

      // Your Clients
      createQ('cl_who', "Who do you currently work with?", "Describe your actual clients (not who you want). Industry; company size; role; budget level?", "Your Clients"),
      createQ('cl_best_say', "What do your best clients say about working with you?", "What's the actual feedback you get? Not what you wish they'd say—what they actually say. Any quotes or specific comments?", "Your Clients"),
      createQ('cl_why_you', "Why do clients hire you instead of alternatives?", "What makes them choose you? What do they say they couldn't find elsewhere?", "Your Clients"),
      createQ('cl_problem', "What problem do you actually solve?", "Describe it in plain language. What's the outcome for them? Is it about results; experience; time saved; confidence; something else?", "Your Clients"),

      // Your Work
      createQ('wk_perfect', "Describe a perfect project from your perspective.", "What made it perfect? What was the outcome? Why was this different from average work?", "Your Work"),
      createQ('wk_waste', "Describe a project that felt like a waste of time.", "What went wrong? What would have made it better?", "Your Work"),
      createQ('wk_excited', "What types of projects make you excited?", "What work do you look forward to? What could you do every day without getting tired of it?", "Your Work"),
      createQ('wk_drain', "What types of projects drain you?", "What do you dread? What makes you want to delegate or avoid?", "Your Work"),

      // How You Talk About It
      createQ('talk_friend', "How would you describe what you do to a friend?", "Casual; authentic language (not polished). What actually comes out of your mouth?", "How You Talk About It"),
      createQ('talk_client', "How would you describe what you do to a potential client?", "What's the pitch version? Does it sound different from the friend version?", "How You Talk About It"),
      createQ('talk_jargon', "What jargon or industry language do you hate?", "What terms make you cringe? What words feel fake when you say them?", "How You Talk About It"),
      createQ('talk_natural', "What language DO you use naturally?", "Metaphors you use. Words that come up repeatedly. Phrases that feel authentic to you.", "How You Talk About It"),

      // Your Market
      createQ('mkt_competitors', "Who else does what you do?", "Who are your actual competitors? How many are there? How differentiated is the market?", "Your Market"),
      createQ('mkt_different', "What do you do that competitors don't?", "What's actually different? What's a real advantage; not just marketing?", "Your Market"),
      createQ('mkt_misunderstand', "What do people misunderstand about your work?", "What misconception comes up repeatedly? How would you correct it?", "Your Market"),

      // Business Reality
      createQ('biz_current_rate', "What are you currently charging?", "Rate; project price; retainer? How did you arrive at that number? Do you feel good about it?", "Business Reality"),
      createQ('biz_ideal_rate', "What would you like to be charging?", "What price would make the work feel worth it? What price would make you excited?", "Business Reality"),
      createQ('biz_working', "What's working right now?", "What's bringing in good clients? What's making money?", "Business Reality"),
      createQ('biz_not_working', "What's not working?", "What effort isn't paying off? What do you spend time on that doesn't matter?", "Business Reality"),

      // Your Vision
      createQ('vis_preference', "If you had to choose would you rather work with fewer better-fit clients OR more clients for better income?", "What's your preference and why?", "Your Vision"),
      createQ('vis_unsustainable', "What would make this work unsustainable for you?", "What can't continue? What's the limit?", "Your Vision"),
      createQ('vis_worth_it', "What would make this work feel worth it?", "What outcome would feel like success? What needs to change?", "Your Vision"),
      createQ('vis_why', "Why are you doing this work in the first place?", "What matters about it? Why does this exist? What would happen if you stopped?", "Your Vision"),
    ],
    responses: []
  },
  {
    id: 'step-2',
    name: 'Core Belief',
    subtitle: 'The six questions, pattern recognition, draft statements',
    questions: [
      // The Six Questions
      createQ('cb_best_say', "What do your BEST clients actually say about working with you?", "Not what you wish they'd say—what they ACTUALLY say. Quote them if you can. What words do they use?", "The Six Questions"),
      createQ('cb_perfect_project', "Think of a project that went PERFECTLY. What made it perfect?", "Walk through what happened. What was different about this one? How did it end?", "The Six Questions"),
      createQ('cb_unique_skill', "What do you do that you think everyone does but they actually DON'T?", "Things so natural to you that you don't realize they're special. What do people thank you for that surprises you?", "The Six Questions"),
      createQ('cb_real_outcome', "What do people actually HIRE you for—not the service but the OUTCOME?", "The emotional need. The real problem solved. What changes for them after working with you?", "The Six Questions"),
      createQ('cb_no_title', "Describe what you do WITHOUT using your job title.", "If you couldn't say your title; how would you explain the value you create? What transformation happens?", "The Six Questions"),
      createQ('cb_pisses_off', "What pisses you off about how OTHERS in your field do this work?", "What do competitors get wrong? What makes you cringe? What would you never do?", "The Six Questions"),

      // Pattern Recognition
      createQ('cb_repeated', "What repeated phrases did you notice in your answers above?", "What words kept coming up? What themes emerged? What surprised you?", "Pattern Recognition"),
      createQ('cb_emotional', "Where did you get emotional or animated?", "Which question made you talk faster? Where did you feel something? What got you fired up?", "Pattern Recognition"),
      createQ('cb_specific', "What was the most specific thing you said?", "Not generic—the thing that was uniquely YOU. The detail that couldn't be anyone else.", "Pattern Recognition"),

      // Draft Statement
      createQ('cb_draft1', "Core Belief Draft 1", "Try this formula: I [action] [so that outcome] [for whom]. Or just say what's true about your work.", "Draft Statement"),
      createQ('cb_draft2', "Core Belief Draft 2", "Try a different angle. Shorter? Bolder? More specific?", "Draft Statement"),
      createQ('cb_draft3', "Core Belief Draft 3", "Which version feels most like you when you say it out loud?", "Draft Statement"),

      // Final Statement
      createQ('cb_final', "MY CORE BELIEF STATEMENT", "Your final polished statement. The one you'd actually use.", "Final Statement"),
    ],
    responses: []
  },
  {
    id: 'step-3',
    name: 'Life-Giving Work',
    subtitle: 'What energizes vs. drains you, action items',
    questions: [
      // Define Work Types
      createQ('lg_lifegiving_1', "Life-Giving Work #1", "What type of work energizes you? Makes you lose track of time? You'd do even if no one paid you?", "Define Work Types", 'short_text'),
      createQ('lg_lifegiving_2', "Life-Giving Work #2", "Another type of work that lights you up.", "Define Work Types", 'short_text'),
      createQ('lg_lifegiving_3', "Life-Giving Work #3", "One more if you have it.", "Define Work Types", 'short_text'),
      createQ('lg_soulsucking_1', "Soul-Sucking Work #1", "What type of work drains you? You dread it? Feels like a waste of your talent?", "Define Work Types", 'short_text'),
      createQ('lg_soulsucking_2', "Soul-Sucking Work #2", "Another type that makes you want to quit.", "Define Work Types", 'short_text'),
      createQ('lg_soulsucking_3', "Soul-Sucking Work #3", "One more if you have it.", "Define Work Types", 'short_text'),

      // The Hard Choice
      createQ('lg_one_type', "If you could only do ONE type of project for the next year what would it be?", "No hedging. Pick one. What would you build your business around if you had to choose?", "The Hard Choice"),

      // Action Items
      createQ('lg_eliminate', "What will you ELIMINATE?", "What work will you stop offering? Stop accepting? Say no to?", "Action Items"),
      createQ('lg_emphasize', "What will you EMPHASIZE?", "What work will you seek more of? Market more? Build around?", "Action Items"),
      createQ('lg_adjust', "What will you ADJUST?", "What work will you keep but change? Charge more for? Do differently?", "Action Items"),
    ],
    responses: []
  },
  {
    id: 'step-4',
    name: 'Voice + Language',
    subtitle: 'Natural voice, brand personality, language guidelines',
    questions: [
      // Finding Natural Voice
      createQ('vl_friend', "How do you talk about your work to a FRIEND?", "Casual; unpolished. What actually comes out when you're relaxed? Record yourself if needed.", "Finding Natural Voice"),
      createQ('vl_client', "How do you talk about it to a POTENTIAL CLIENT?", "The pitch version. More formal? Different words? What shifts?", "Finding Natural Voice"),
      createQ('vl_lost', "What's LOST between those two versions?", "What's authentic in the friend version that disappears in the pitch? What do you hide?", "Finding Natural Voice"),

      // Brand as Person
      createQ('vl_dress', "If your brand was a person how would they dress?", "Formal? Casual? Edgy? Classic? What's the vibe?", "Brand as Person"),
      createQ('vl_talk', "If your brand was a person how would they talk?", "Fast or slow? Bold or careful? Funny or serious? Warm or cool?", "Brand as Person"),
      createQ('vl_values', "If your brand was a person what are their values?", "What do they care about? What would they fight for? What would they never do?", "Brand as Person"),

      // Voice Descriptors
      createQ('vl_descriptors', "Choose 2-3 voice descriptors that fit you", "Select the ones that feel most like you when you're at your best.", "Voice Descriptors", 'multi_choice', ["Conversational", "Direct", "Warm", "Professional", "Casual", "Bold", "Thoughtful", "Funny", "Serious", "Detailed", "Accessible", "Sophisticated", "Practical", "Visionary"]),

      // Language Guidelines
      createQ('vl_words_use', "Words and phrases I USE", "What words feel like you? What phrases do you say all the time? What's your vocabulary?", "Language Guidelines"),
      createQ('vl_words_avoid', "Words and phrases I DON'T USE", "What makes you cringe? What feels fake? What do competitors say that you hate?", "Language Guidelines"),
    ],
    responses: []
  },
  {
    id: 'step-5',
    name: 'Competitor Landscape',
    subtitle: 'Competition type, market positioning, differentiation',
    questions: [
      // Competition Type
      createQ('comp_type', "What is your primary competition type?", "Who are you really competing against?", "Competition Type", 'single_choice', ["Direct - Same service similar positioning", "Indirect - Solving same problem differently (DIY templates AI)", "Substitutes - Client solves problem entirely differently", "None Obvious - Genuinely new category"]),
      createQ('comp_strategy', "My strategy based on this competition type", "Given who you're competing against; how will you win? What's your angle?", "Competition Type"),

      // Market Positioning
      createQ('comp_axis1', "Market Map: Axis 1 (Horizontal)", "Pick two extremes that define your market. Example: Low Price vs High Price; Fast vs Thorough; DIY vs Done-For-You", "Market Positioning", 'short_text'),
      createQ('comp_axis2', "Market Map: Axis 2 (Vertical)", "Pick another dimension. Example: Hands-off vs High-touch; Creative vs Technical; Niche vs Generalist", "Market Positioning", 'short_text'),
      createQ('comp_position', "Where am I positioned on this map?", "Describe your quadrant. What does your position mean for clients?", "Market Positioning"),
      createQ('comp_gap', "Where's the GAP?", "What uncrowded space do clients want that competitors aren't filling?", "Market Positioning"),

      // Why Clients Choose Me
      createQ('comp_pattern', "What pattern do you see in why clients choose you?", "Think about your last 5 clients. Why did they pick YOU over alternatives?", "Why Clients Choose Me"),

      // Market Assessment
      createQ('comp_saturation', "Market Saturation", "How crowded is your space?", "Market Assessment", 'single_choice', ["Crowded", "Differentiated", "Emerging", "Monopoly"]),
      createQ('comp_maturity', "Market Maturity", "How established is the market?", "Market Assessment", 'single_choice', ["Immature", "Developing", "Mature"]),
      createQ('comp_stage', "Market Stage", "Where is the market in its lifecycle?", "Market Assessment", 'single_choice', ["Emerging", "Growing", "Maturing", "Consolidating"]),

      // Differentiation
      createQ('comp_advantage1', "Real Advantage #1", "Not marketing fluff—what's genuinely different about how you work; what you believe; or who you attract?", "Differentiation"),
      createQ('comp_advantage2', "Real Advantage #2", "Another real differentiator.", "Differentiation"),
      createQ('comp_advantage3', "Real Advantage #3", "One more if you have it.", "Differentiation"),

      // Differentiation Statement
      createQ('comp_diff_statement', "Complete: \"I'm the only _____ who _____.\"", "Fill in the blanks with something only YOU can say. If a competitor could say it; it's not differentiation.", "Differentiation Statement"),
    ],
    responses: []
  },
  {
    id: 'step-6',
    name: 'Service Structure',
    subtitle: 'Tier definitions, transitions, capacity, scope management',
    questions: [
      // Current Mix
      createQ('svc_tier1_pct', "What percentage of your last 5-10 projects were Tier 1 (Turnkey)?", "Quick; standardized; minimal customization work.", "Current Mix", 'short_text'),
      createQ('svc_tier2_pct', "What percentage were Tier 2 (Hybrid)?", "Some customization; collaborative; your framework adapted to them.", "Current Mix", 'short_text'),
      createQ('svc_tier3_pct', "What percentage were Tier 3 (Bespoke)?", "Fully custom; high-touch; built from scratch together.", "Current Mix", 'short_text'),
      createQ('svc_energizes', "Which tier ENERGIZES you most?", "Which type of work makes you excited to start?", "Current Mix", 'single_choice', ["Tier 1 (Turnkey)", "Tier 2 (Hybrid)", "Tier 3 (Bespoke)"]),
      createQ('svc_profitable', "Which tier is most PROFITABLE?", "Where do you make the most money for your time?", "Current Mix", 'single_choice', ["Tier 1 (Turnkey)", "Tier 2 (Hybrid)", "Tier 3 (Bespoke)"]),
      createQ('svc_fulfilling', "Which tier is most FULFILLING?", "Which work would you do even if it paid less?", "Current Mix", 'single_choice', ["Tier 1 (Turnkey)", "Tier 2 (Hybrid)", "Tier 3 (Bespoke)"]),
      createQ('svc_mismatch', "Where's the mismatch?", "The tier you do most vs. the tier you want most. What needs to shift?", "Current Mix"),

      // Tier 1 Definition
      createQ('svc_t1_name', "Tier 1 Name", "What do you call your entry-level or standardized offering?", "Tier 1 Definition", 'short_text'),
      createQ('svc_t1_who', "Tier 1: Who it's for", "What type of client is this perfect for? What's their situation?", "Tier 1 Definition"),
      createQ('svc_t1_get', "Tier 1: What they get", "What exactly is included? What do they walk away with?", "Tier 1 Definition"),
      createQ('svc_t1_promise', "Tier 1: The promise", "What transformation or outcome can you guarantee?", "Tier 1 Definition"),
      createQ('svc_t1_not', "Tier 1: What it's NOT", "What's explicitly excluded? What should they NOT expect?", "Tier 1 Definition"),
      createQ('svc_t1_price', "Tier 1: Price", "What do you charge? Range is fine.", "Tier 1 Definition", 'short_text'),
      createQ('svc_t1_timeline', "Tier 1: Timeline", "How long does it take from start to finish?", "Tier 1 Definition", 'short_text'),

      // Tier 2 Definition
      createQ('svc_t2_name', "Tier 2 Name", "What do you call your mid-tier or hybrid offering?", "Tier 2 Definition", 'short_text'),
      createQ('svc_t2_who', "Tier 2: Who it's for", "What type of client needs this level? What's different about their situation?", "Tier 2 Definition"),
      createQ('svc_t2_get', "Tier 2: What they get", "What's included that Tier 1 doesn't have?", "Tier 2 Definition"),
      createQ('svc_t2_promise', "Tier 2: The promise", "What outcome can they expect at this level?", "Tier 2 Definition"),
      createQ('svc_t2_not', "Tier 2: What it's NOT", "What's still excluded? Where's the line before Tier 3?", "Tier 2 Definition"),
      createQ('svc_t2_price', "Tier 2: Price", "What do you charge?", "Tier 2 Definition", 'short_text'),
      createQ('svc_t2_timeline', "Tier 2: Timeline", "How long does it take?", "Tier 2 Definition", 'short_text'),

      // Tier 3 Definition
      createQ('svc_t3_name', "Tier 3 Name", "What do you call your premium or fully custom offering?", "Tier 3 Definition", 'short_text'),
      createQ('svc_t3_who', "Tier 3: Who it's for", "Who needs this level? What makes them different from Tier 2 clients?", "Tier 3 Definition"),
      createQ('svc_t3_get', "Tier 3: What they get", "What's the full experience? What makes this premium?", "Tier 3 Definition"),
      createQ('svc_t3_promise', "Tier 3: The promise", "What transformation is possible at this level that isn't at lower tiers?", "Tier 3 Definition"),
      createQ('svc_t3_not', "Tier 3: What it's NOT", "Even at this level; what's still outside scope?", "Tier 3 Definition"),
      createQ('svc_t3_price', "Tier 3: Price/Approach", "Price; range; or how you structure it (retainer; project; etc.)", "Tier 3 Definition", 'short_text'),

      // Tier Transitions
      createQ('svc_upgrade', "How do clients move between tiers?", "Do they start small and upgrade? Come in at the top? What's the natural path?", "Tier Transitions"),
      createQ('svc_want_upgrade', "Do you WANT clients to upgrade?", "Is upselling part of your model or do you prefer clients stay in their tier?", "Tier Transitions", 'single_choice', ["Yes always", "Sometimes", "Rarely"]),

      // Ideal Client Fit
      createQ('svc_ideal_tier', "My ideal client typically fits into", "Where do your best clients land?", "Ideal Client Fit", 'single_choice', ["Tier 1", "Tier 2", "Tier 3"]),
      createQ('svc_ideal_why', "Why does your ideal client fit that tier?", "What makes that tier the sweet spot for you and for them?", "Ideal Client Fit"),

      // The Real Test
      createQ('svc_test_t1', "Tier 1 is for people who...", "Complete in one sentence. If you can't explain it simply; it's not clear enough.", "The Real Test"),
      createQ('svc_test_t2', "Tier 2 is for people who...", "Complete in one sentence.", "The Real Test"),
      createQ('svc_test_t3', "Tier 3 is for people who...", "Complete in one sentence.", "The Real Test"),

      // Capacity
      createQ('svc_capacity', "How many projects can you realistically handle per month?", "Be honest. What's sustainable without burning out?", "Capacity", 'short_text'),
      createQ('svc_constraint', "What constrains your capacity?", "What's the bottleneck that limits how much you can do?", "Capacity", 'single_choice', ["Time", "Energy", "Expertise", "Market demand"]),

      // Scope Management
      createQ('svc_scope_change', "What happens when a client requests something outside scope mid-project?", "Do you charge more? Extend timeline? Say no? How do you handle it without damaging the relationship?", "Scope Management"),
    ],
    responses: []
  },
  {
    id: 'step-7',
    name: 'Pricing',
    subtitle: 'Fear-free questions, positioning, money conversation',
    questions: [
      // Fear-Free Questions
      createQ('pr_no_fear_t1', "What would you charge for Tier 1 if you WEREN'T AFRAID?", "Forget what's reasonable. What would feel right?", "Fear-Free Questions", 'short_text'),
      createQ('pr_no_fear_t2', "What would you charge for Tier 2 if you WEREN'T AFRAID?", "If you knew they'd say yes; what would you ask for?", "Fear-Free Questions", 'short_text'),
      createQ('pr_no_fear_t3', "What would you charge for Tier 3 if you WEREN'T AFRAID?", "What's the number you're scared to say out loud?", "Fear-Free Questions", 'short_text'),
      createQ('pr_excited', "What price would make you EXCITED to do the work?", "Not resentful. Not just okay. Actually excited to start.", "Fear-Free Questions", 'short_text'),
      createQ('pr_raise_25', "What would happen if you raised prices 25%?", "Would you lose clients? Which ones? Would that be bad?", "Fear-Free Questions"),

      // Pricing Position
      createQ('pr_position', "I'm positioning as...", "Where do you want to sit in the market?", "Pricing Position", 'single_choice', ["Premium - You pay for excellence", "Value - Great results at a fair price", "Exclusive - You pay for exclusivity and access", "Standard - Reasonable rate for solid work"]),

      // Money Conversation
      createQ('pr_present', "How will you present pricing confidently?", "What will you say? How will you frame the investment? Practice it here.", "Money Conversation"),
      createQ('pr_expensive', "Your response if they say \"it's expensive\"", "What do you actually say? How do you handle this without apologizing or discounting?", "Money Conversation"),

      // Final Pricing
      createQ('pr_final_t1', "Final Tier 1 Price", "Your real number.", "Final Pricing", 'short_text'),
      createQ('pr_final_t2', "Final Tier 2 Price", "Your real number.", "Final Pricing", 'short_text'),
      createQ('pr_final_t3', "Final Tier 3 Price", "Your real number.", "Final Pricing", 'short_text'),
    ],
    responses: []
  },
  {
    id: 'step-8',
    name: 'Review + Refinement',
    subtitle: 'Validation checklist, coherence check, confidence check',
    questions: [
      // Review Questions
      createQ('rv_belief_true', "Does your CORE BELIEF still ring true?", "Read it aloud. Does it feel like you? Would you say it to a client?", "Review Questions", 'single_choice', ["Yes", "Needs refinement"]),
      createQ('rv_voice', "Does your VOICE come through?", "Look at all your language. Does it sound like YOU or like a template?", "Review Questions", 'single_choice', ["Yes", "Needs refinement"]),
      createQ('rv_tiers', "Do your SERVICE TIERS feel right?", "Are they clear and distinct? Can you explain the difference easily?", "Review Questions", 'single_choice', ["Yes", "Needs refinement"]),
      createQ('rv_client', "Is your IDEAL CLIENT clear?", "Specific enough that you could spot them at a conference?", "Review Questions", 'single_choice', ["Yes", "Needs refinement"]),
      createQ('rv_diff', "Does your DIFFERENTIATION actually differentiate?", "Could a competitor say the same thing? If yes; it needs work.", "Review Questions", 'single_choice', ["Yes", "Needs refinement"]),
      createQ('rv_prices', "Do your PRICES feel right?", "Would you be excited to do the work at these prices?", "Review Questions", 'single_choice', ["Yes", "Needs refinement"]),

      // Coherence Check
      createQ('rv_misaligned', "Is there anything that feels MISALIGNED?", "What doesn't fit? What feels off? What are you avoiding?", "Coherence Check"),

      // Confidence Check
      createQ('rv_describe', "Can you describe what you do without hesitation?", "No stumbling; no apologizing; no overexplaining.", "Confidence Check", 'single_choice', ["Yes", "No"]),
      createQ('rv_explain_who', "Can you explain who you're for specifically?", "Not everyone. Not anyone who needs X. Specifically.", "Confidence Check", 'single_choice', ["Yes", "No"]),
      createQ('rv_articulate', "Can you articulate why you're different?", "In a way that's true and that clients actually care about?", "Confidence Check", 'single_choice', ["Yes", "No"]),
      createQ('rv_defend', "Can you defend your pricing?", "Without apologizing; discounting; or over-justifying?", "Confidence Check", 'single_choice', ["Yes", "No"]),
    ],
    responses: []
  },
  {
    id: 'step-9',
    name: 'Documentation System',
    subtitle: 'Core statements, ideal client profile, answer capsules, proof',
    questions: [
      // Core Section
      createQ('doc_belief', "Core Belief Statement", "Copy your final statement from Step 2. This becomes your anchor.", "Core Section"),
      createQ('doc_diff', "Differentiation Statement", "Your \"I'm the only _____ who _____\" from Step 5.", "Core Section"),
      createQ('doc_icp_industry', "Ideal Client: Industry/Type", "What industry or category? Be specific.", "Core Section", 'short_text'),
      createQ('doc_icp_size', "Ideal Client: Size/Revenue", "Company size; revenue range; team size?", "Core Section", 'short_text'),
      createQ('doc_icp_decision', "Ideal Client: Decision Maker", "Who hires you? Title; role; authority level?", "Core Section", 'short_text'),
      createQ('doc_icp_budget', "Ideal Client: Budget Range", "What do they typically spend on services like yours?", "Core Section", 'short_text'),
      createQ('doc_icp_values', "Ideal Client: Values", "What do they care about? What matters to them beyond price?", "Core Section"),
      createQ('doc_icp_problems', "Ideal Client: Problems", "What pain are they in when they find you? What's not working?", "Core Section"),
      createQ('doc_icp_success', "Ideal Client: Success Looks Like", "What does winning look like for them after working with you?", "Core Section"),

      // Services Section
      createQ('doc_capsule_t1', "Turnkey Answer Capsule", "40-60 words: [Service] is a [type] for [who]. Duration: [X]. Includes: [what]. Result: [outcome]. Investment: [price].", "Services Section"),
      createQ('doc_capsule_t2', "Hybrid Answer Capsule", "Same format. 40-60 words. Specific facts AI can extract.", "Services Section"),
      createQ('doc_capsule_t3', "Bespoke Answer Capsule", "Same format. 40-60 words. Make it quotable.", "Services Section"),

      // Voice Section
      createQ('doc_tone', "Tone Descriptors", "2-3 words that describe how you sound. From Step 4.", "Voice Section", 'short_text'),
      createQ('doc_words_use', "Words I USE", "Your vocabulary. The words that feel like you.", "Voice Section"),
      createQ('doc_words_avoid', "Words I DON'T USE", "The words you refuse to say. The cringe words.", "Voice Section"),

      // Proof Section
      createQ('doc_case_name', "Case Study #1 Client Name", "Real client or anonymized. Something you can reference.", "Proof Section", 'short_text'),
      createQ('doc_case_need', "Case Study #1 Client's Need", "What did they come to you for? What was the situation?", "Proof Section"),
      createQ('doc_case_challenge', "Case Study #1 Challenge", "What made this hard? What was in the way?", "Proof Section"),
      createQ('doc_case_solution', "Case Study #1 Solution", "What did you actually do? Be specific.", "Proof Section"),
      createQ('doc_case_result', "Case Study #1 Result", "What happened? Numbers if possible. Outcomes.", "Proof Section"),
      createQ('doc_case_proves', "Case Study #1 What It Proves", "Why does this case study matter? What does it demonstrate about you?", "Proof Section"),
      createQ('doc_quote1', "Client Quote #1", "Actual words from a client. Include name and role if possible.", "Proof Section"),
      createQ('doc_quote2', "Client Quote #2", "Another testimonial. Different angle or client type.", "Proof Section"),

      // Reference Section
      createQ('doc_faq1_q', "FAQ #1 Question", "What do prospects always ask?", "Reference Section"),
      createQ('doc_faq1_a', "FAQ #1 Answer", "Your clear; confident response.", "Reference Section"),
      createQ('doc_faq2_q', "FAQ #2 Question", "Another common question.", "Reference Section"),
      createQ('doc_faq2_a', "FAQ #2 Answer", "Your response.", "Reference Section"),
      createQ('doc_objection', "Response to \"It costs too much\"", "What do you actually say? Not defensive. Confident.", "Reference Section"),
    ],
    responses: []
  },
  {
    id: 'step-10',
    name: 'Structured Content',
    subtitle: 'AI-ready answer capsules, testing',
    questions: [
      // Answer Capsules
      createQ('ac_offering1_name', "Offering #1 Name", "Your first service/product.", "Answer Capsules", 'short_text'),
      createQ('ac_offering1', "Offering #1 Answer Capsule", "40-60 words with facts: who it's for; what's included; how long; price range; outcome. AI should be able to quote this.", "Answer Capsules"),
      createQ('ac_offering2_name', "Offering #2 Name", "Your second service/product.", "Answer Capsules", 'short_text'),
      createQ('ac_offering2', "Offering #2 Answer Capsule", "Same format. Specific. Factual. Quotable.", "Answer Capsules"),
      createQ('ac_offering3_name', "Offering #3 Name", "Your third service/product.", "Answer Capsules", 'short_text'),
      createQ('ac_offering3', "Offering #3 Answer Capsule", "Same format.", "Answer Capsules"),

      // Testing
      createQ('ac_test_ai', "Test 1: Did AI extract facts correctly when you pasted capsule into ChatGPT?", "If it made things up; your capsule isn't specific enough.", "Testing", 'single_choice', ["Yes extracted correctly", "No needs more specificity"]),
      createQ('ac_test_human', "Test 2: Did your ideal client understand exactly what they'd get?", "Read it to someone. Did they get it immediately?", "Testing", 'single_choice', ["Yes they understood", "No needs clarification"]),
      createQ('ac_test_unique', "Test 3: Could a competitor use this exact same capsule?", "If yes; add more specifics that are uniquely yours.", "Testing", 'single_choice', ["No it's specific to me", "Yes too generic"]),
    ],
    responses: []
  },
  {
    id: 'step-11',
    name: '90-Day Action Plan',
    subtitle: 'Starting point, constraints, priorities, content/outreach plan',
    questions: [
      // Pre-Plan Decisions
      createQ('plan_starting', "My Starting Point", "Where are you right now in your business?", "Pre-Plan Decisions", 'single_choice', ["New business", "Steady clients", "Growth-stage", "Struggling", "Pivoting"]),
      createQ('plan_constraint', "My Lead Constraint", "What's the main thing limiting your growth?", "Pre-Plan Decisions", 'single_choice', ["Time", "Money", "Expertise", "Seasonal"]),
      createQ('plan_channel', "Current Lead Channel", "Where do most of your clients come from now?", "Pre-Plan Decisions", 'single_choice', ["Website/SEO", "Referrals", "Social", "Cold outreach", "LinkedIn", "Events"]),
      createQ('plan_priority', "My Priority", "What's the ONE thing that would make the biggest difference in the next 90 days?", "Pre-Plan Decisions", 'single_choice', ["Lead quality", "Conversion", "Faster sales", "Pricing", "Referrals", "Positioning"]),

      // Current Situation
      createQ('plan_revenue', "Monthly Revenue", "Approximate. Helps calibrate the plan.", "Current Situation", 'short_text'),
      createQ('plan_pipeline', "Client Pipeline", "How many prospects are you talking to? What's in motion?", "Current Situation"),
      createQ('plan_working', "What's Working", "What should you do MORE of? What's already getting results?", "Current Situation"),
      createQ('plan_challenge', "Biggest Challenge", "What's the main obstacle right now? Be honest.", "Current Situation"),
      createQ('plan_preventing', "What's Preventing Growth", "What would unlock the next level? What's in the way?", "Current Situation"),

      // Days 61-90 Content
      createQ('plan_content_type', "Week 9 Content Type", "What format fits you best?", "Days 61-90 Content", 'single_choice', ["Guide", "Video", "Webinar", "Podcast", "Template"]),
      createQ('plan_content_topic', "Week 9 Content Topic", "What would you create that demonstrates your expertise and attracts ideal clients?", "Days 61-90 Content"),

      // Days 61-90 Outreach
      createQ('plan_outreach_channel', "Choose ONE outreach channel", "Focus beats spread. Pick one and commit for 90 days.", "Days 61-90 Outreach", 'single_choice', ["Content Calendar (1-2x/week)", "Direct Outreach (3-5 people/week)", "Speaking/Partnerships (1/month)"]),
      createQ('plan_outreach_target', "Target platform or audience for outreach", "Where specifically? Who specifically? Be concrete.", "Days 61-90 Outreach", 'short_text'),
    ],
    responses: []
  },
];
