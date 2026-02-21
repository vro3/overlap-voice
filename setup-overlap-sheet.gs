/**
 * Overlap Voice — Google Sheet Setup Script
 * v1.1.0 — 2026-02-21
 *
 * HOW TO USE:
 *   1. Create a new blank Google Sheet
 *   2. Go to Extensions > Apps Script
 *   3. Delete whatever's in there, paste this entire file
 *   4. Click Run (play button) on setupOverlapSheet
 *   5. Authorize when prompted
 *   6. Copy the Sheet ID from the alert (or from the URL bar)
 *   7. Add it to Vercel as GOOGLE_SHEETS_ID
 *
 * Creates 4 tabs with all 82 Overlap Voice questions:
 *   - Dashboard: live user stats
 *   - Users: the app reads/writes here (one row per user)
 *   - Answers Expanded: human-readable view (one row per answer)
 *   - Questions Reference: all 82 questions with IDs, tiers, sections
 */

function clearBandings_(sheet) {
  var bandings = sheet.getBandings();
  for (var i = 0; i < bandings.length; i++) {
    bandings[i].remove();
  }
}

function setupOverlapSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('Overlap Voice — User Answers');

  // Clean up default sheet later (need at least one sheet to exist)
  var defaultSheet = ss.getSheetByName('Sheet1');

  // ═══════════════════════════════════════════════
  // TAB 1: Users (the app reads/writes this tab)
  // ═══════════════════════════════════════════════
  var users = ss.getSheetByName('Users');
  if (!users) {
    users = ss.insertSheet('Users', 0);
  }

  var userHeaders = ['email', 'routerAnswer', 'currentStep', 'currentScreen', 'answers', 'lastSaved'];
  users.getRange(1, 1, 1, userHeaders.length).setValues([userHeaders]);

  // Header formatting
  users.getRange(1, 1, 1, userHeaders.length)
    .setFontWeight('bold')
    .setBackground('#1a1a2e')
    .setFontColor('#ffffff')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setBorder(true, true, true, true, false, false, '#333333', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // Column widths
  users.setColumnWidth(1, 250);  // email
  users.setColumnWidth(2, 400);  // routerAnswer
  users.setColumnWidth(3, 120);  // currentStep
  users.setColumnWidth(4, 130);  // currentScreen
  users.setColumnWidth(5, 500);  // answers (JSON)
  users.setColumnWidth(6, 200);  // lastSaved

  // Freeze header row
  users.setFrozenRows(1);

  // Wrap text for routerAnswer, clip answers (JSON is long)
  users.getRange('B:B').setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  users.getRange('E:E').setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

  // Alternating row colors
  clearBandings_(users);
  users.getRange('A2:F1000').applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);

  // Green highlight on rows updated in last hour (active users)
  var recentRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND(F2<>"", NOW()-DATEVALUE(MID(F2,1,10))-TIMEVALUE(MID(F2,12,8)) < 1/24)')
    .setBackground('#e8f5e9')
    .setRanges([users.getRange('A2:F1000')])
    .build();
  users.setConditionalFormatRules([recentRule]);

  // Dropdown validation on currentScreen (won't block the app, just helps manual viewing)
  var screenValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['vision', 'landing', 'magic-link', 'router', 'questions', 'review', 'output', 'search'], true)
    .setAllowInvalid(true)
    .build();
  users.getRange('D2:D1000').setDataValidation(screenValidation);

  // Dropdown validation on currentStep
  var stepValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7', 'step-8', 'step-9', 'step-10'], true)
    .setAllowInvalid(true)
    .build();
  users.getRange('C2:C1000').setDataValidation(stepValidation);

  // ═══════════════════════════════════════════════
  // TAB 2: Answers Expanded
  // ═══════════════════════════════════════════════
  var expanded = ss.getSheetByName('Answers Expanded');
  if (!expanded) {
    expanded = ss.insertSheet('Answers Expanded', 1);
  }

  var expandedHeaders = ['email', 'step', 'section', 'questionId', 'questionText', 'answer', 'lastSaved'];
  expanded.getRange(1, 1, 1, expandedHeaders.length).setValues([expandedHeaders]);

  expanded.getRange(1, 1, 1, expandedHeaders.length)
    .setFontWeight('bold')
    .setBackground('#0d47a1')
    .setFontColor('#ffffff')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setBorder(true, true, true, true, false, false, '#333333', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  expanded.setColumnWidth(1, 250);
  expanded.setColumnWidth(2, 100);
  expanded.setColumnWidth(3, 150);
  expanded.setColumnWidth(4, 200);
  expanded.setColumnWidth(5, 400);
  expanded.setColumnWidth(6, 500);
  expanded.setColumnWidth(7, 200);

  expanded.setFrozenRows(1);
  expanded.getRange('E:E').setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  expanded.getRange('F:F').setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  clearBandings_(expanded);
  expanded.getRange('A2:G1000').applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
  expanded.getRange('A1').setNote('Populated by expandAnswers(). Use the Overlap Voice menu or run from Apps Script.');

  // ═══════════════════════════════════════════════
  // TAB 3: Questions Reference (all 82 questions)
  // ═══════════════════════════════════════════════
  var ref = ss.getSheetByName('Questions Reference');
  if (!ref) {
    ref = ss.insertSheet('Questions Reference', 2);
  }

  var refHeaders = ['step', 'stepName', 'section', 'questionId', 'questionText', 'helperText', 'tier', 'fieldType'];
  var refData = [refHeaders];

  // Router question
  refData.push(['router', 'Router', 'Router', 'who_intention', 'Imagine this process did its job perfectly. How does your life look different or better in the next three to six months?', "Not what you think the 'right' answer is — what would actually change if this works? Be specific about the friction you want gone.", 'must-ask', 'long_text']);

  // Step 1: Who You Are (7 questions)
  refData.push(['step-1', 'Who You Are', 'Background', 'who_background', 'How long have you been doing this work? What was the path that brought you to doing what you do?', "Don't give me the LinkedIn version. Was this intentional or did you fall into it?", 'must-ask', 'long_text']);
  refData.push(['step-1', 'Who You Are', 'Identity', 'who_no_title', "If you couldn't use your job title, how would you describe what you actually do for people?", 'No labels. No industry terms. Just the truth of what you actually do.', 'must-ask', 'long_text']);
  refData.push(['step-1', 'Who You Are', 'Transformation', 'who_transformation', "When someone works with you, what changes for them? What becomes possible that wasn't before?", 'Think outcomes, not deliverables.', 'must-ask', 'long_text']);
  refData.push(['step-1', 'Who You Are', 'Client Language', 'who_client_language', 'What specific compliments from your best clients make you feel the most proud of your work? Share the actual testimonials or feedback if you can.', "Not what you wish they'd say — what they actually said. Copy and paste the exact words.", 'must-ask', 'long_text']);
  refData.push(['step-1', 'Who You Are', 'Boundaries', 'who_not_for', 'Who is your work NOT for? What kind of client would you turn away?', "Sometimes the best positioning is knowing who you don't serve.", 'should-ask', 'long_text']);
  refData.push(['step-1', 'Who You Are', 'Casual Description', 'who_casual', 'How do you describe what you do to a stranger at a barbecue?', 'The casual version. Not the elevator pitch — the real thing.', 'should-ask', 'long_text']);
  refData.push(['step-1', 'Who You Are', 'Credentials', 'who_credentials', 'What credentials, certifications, or formal training do you have?', "List what's relevant. If none, that's fine too.", 'optional', 'long_text']);

  // Step 2: What You Do (6 questions)
  refData.push(['step-2', 'What You Do', 'Deliverable', 'what_deliverable', "When someone hires you, what do they actually get? What's the thing you deliver?", 'Be specific about the tangible outcome.', 'must-ask', 'long_text']);
  refData.push(['step-2', 'What You Do', 'Process', 'what_process', 'Walk me through your process from the moment someone hires you to the moment the work is done.', 'Step by step. What happens first, second, third?', 'must-ask', 'long_text']);
  refData.push(['step-2', 'What You Do', 'Scope', 'what_scope', "What's included in your core offering? What's NOT included?", 'Clear boundaries prevent scope creep.', 'must-ask', 'long_text']);
  refData.push(['step-2', 'What You Do', 'Timeline', 'what_timeline', 'How long does it typically take from start to finish?', 'Typical timeline for your standard engagement.', 'should-ask', 'long_text']);
  refData.push(['step-2', 'What You Do', 'Client Involvement', 'what_involvement', 'What do you need from the client for the work to go well?', 'Time commitment, materials, access, decisions?', 'should-ask', 'long_text']);
  refData.push(['step-2', 'What You Do', 'Packages', 'what_packages', 'Do you offer different tiers or packages? If so, what distinguishes them?', 'If you have different service levels.', 'optional', 'long_text']);

  // Step 3: Market Position (6 questions)
  refData.push(['step-3', 'Market Position', 'Alternatives', 'mkt_alternatives', "If someone can't work with you, what are their other options? Who else does what you do?", 'Name specific competitors or alternatives.', 'must-ask', 'long_text']);
  refData.push(['step-3', 'Market Position', 'Competitor Strengths', 'mkt_strengths', 'In your opinion, what do those alternatives do well?', 'Be honest. What have they figured out?', 'should-ask', 'long_text']);
  refData.push(['step-3', 'Market Position', 'Competitor Weaknesses', 'mkt_weaknesses', 'In your opinion, what do those alternatives do poorly or miss entirely?', 'Where do they fall short in your view?', 'should-ask', 'long_text']);
  refData.push(['step-3', 'Market Position', 'Differentiation', 'mkt_different', 'What do you do differently than those alternatives?', 'Your specific approach or method.', 'must-ask', 'long_text']);
  refData.push(['step-3', 'Market Position', 'Impact', 'mkt_better', 'Why does that difference matter? What does it make possible?', 'Connect the difference to client outcomes.', 'must-ask', 'long_text']);
  refData.push(['step-3', 'Market Position', 'Category', 'mkt_category', "How do you describe your category when people ask what industry you're in?", 'Your industry or category label.', 'optional', 'long_text']);

  // Step 4: Pricing & Value (9 questions)
  refData.push(['step-4', 'Pricing & Value', 'Pricing Model', 'price_structure', 'How do you charge? (Hourly, project, retainer, etc.)', 'Your pricing model.', 'must-ask', 'long_text']);
  refData.push(['step-4', 'Pricing & Value', 'Price Range', 'price_range', "What's the typical range for a project or engagement?", 'Ballpark numbers help set expectations.', 'must-ask', 'long_text']);
  refData.push(['step-4', 'Pricing & Value', 'Price Factors', 'price_factors', 'What factors change the price? (Scope, timeline, complexity, etc.)', 'What makes something cost more or less?', 'should-ask', 'long_text']);
  refData.push(['step-4', 'Pricing & Value', 'Minimum', 'price_minimum', "What's the smallest project you'll take on? Is there a minimum?", 'Your floor for engagement.', 'should-ask', 'long_text']);
  refData.push(['step-4', 'Pricing & Value', 'ROI', 'price_roi', 'How do clients typically measure ROI or success when working with you?', 'What outcomes prove the investment was worth it?', 'must-ask', 'long_text']);
  refData.push(['step-4', 'Pricing & Value', 'Payment Terms', 'price_payment', 'What are your payment terms? (50% upfront, net 30, etc.)', 'How and when do clients pay?', 'optional', 'long_text']);
  refData.push(['step-4', 'Pricing & Value', 'Travel & Expenses', 'price_travel', 'Do you charge for travel, expenses, or other add-ons?', 'Additional costs beyond base price.', 'optional', 'long_text']);
  refData.push(['step-4', 'Pricing & Value', 'Discounts', 'price_discounts', 'Do you offer discounts for nonprofits, bulk projects, or referrals?', 'Any special pricing structures.', 'optional', 'long_text']);
  refData.push(['step-4', 'Pricing & Value', 'Rate History', 'price_increase', 'When was the last time you raised your rates? Why?', 'Pricing evolution tells a story.', 'optional', 'long_text']);

  // Step 5: Voice & Communication (7 questions)
  refData.push(['step-5', 'Voice & Communication', 'Voice Samples (Good)', 'voice_sample_good', "Share 3 examples of writing that sounds like you — emails, blog posts, social content, or proposals.", "Pick three different formats if possible. Things where you thought 'yeah, that's me.'", 'must-ask', 'long_text']);
  refData.push(['step-5', 'Voice & Communication', 'Voice Sample (Bad)', 'voice_sample_bad', "Share an example of writing that doesn't sound like you at all.", "Something that's technically accurate but doesn't sound like a human you recognize.", 'should-ask', 'long_text']);
  refData.push(['step-5', 'Voice & Communication', 'Language You Use', 'voice_words_use', 'What words or phrases do you use all the time in your work?', 'Metaphors, concepts, expressions that come out repeatedly.', 'must-ask', 'long_text']);
  refData.push(['step-5', 'Voice & Communication', 'Language You Avoid', 'voice_words_avoid', 'What words or phrases do you hate? What language feels wrong for your work?', 'Banned language or industry jargon you refuse to use.', 'must-ask', 'long_text']);
  refData.push(['step-5', 'Voice & Communication', 'Tone', 'voice_tone', "How would you describe your tone when you're communicating with clients?", 'Fast or slow? Careful or bold? Funny or serious?', 'should-ask', 'long_text']);
  refData.push(['step-5', 'Voice & Communication', 'Metaphors', 'voice_metaphors', 'Are there metaphors or analogies you use to explain your work?', 'Recurring ways you make concepts tangible.', 'optional', 'long_text']);
  refData.push(['step-5', 'Voice & Communication', 'Humor', 'voice_humor', 'Do you use humor in your client communication? If so, what kind?', 'Self-deprecating? Observational? Dry?', 'optional', 'long_text']);

  // Step 6: Proof & Stories (8 questions)
  refData.push(['step-6', 'Proof & Stories', 'Client Stories', 'proof_stories', "Tell me about 2-3 of your best client stories — or even just one if you're early in your work.", 'What was the problem? What did you do? What was the result? What did they say afterward?', 'must-ask', 'long_text']);
  refData.push(['step-6', 'Proof & Stories', 'Metrics', 'proof_metrics', 'What measurable results have you helped clients achieve?', 'Numbers, percentages, time saved, revenue increased.', 'should-ask', 'long_text']);
  refData.push(['step-6', 'Proof & Stories', 'Testimonials', 'proof_testimonials', "What's the best testimonial you've ever received?", 'The one that made you feel seen.', 'should-ask', 'long_text']);
  refData.push(['step-6', 'Proof & Stories', 'Industries', 'proof_industries', 'What industries or client types have you worked with most?', 'Your track record across different sectors.', 'should-ask', 'long_text']);
  refData.push(['step-6', 'Proof & Stories', 'Portfolio', 'proof_portfolio', 'Do you have a portfolio, case studies, or work samples you share with prospects?', 'Existing proof documentation.', 'optional', 'long_text']);
  refData.push(['step-6', 'Proof & Stories', 'Press', 'proof_press', 'Have you been featured in any publications, podcasts, or media?', 'External validation and visibility.', 'optional', 'long_text']);
  refData.push(['step-6', 'Proof & Stories', 'Awards', 'proof_awards', 'Have you won any awards or recognition in your field?', 'Industry recognition matters.', 'optional', 'long_text']);
  refData.push(['step-6', 'Proof & Stories', 'Ideal Client', 'proof_client_types', "What's the profile of your ideal client? (Size, industry, stage, etc.)", 'Who you do your best work for.', 'optional', 'long_text']);

  // Step 7: Client Experience (8 questions)
  refData.push(['step-7', 'Client Experience', 'Discovery', 'client_discovery', 'What happens in your first conversation with a potential client?', 'Your discovery or consultation process.', 'must-ask', 'long_text']);
  refData.push(['step-7', 'Client Experience', 'Qualification', 'client_qualify', 'How do you know if someone is a good fit to work with you?', 'Your qualification criteria.', 'must-ask', 'long_text']);
  refData.push(['step-7', 'Client Experience', 'Red Flags', 'client_redflags', 'What are the red flags that tell you someone is NOT a good fit?', "Warning signs you've learned to recognize.", 'should-ask', 'long_text']);
  refData.push(['step-7', 'Client Experience', 'Onboarding', 'client_onboarding', "Once someone hires you, what's the onboarding process like?", 'How do you kick things off?', 'should-ask', 'long_text']);
  refData.push(['step-7', 'Client Experience', 'Communication', 'client_communication', 'How often do you communicate with clients during a project?', 'Check-ins, updates, touchpoints.', 'optional', 'long_text']);
  refData.push(['step-7', 'Client Experience', 'Tools', 'client_tools', 'What tools or platforms do you use to manage client work?', 'Project management, communication tools.', 'optional', 'long_text']);
  refData.push(['step-7', 'Client Experience', 'Offboarding', 'client_offboarding', 'What happens when a project wraps up? How do you hand things off?', 'Your project completion process.', 'optional', 'long_text']);
  refData.push(['step-7', 'Client Experience', 'Retention', 'client_retention', 'Do clients typically come back for more work? What brings them back?', 'Repeat business patterns.', 'optional', 'long_text']);

  // Step 8: Meta Questions (5 questions)
  refData.push(['step-8', 'Meta Questions', 'Superpower', 'meta_superpower', 'What have clients or colleagues told you that you do differently than others in your field?', 'Not what you think — what have others actually pointed out?', 'must-ask', 'long_text']);
  refData.push(['step-8', 'Meta Questions', 'Misconceptions', 'meta_misunderstood', 'What do people most often misunderstand about your work?', 'Common misconceptions you have to correct.', 'should-ask', 'long_text']);
  refData.push(['step-8', 'Meta Questions', 'Energy', 'meta_energy', 'What part of your work gives you the most energy? What drains you?', 'The sustainability question.', 'should-ask', 'long_text']);
  refData.push(['step-8', 'Meta Questions', 'Recent Learning', 'meta_learn', 'What have you learned about your work in the last year that changed how you do it?', 'Evolution of your approach.', 'optional', 'long_text']);
  refData.push(['step-8', 'Meta Questions', 'Future Vision', 'meta_future', 'If this goes perfectly, where does your work go in the next 2-3 years?', 'Your vision for the business.', 'optional', 'long_text']);

  // Step 9: Documentation & Digital Presence (18 questions)
  refData.push(['step-9', 'Documentation & Digital Presence', 'Current State', 'doc_current_state', 'Where do you currently store information you need to reference repeatedly — pricing, processes, templates, client details?', 'In your head? Google Docs? CRM? Be specific about where different types of information live.', 'must-ask', 'long_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Templates', 'doc_templates', 'What templates, scripts, or documents do you reuse across clients?', 'Proposals, contracts, onboarding docs, etc.', 'should-ask', 'long_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'FAQs', 'doc_faqs', 'What questions do you answer over and over again?', 'The things you repeat to every prospect or client.', 'should-ask', 'long_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Objections', 'doc_objections', 'What objections do you hear most often from potential clients, and how do you handle each one?', 'Common pushback and your responses.', 'must-ask', 'long_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Website', 'doc_website_url', "What's your website URL?", 'Your main website.', 'must-ask', 'short_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'LinkedIn', 'doc_linkedin_url', "What's your LinkedIn profile URL?", 'Your personal LinkedIn profile.', 'should-ask', 'short_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Instagram', 'doc_instagram_url', "What's your Instagram handle or profile URL?", 'If you use Instagram for business.', 'optional', 'short_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Facebook', 'doc_facebook_url', "What's your Facebook page or profile URL?", 'Business page or professional profile.', 'optional', 'short_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'YouTube', 'doc_youtube_url', "What's your YouTube channel URL?", 'If you have video content.', 'optional', 'short_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'TikTok', 'doc_tiktok_url', "What's your TikTok handle or profile URL?", 'If you use TikTok for business.', 'optional', 'short_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Google Business', 'doc_google_business', "What's your Google Business Profile URL?", 'Your Google Business listing.', 'optional', 'short_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Review Sites', 'doc_reviews_urls', 'List any review sites where you have profiles (Yelp, Google Reviews, industry-specific platforms).', 'One URL per line.', 'optional', 'long_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Press Coverage', 'doc_press_urls', 'List any press coverage, interviews, podcasts, or articles featuring you or your work.', 'One URL per line.', 'optional', 'long_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Other Presence', 'doc_other_urls', 'Any other relevant online presence? Portfolio sites, directories, Substack, Medium, etc.', 'One URL per line.', 'optional', 'long_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Books', 'media_books', 'List books that have shaped how you think about your work.', 'Title and author.', 'optional', 'long_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Podcasts', 'media_podcast_episodes', 'List specific podcast episodes you reference frequently or that influenced your approach.', 'Paste URLs if you have them.', 'optional', 'long_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Videos', 'media_youtube_videos', 'List YouTube videos that influenced your approach or that you share with clients.', 'Paste URLs if you have them.', 'optional', 'long_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Articles', 'media_articles_blogs', 'List blog posts or articles you reference frequently in your work.', 'Paste URLs.', 'optional', 'long_text']);
  refData.push(['step-9', 'Documentation & Digital Presence', 'Thought Leaders', 'media_thought_leaders', 'List thought leaders, authors, or creators you follow closely and whose work influences yours.', 'Names or handles.', 'optional', 'long_text']);

  // Step 10: Operations & Logistics (6 questions)
  refData.push(['step-10', 'Operations & Logistics', 'Capacity', 'ops_capacity', 'How many clients can you serve at once?', 'Your realistic capacity.', 'should-ask', 'long_text']);
  refData.push(['step-10', 'Operations & Logistics', 'Waitlist', 'ops_waitlist', 'Do you have a waitlist? How far out are you typically booked?', 'Current demand and scheduling.', 'optional', 'long_text']);
  refData.push(['step-10', 'Operations & Logistics', 'Team', 'ops_team', 'Do you work solo or do you have a team? Who does what?', 'Your operational structure.', 'optional', 'long_text']);
  refData.push(['step-10', 'Operations & Logistics', 'Partners', 'ops_partners', 'Do you partner with or refer work to other professionals?', 'Your network and referral relationships.', 'optional', 'long_text']);
  refData.push(['step-10', 'Operations & Logistics', 'Location', 'ops_location', 'Where are you based? Do you work remotely, locally, or both?', 'Geographic scope of your work.', 'optional', 'long_text']);
  refData.push(['step-10', 'Operations & Logistics', 'Availability', 'ops_availability', "What's your typical availability for new projects?", 'Lead time for new engagements.', 'optional', 'long_text']);

  // Write all question data
  ref.getRange(1, 1, refData.length, refHeaders.length).setValues(refData);

  // Header formatting
  ref.getRange(1, 1, 1, refHeaders.length)
    .setFontWeight('bold')
    .setBackground('#4a148c')
    .setFontColor('#ffffff')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setBorder(true, true, true, true, false, false, '#333333', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  ref.setColumnWidth(1, 80);
  ref.setColumnWidth(2, 200);
  ref.setColumnWidth(3, 180);
  ref.setColumnWidth(4, 200);
  ref.setColumnWidth(5, 500);
  ref.setColumnWidth(6, 400);
  ref.setColumnWidth(7, 100);
  ref.setColumnWidth(8, 100);

  ref.setFrozenRows(1);
  ref.getRange('E:E').setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  ref.getRange('F:F').setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  // Color-code tiers: red = must-ask, yellow = should-ask, green = optional
  var tierRange = ref.getRange(2, 7, refData.length - 1, 1);
  ref.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('must-ask').setBackground('#ffcdd2').setFontColor('#b71c1c')
      .setRanges([tierRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('should-ask').setBackground('#fff9c4').setFontColor('#f57f17')
      .setRanges([tierRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('optional').setBackground('#e8f5e9').setFontColor('#2e7d32')
      .setRanges([tierRange]).build(),
  ]);

  // Protect reference tab (warning only, won't block)
  ref.protect().setDescription('Questions Reference — read only').setWarningOnly(true);

  // Alternating row colors
  clearBandings_(ref);
  ref.getRange(2, 1, refData.length - 1, refHeaders.length).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);

  // ═══════════════════════════════════════════════
  // TAB 4: Dashboard
  // ═══════════════════════════════════════════════
  var dashboard = ss.getSheetByName('Dashboard');
  if (!dashboard) {
    dashboard = ss.insertSheet('Dashboard', 3);
  }

  var dashData = [
    ['Overlap Voice — Dashboard', '', '', '', ''],
    ['', '', '', '', ''],
    ['Metric', 'Value', '', 'Active Steps Breakdown', 'Count'],
    ['Total Users', '=COUNTA(Users!A2:A)', '', 'step-1: Who You Are', '=COUNTIF(Users!C2:C,"step-1")'],
    ['Users Active (last 24h)', '=COUNTIFS(Users!F2:F,"<>",Users!F2:F,">="&TEXT(NOW()-1,"yyyy-mm-dd"))', '', 'step-2: What You Do', '=COUNTIF(Users!C2:C,"step-2")'],
    ['Users Active (last 7d)', '=COUNTIFS(Users!F2:F,"<>",Users!F2:F,">="&TEXT(NOW()-7,"yyyy-mm-dd"))', '', 'step-3: Market Position', '=COUNTIF(Users!C2:C,"step-3")'],
    ['Most Recent Save', '=IF(COUNTA(Users!F2:F)=0,"—",MAX(ARRAYFORMULA(IF(Users!F2:F<>"",DATEVALUE(MID(Users!F2:F,1,10))+TIMEVALUE(MID(Users!F2:F,12,8)),0))))', '', 'step-4: Pricing & Value', '=COUNTIF(Users!C2:C,"step-4")'],
    ['', '', '', 'step-5: Voice & Communication', '=COUNTIF(Users!C2:C,"step-5")'],
    ['Screen Distribution', '', '', 'step-6: Proof & Stories', '=COUNTIF(Users!C2:C,"step-6")'],
    ['questions', '=COUNTIF(Users!D2:D,"questions")', '', 'step-7: Client Experience', '=COUNTIF(Users!C2:C,"step-7")'],
    ['router', '=COUNTIF(Users!D2:D,"router")', '', 'step-8: Meta Questions', '=COUNTIF(Users!C2:C,"step-8")'],
    ['review', '=COUNTIF(Users!D2:D,"review")', '', 'step-9: Documentation & Digital Presence', '=COUNTIF(Users!C2:C,"step-9")'],
    ['output', '=COUNTIF(Users!D2:D,"output")', '', 'step-10: Operations & Logistics', '=COUNTIF(Users!C2:C,"step-10")'],
  ];

  dashboard.getRange(1, 1, dashData.length, 5).setValues(dashData);

  // Formatting
  dashboard.getRange('A1').setFontSize(16).setFontWeight('bold').setFontColor('#1a1a2e');
  dashboard.getRange('A3:B3').setFontWeight('bold').setBackground('#e0e0e0');
  dashboard.getRange('D3:E3').setFontWeight('bold').setBackground('#e0e0e0');
  dashboard.getRange('A9').setFontWeight('bold');
  dashboard.getRange('B7').setNumberFormat('yyyy-mm-dd hh:mm:ss');

  dashboard.setColumnWidth(1, 200);
  dashboard.setColumnWidth(2, 200);
  dashboard.setColumnWidth(3, 30);
  dashboard.setColumnWidth(4, 320);
  dashboard.setColumnWidth(5, 80);

  // ═══════════════════════════════════════════════
  // Cleanup and final arrangement
  // ═══════════════════════════════════════════════
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
  }

  // Move Dashboard to first position
  ss.setActiveSheet(dashboard);
  ss.moveActiveSheet(1);

  // Share with Vince
  try {
    ss.addEditor('vromanelli@gmail.com');
  } catch (e) {
    Logger.log('Could not auto-share: ' + e.message);
  }

  // Done — show result
  var msg = 'Sheet ID: ' + ss.getId() + '\n\n' +
    'Add this as GOOGLE_SHEETS_ID in your Vercel env vars.\n\n' +
    'Tabs created:\n' +
    '  1. Dashboard — live user stats\n' +
    '  2. Users — app reads/writes here\n' +
    '  3. Answers Expanded — run expandAnswers() to populate\n' +
    '  4. Questions Reference — all 82 questions with IDs\n\n' +
    'Questions: 82 total (1 router + 81 across 10 steps)';

  try {
    SpreadsheetApp.getUi().alert('Setup Complete', msg, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (e) {
    Logger.log('SETUP COMPLETE\n' + msg);
  }
}


/**
 * Expands the JSON answers column into individual rows with question text.
 * Run from the Overlap Voice menu, or set on a time trigger.
 */
function expandAnswers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var users = ss.getSheetByName('Users');
  var expanded = ss.getSheetByName('Answers Expanded');
  var ref = ss.getSheetByName('Questions Reference');

  if (!users || !expanded || !ref) return;

  // Build question lookup
  var refData = ref.getDataRange().getValues();
  var questionMap = {};
  for (var i = 1; i < refData.length; i++) {
    questionMap[refData[i][3]] = {
      step: refData[i][0],
      section: refData[i][2],
      questionText: refData[i][4],
    };
  }

  // Read all user rows
  var userData = users.getDataRange().getValues();
  var rows = [];

  for (var u = 1; u < userData.length; u++) {
    var email = userData[u][0];
    var lastSaved = userData[u][5];
    var answersJson = userData[u][4];
    if (!email || !answersJson) continue;

    var answers;
    try { answers = JSON.parse(answersJson); } catch (e) { continue; }

    var questionIds = Object.keys(answers);
    for (var q = 0; q < questionIds.length; q++) {
      var qId = questionIds[q];
      var answer = answers[qId];
      if (!answer || answer.trim() === '') continue;

      var meta = questionMap[qId] || { step: '?', section: '?', questionText: qId };
      rows.push([email, meta.step, meta.section, qId, meta.questionText, answer, lastSaved]);
    }
  }

  // Clear and rewrite
  if (expanded.getLastRow() > 1) {
    expanded.getRange(2, 1, expanded.getLastRow() - 1, 7).clearContent();
  }
  if (rows.length > 0) {
    expanded.getRange(2, 1, rows.length, 7).setValues(rows);
    expanded.getRange(2, 1, rows.length, 7).sort([
      { column: 1, ascending: true },
      { column: 2, ascending: true },
    ]);
  }
}


/**
 * Custom menu — appears when sheet opens.
 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Overlap Voice')
    .addItem('Refresh Expanded Answers', 'expandAnswers')
    .addItem('Re-run Setup', 'setupOverlapSheet')
    .addToUi();
}
