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
