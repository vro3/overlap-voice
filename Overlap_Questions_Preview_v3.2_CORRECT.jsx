// The Overlap Questions Preview v3.2
// Generated: February 15, 2026
// Based on: 66 deployed questions + 15 new URL ingestion fields = 82 total
// Systematic polish applied from review feedback

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const OverlapQuestionsPreview = () => {
  const [expandedStep, setExpandedStep] = useState(9); // Default open to show new URL fields

  const questions = {
    step1: {
      title: "Step 1: Who You Are",
      subtitle: "Identity, transformation, and client feedback",
      count: 7,
      questions: [
        {
          id: 'who_background',
          text: "How long have you been doing this work? What was the path that brought you to doing what you do?",
          helper: "Don't give me the LinkedIn version. Was this intentional or did you fall into it?",
          tier: 'must-ask',
          improved: true,
          note: "Fixed 'here' vagueness"
        },
        {
          id: 'who_no_title',
          text: "If you couldn't use your job title, how would you describe what you actually do for people?",
          helper: "No labels. No industry terms. Just the truth of what you actually do.",
          tier: 'must-ask',
          isNew: true,
          note: "Moved from Step 8 - identity first"
        },
        {
          id: 'who_transformation',
          text: "When someone works with you, what changes for them? What becomes possible that wasn't before?",
          helper: "Think outcomes, not deliverables.",
          tier: 'must-ask'
        },
        {
          id: 'who_client_language',
          text: "What specific compliments from your best clients make you feel the most proud of your work? Share the actual testimonials or feedback if you can.",
          helper: "Not what you wish they'd say — what they actually said. Copy and paste the exact words.",
          tier: 'must-ask',
          improved: true,
          note: "Added 'share actual testimonials'"
        },
        {
          id: 'who_not_for',
          text: "Who is your work NOT for? What kind of client would you turn away?",
          helper: "Sometimes the best positioning is knowing who you don't serve.",
          tier: 'should-ask'
        },
        {
          id: 'who_casual',
          text: "How do you describe what you do to a stranger at a barbecue?",
          helper: "The casual version. Not the elevator pitch — the real thing.",
          tier: 'should-ask',
          improved: true,
          note: "Changed 'friend' to 'stranger'"
        },
        {
          id: 'who_credentials',
          text: "What credentials, certifications, or formal training do you have?",
          helper: "List what's relevant. If none, that's fine too.",
          tier: 'optional'
        }
      ]
    },
    step2: {
      title: "Step 2: What You Do",
      subtitle: "Services, process, and scope",
      count: 6,
      questions: [
        {
          id: 'what_deliverable',
          text: "When someone hires you, what do they actually get? What's the thing you deliver?",
          helper: "Be specific about the tangible outcome.",
          tier: 'must-ask'
        },
        {
          id: 'what_process',
          text: "Walk me through your process from the moment someone hires you to the moment the work is done.",
          helper: "Step by step. What happens first, second, third?",
          tier: 'must-ask'
        },
        {
          id: 'what_scope',
          text: "What's included in your core offering? What's NOT included?",
          helper: "Clear boundaries prevent scope creep.",
          tier: 'must-ask'
        },
        {
          id: 'what_timeline',
          text: "How long does it typically take from start to finish?",
          helper: "Typical timeline for your standard engagement.",
          tier: 'should-ask'
        },
        {
          id: 'what_involvement',
          text: "What do you need from the client for the work to go well?",
          helper: "Time commitment, materials, access, decisions?",
          tier: 'should-ask'
        },
        {
          id: 'what_packages',
          text: "Do you offer different tiers or packages? If so, what distinguishes them?",
          helper: "If you have Turnkey/Hybrid/Bespoke or similar tiers.",
          tier: 'optional'
        }
      ]
    },
    step3: {
      title: "Step 3: Market Position",
      subtitle: "Alternatives, differentiation, and competitive landscape",
      count: 6,
      questions: [
        {
          id: 'mkt_alternatives',
          text: "If someone can't work with you, what are their other options? Who else does what you do?",
          helper: "Name specific competitors or alternatives.",
          tier: 'must-ask'
        },
        {
          id: 'mkt_strengths',
          text: "In your opinion, what do those alternatives do well?",
          helper: "Be honest. What have they figured out?",
          tier: 'should-ask',
          improved: true,
          note: "Added 'In your opinion' prefix"
        },
        {
          id: 'mkt_weaknesses',
          text: "In your opinion, what do those alternatives do poorly or miss entirely?",
          helper: "Where do they fall short in your view?",
          tier: 'should-ask',
          improved: true,
          note: "Added 'In your opinion' prefix"
        },
        {
          id: 'mkt_different',
          text: "What do you do differently than those alternatives?",
          helper: "Your specific approach or method.",
          tier: 'must-ask'
        },
        {
          id: 'mkt_better',
          text: "Why does that difference matter? What does it make possible?",
          helper: "Connect the difference to client outcomes.",
          tier: 'must-ask'
        },
        {
          id: 'mkt_category',
          text: "How do you describe your category when people ask what industry you're in?",
          helper: "Your industry or category label.",
          tier: 'optional'
        }
      ]
    },
    step4: {
      title: "Step 4: Pricing & Value",
      subtitle: "How you charge and why it's worth it",
      count: 9,
      questions: [
        {
          id: 'price_structure',
          text: "How do you charge? (Hourly, project, retainer, etc.)",
          helper: "Your pricing model.",
          tier: 'must-ask'
        },
        {
          id: 'price_range',
          text: "What's the typical range for a project or engagement?",
          helper: "Ballpark numbers help set expectations.",
          tier: 'must-ask'
        },
        {
          id: 'price_factors',
          text: "What factors change the price? (Scope, timeline, complexity, etc.)",
          helper: "What makes something cost more or less?",
          tier: 'should-ask'
        },
        {
          id: 'price_minimum',
          text: "What's the smallest project you'll take on? Is there a minimum?",
          helper: "Your floor for engagement.",
          tier: 'should-ask'
        },
        {
          id: 'price_roi',
          text: "How do clients typically measure ROI or success when working with you?",
          helper: "What outcomes prove the investment was worth it?",
          tier: 'must-ask'
        },
        {
          id: 'price_payment',
          text: "What are your payment terms? (50% upfront, net 30, etc.)",
          helper: "How and when do clients pay?",
          tier: 'optional'
        },
        {
          id: 'price_travel',
          text: "Do you charge for travel, expenses, or other add-ons?",
          helper: "Additional costs beyond base price.",
          tier: 'optional'
        },
        {
          id: 'price_discounts',
          text: "Do you offer discounts for nonprofits, bulk projects, or referrals?",
          helper: "Any special pricing structures.",
          tier: 'optional'
        },
        {
          id: 'price_increase',
          text: "When was the last time you raised your rates? Why?",
          helper: "Pricing evolution tells a story.",
          tier: 'optional'
        }
      ]
    },
    step5: {
      title: "Step 5: Voice & Communication",
      subtitle: "How you sound, what language you use",
      count: 7,
      questions: [
        {
          id: 'voice_sample_good',
          text: "Share 3 examples of writing that sounds like you — emails, blog posts, social content, or proposals.",
          helper: "Pick three different formats if possible. Things where you thought 'yeah, that's me.'",
          tier: 'must-ask',
          improved: true,
          note: "Changed to ask for 3 examples"
        },
        {
          id: 'voice_sample_bad',
          text: "Share an example of writing that doesn't sound like you at all.",
          helper: "Something that's technically accurate but doesn't sound like a human you recognize.",
          tier: 'should-ask'
        },
        {
          id: 'voice_words_use',
          text: "What words or phrases do you use all the time in your work?",
          helper: "Metaphors, concepts, expressions that come out repeatedly.",
          tier: 'must-ask'
        },
        {
          id: 'voice_words_avoid',
          text: "What words or phrases do you hate? What language feels wrong for your work?",
          helper: "Banned language or industry jargon you refuse to use.",
          tier: 'must-ask'
        },
        {
          id: 'voice_tone',
          text: "How would you describe your tone when you're communicating with clients?",
          helper: "Fast or slow? Careful or bold? Funny or serious?",
          tier: 'should-ask'
        },
        {
          id: 'voice_metaphors',
          text: "Are there metaphors or analogies you use to explain your work?",
          helper: "Recurring ways you make concepts tangible.",
          tier: 'optional'
        },
        {
          id: 'voice_humor',
          text: "Do you use humor in your client communication? If so, what kind?",
          helper: "Self-deprecating? Observational? Dry?",
          tier: 'optional'
        }
      ]
    },
    step6: {
      title: "Step 6: Proof & Stories",
      subtitle: "Case studies, metrics, and what clients actually say",
      count: 8,
      questions: [
        {
          id: 'proof_stories',
          text: "Tell me about 2-3 of your best client stories — or even just one if you're early in your work.",
          helper: "What was the problem? What did you do? What was the result? What did they say afterward?",
          tier: 'must-ask',
          improved: true,
          note: "Doesn't assume 3 exist"
        },
        {
          id: 'proof_metrics',
          text: "What measurable results have you helped clients achieve?",
          helper: "Numbers, percentages, time saved, revenue increased.",
          tier: 'should-ask'
        },
        {
          id: 'proof_testimonials',
          text: "What's the best testimonial you've ever received?",
          helper: "The one that made you feel seen.",
          tier: 'should-ask'
        },
        {
          id: 'proof_industries',
          text: "What industries or client types have you worked with most?",
          helper: "Your track record across different sectors.",
          tier: 'should-ask'
        },
        {
          id: 'proof_portfolio',
          text: "Do you have a portfolio, case studies, or work samples you share with prospects?",
          helper: "Existing proof documentation.",
          tier: 'optional'
        },
        {
          id: 'proof_press',
          text: "Have you been featured in any publications, podcasts, or media?",
          helper: "External validation and visibility.",
          tier: 'optional'
        },
        {
          id: 'proof_awards',
          text: "Have you won any awards or recognition in your field?",
          helper: "Industry recognition matters.",
          tier: 'optional'
        },
        {
          id: 'proof_client_types',
          text: "What's the profile of your ideal client? (Size, industry, stage, etc.)",
          helper: "Who you do your best work for.",
          tier: 'optional'
        }
      ]
    },
    step7: {
      title: "Step 7: Client Experience",
      subtitle: "From discovery to delivery and beyond",
      count: 8,
      questions: [
        {
          id: 'client_discovery',
          text: "What happens in your first conversation with a potential client?",
          helper: "Your discovery or consultation process.",
          tier: 'must-ask'
        },
        {
          id: 'client_qualify',
          text: "How do you know if someone is a good fit to work with you?",
          helper: "Your qualification criteria.",
          tier: 'must-ask'
        },
        {
          id: 'client_redflags',
          text: "What are the red flags that tell you someone is NOT a good fit?",
          helper: "Warning signs you've learned to recognize.",
          tier: 'should-ask'
        },
        {
          id: 'client_onboarding',
          text: "Once someone hires you, what's the onboarding process like?",
          helper: "How do you kick things off?",
          tier: 'should-ask'
        },
        {
          id: 'client_communication',
          text: "How often do you communicate with clients during a project?",
          helper: "Check-ins, updates, touchpoints.",
          tier: 'optional'
        },
        {
          id: 'client_tools',
          text: "What tools or platforms do you use to manage client work?",
          helper: "Project management, communication tools.",
          tier: 'optional'
        },
        {
          id: 'client_offboarding',
          text: "What happens when a project wraps up? How do you hand things off?",
          helper: "Your project completion process.",
          tier: 'optional'
        },
        {
          id: 'client_retention',
          text: "Do clients typically come back for more work? What brings them back?",
          helper: "Repeat business patterns.",
          tier: 'optional'
        }
      ]
    },
    step8: {
      title: "Step 8: Meta Questions",
      subtitle: "Zoom out — what makes you different?",
      count: 5,
      questions: [
        {
          id: 'meta_superpower',
          text: "What have clients or colleagues told you that you do differently than others in your field?",
          helper: "Not what you think — what have others actually pointed out?",
          tier: 'must-ask',
          improved: true,
          note: "Evidence-based, not hypothetical"
        },
        {
          id: 'meta_misunderstood',
          text: "What do people most often misunderstand about your work?",
          helper: "Common misconceptions you have to correct.",
          tier: 'should-ask'
        },
        {
          id: 'meta_energy',
          text: "What part of your work gives you the most energy? What drains you?",
          helper: "The sustainability question.",
          tier: 'should-ask'
        },
        {
          id: 'meta_learn',
          text: "What have you learned about your work in the last year that changed how you do it?",
          helper: "Evolution of your approach.",
          tier: 'optional'
        },
        {
          id: 'meta_future',
          text: "If this goes perfectly, where does your work go in the next 2-3 years?",
          helper: "Your vision for the business.",
          tier: 'optional'
        }
      ]
    },
    step9: {
      title: "Step 9: Documentation & Digital Presence",
      subtitle: "What exists now + URLs for ScrapSync ingestion",
      count: 19,
      questions: [
        {
          id: 'doc_current_state',
          text: "Where do you currently store information you need to reference repeatedly — pricing, processes, templates, client details?",
          helper: "In your head? Google Docs? CRM? Be specific about where different types of information live.",
          tier: 'must-ask',
          improved: true,
          note: "More specific about information types"
        },
        {
          id: 'doc_templates',
          text: "What templates, scripts, or documents do you reuse across clients?",
          helper: "Proposals, contracts, onboarding docs, etc.",
          tier: 'should-ask'
        },
        {
          id: 'doc_faqs',
          text: "What questions do you answer over and over again?",
          helper: "The things you repeat to every prospect or client.",
          tier: 'should-ask'
        },
        {
          id: 'doc_objections',
          text: "What objections do you hear most often from potential clients, and how do you handle each one?",
          helper: "Common pushback and your responses.",
          tier: 'must-ask',
          improved: true,
          note: "Added 'how do you handle each one'"
        },
        // NEW: Digital Presence URL Ingestion Fields
        {
          id: 'doc_website_url',
          text: "What's your website URL?",
          helper: "Your main website. We'll scrape this to extract your About page, services, testimonials, and content.",
          tier: 'must-ask',
          isNew: true,
          note: "URL ingestion for ScrapSync"
        },
        {
          id: 'doc_linkedin_url',
          text: "What's your LinkedIn profile URL?",
          helper: "Your personal LinkedIn profile. We'll extract headline, about section, experience, recommendations.",
          tier: 'should-ask',
          isNew: true,
          note: "URL ingestion for ScrapSync"
        },
        {
          id: 'doc_instagram_url',
          text: "What's your Instagram handle or profile URL?",
          helper: "If you use Instagram for business. We'll analyze captions, content themes, engagement.",
          tier: 'optional',
          isNew: true,
          note: "URL ingestion for ScrapSync"
        },
        {
          id: 'doc_facebook_url',
          text: "What's your Facebook page or profile URL?",
          helper: "Business page or professional profile. We'll extract about section and public content.",
          tier: 'optional',
          isNew: true,
          note: "URL ingestion for ScrapSync"
        },
        {
          id: 'doc_youtube_url',
          text: "What's your YouTube channel URL?",
          helper: "If you have video content. We'll analyze titles, descriptions, transcripts.",
          tier: 'optional',
          isNew: true,
          note: "URL ingestion for ScrapSync"
        },
        {
          id: 'doc_tiktok_url',
          text: "What's your TikTok handle or profile URL?",
          helper: "If you use TikTok for business. We'll analyze content themes and captions.",
          tier: 'optional',
          isNew: true,
          note: "URL ingestion for ScrapSync"
        },
        {
          id: 'doc_google_business',
          text: "What's your Google Business Profile URL?",
          helper: "Your Google Business listing. We'll extract business description and reviews.",
          tier: 'optional',
          isNew: true,
          note: "URL ingestion for ScrapSync"
        },
        {
          id: 'doc_reviews_urls',
          text: "List any review sites where you have profiles (Yelp, Google Reviews, industry-specific platforms).",
          helper: "One URL per line. We'll extract reviews to understand how clients describe your work.",
          tier: 'optional',
          isNew: true,
          note: "URL ingestion for ScrapSync"
        },
        {
          id: 'doc_press_urls',
          text: "List any press coverage, interviews, podcasts, or articles featuring you or your work.",
          helper: "One URL per line. We'll extract quotes and how others position your work.",
          tier: 'optional',
          isNew: true,
          note: "URL ingestion for ScrapSync"
        },
        {
          id: 'doc_other_urls',
          text: "Any other relevant online presence? Portfolio sites, directories, Substack, Medium, etc.",
          helper: "One URL per line. Anything else that shows who you are professionally.",
          tier: 'optional',
          isNew: true,
          note: "URL ingestion for ScrapSync"
        },
        // NEW: Media & Influences Content Ingestion Fields
        {
          id: 'media_books',
          text: "List books that have shaped how you think about your work.",
          helper: "Title and author. We'll extract frameworks and philosophies you resonate with.",
          tier: 'optional',
          isNew: true,
          note: "Content ingestion"
        },
        {
          id: 'media_podcast_episodes',
          text: "List specific podcast episodes you reference frequently or that influenced your approach.",
          helper: "Paste URLs. We'll extract transcripts and analyze what resonates.",
          tier: 'optional',
          isNew: true,
          note: "Content ingestion"
        },
        {
          id: 'media_youtube_videos',
          text: "List YouTube videos that influenced your approach or that you share with clients.",
          helper: "Paste URLs. We'll extract transcripts and identify frameworks.",
          tier: 'optional',
          isNew: true,
          note: "Content ingestion"
        },
        {
          id: 'media_articles_blogs',
          text: "List blog posts or articles you reference frequently in your work.",
          helper: "Paste URLs. Articles that shaped how you think about your work.",
          tier: 'optional',
          isNew: true,
          note: "Content ingestion"
        },
        {
          id: 'media_thought_leaders',
          text: "List thought leaders, authors, or creators you follow closely and whose work influences yours.",
          helper: "Names or handles. People whose work consistently influences how you think.",
          tier: 'optional',
          isNew: true,
          note: "Content ingestion"
        }
      ]
    },
    step10: {
      title: "Step 10: Operations & Logistics",
      subtitle: "Capacity, team, location, availability",
      count: 6,
      questions: [
        {
          id: 'ops_capacity',
          text: "How many clients can you serve at once?",
          helper: "Your realistic capacity.",
          tier: 'should-ask'
        },
        {
          id: 'ops_waitlist',
          text: "Do you have a waitlist? How far out are you typically booked?",
          helper: "Current demand and scheduling.",
          tier: 'optional'
        },
        {
          id: 'ops_team',
          text: "Do you work solo or do you have a team? Who does what?",
          helper: "Your operational structure.",
          tier: 'optional'
        },
        {
          id: 'ops_partners',
          text: "Do you partner with or refer work to other professionals?",
          helper: "Your network and referral relationships.",
          tier: 'optional'
        },
        {
          id: 'ops_location',
          text: "Where are you based? Do you work remotely, locally, or both?",
          helper: "Geographic scope of your work.",
          tier: 'optional'
        },
        {
          id: 'ops_availability',
          text: "What's your typical availability for new projects?",
          helper: "Lead time for new engagements.",
          tier: 'optional'
        }
      ]
    }
  };

  const tierConfig = {
    'must-ask': { color: 'bg-red-100 text-red-700 border-red-200', label: 'Must Ask' },
    'should-ask': { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Should Ask' },
    'optional': { color: 'bg-slate-100 text-slate-600 border-slate-200', label: 'Optional' }
  };

  const totalQuestions = Object.values(questions).reduce((sum, step) => sum + step.count, 0);
  const newCount = Object.values(questions).reduce((sum, step) =>
    sum + step.questions.filter(q => q.isNew).length, 0
  );
  const improvedCount = Object.values(questions).reduce((sum, step) =>
    sum + step.questions.filter(q => q.improved).length, 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                The Overlap Voice App Questions
              </h1>
              <p className="text-lg text-slate-600 mb-4">
                v3.2 — Systematic polish + structured URL ingestion
              </p>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
                  <span className="text-slate-700"><strong>{totalQuestions}</strong> total questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-700"><strong>{newCount}</strong> new URL/content fields</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-700"><strong>{improvedCount}</strong> polished</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 mb-1">February 15, 2026</div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Ready for Feb 24
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        {Object.entries(questions).map(([stepKey, step]) => {
          const stepNum = parseInt(stepKey.replace('step', ''));
          const isExpanded = expandedStep === stepNum;
          const Icon = isExpanded ? ChevronDown : ChevronRight;
          const hasNew = step.questions.some(q => q.isNew);

          return (
            <div key={stepKey} className="mb-4">
              <button
                onClick={() => setExpandedStep(isExpanded ? null : stepNum)}
                className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-slate-300 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Icon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-900">
                          Step {stepNum}: {step.title}
                        </h2>
                        <span className="text-sm text-slate-500">({step.count})</span>
                        {hasNew && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200 font-medium">
                            {step.questions.filter(q => q.isNew).length} NEW
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">{step.subtitle}</div>
                    </div>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="mt-2 bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
                  {step.questions.map((q, idx) => (
                    <div key={q.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 text-slate-400">
                          <Circle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-slate-900 leading-tight flex-1">
                              {q.text}
                            </h3>
                            <div className="flex gap-2 flex-shrink-0">
                              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${tierConfig[q.tier].color}`}>
                                {tierConfig[q.tier].label}
                              </span>
                              {q.isNew && (
                                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-200 font-medium">
                                  NEW
                                </span>
                              )}
                              {q.improved && (
                                <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 font-medium">
                                  ✓
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed italic mb-3">
                            {q.helper}
                          </p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="font-mono text-slate-400">{q.id}</span>
                            {q.note && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500">{q.note}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl p-8 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{totalQuestions}</div>
              <div className="text-sm text-slate-400">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{newCount}</div>
              <div className="text-sm text-slate-400">New Fields</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{improvedCount}</div>
              <div className="text-sm text-slate-400">Polished</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">10</div>
              <div className="text-sm text-slate-400">Steps</div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-700 space-y-3">
            <div className="text-sm text-slate-300">
              <strong className="text-white">v3.2 Changes:</strong>
              <ul className="mt-2 space-y-1 ml-4">
                <li>• 15 new URL/content ingestion fields for ScrapSync pipeline</li>
                <li>• Digital presence (10 URLs) + Media influences (5 content sources)</li>
                <li>• Moved <code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded">who_no_title</code> from Step 8 to Step 1 (identity first)</li>
                <li>• Evidence-based rewrites: "what clients told you" not hypotheticals</li>
                <li>• Fixed vague language ("here" → "to doing what you do")</li>
                <li>• Added "In your opinion" to competitor strength/weakness questions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverlapQuestionsPreview;