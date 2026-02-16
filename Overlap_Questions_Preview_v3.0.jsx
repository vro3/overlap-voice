import React, { useState } from 'react';
import { ChevronRight, ChevronDown, CheckCircle2, AlertCircle, Circle } from 'lucide-react';

export default function OverlapQuestionsPreview() {
  const [expandedStep, setExpandedStep] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const steps = [
    {
      id: 1,
      name: "Who You Are",
      subtitle: "Extract the real story, not the rehearsed pitch",
      questions: [
        {
          id: "who_intention",
          text: "Imagine this process did its job perfectly. How does your life look different or better in the next three to six months?",
          helper: "Not what you think the 'right' answer is — what would actually change if this works? Don't say 'better marketing.' Say 'I want to stop rewriting my bio every time someone asks.' Be specific about the friction you want gone.",
          tier: "must-ask",
          isNew: true
        },
        {
          id: "who_background",
          text: "How long have you been doing this work? What was the path that brought you to doing what you do?",
          helper: "Don't give me the LinkedIn version. Was this intentional or did you fall into it? What changed in your life that led to this?",
          tier: "must-ask",
          changed: true
        },
        {
          id: "who_good_at",
          text: "What are the specific elements of your work that you're genuinely good at? Not the end result — the underlying skills that make the end result possible.",
          helper: "Not 'I'm good at performing' but 'I'm good at reading a room and adjusting energy in real-time.' The competencies that enable your outcomes.",
          tier: "must-ask",
          changed: true
        },
        {
          id: "who_hire_for",
          text: "What do people actually hire you for — not the service, but the outcome?",
          helper: "There's a difference between 'I hire her to design my website' and 'I hire her so I feel confident my brand looks legitimate.' What's the real fear or desire they're addressing?",
          tier: "must-ask"
        },
        {
          id: "who_perfect",
          text: "Describe a specific project that went perfectly. What made it perfect?",
          helper: "Pick one project. Not your best revenue — your best experience. What was different about this one? What was the outcome? What did the client say or do that told you this was a success?",
          tier: "must-ask",
          changed: true
        },
        {
          id: "who_waste",
          text: "Describe a specific project that felt like a waste of time. What went wrong?",
          helper: "Be honest. Was it the client? The scope? The money? The process? What would have made it better — or should you have just said no?",
          tier: "must-ask",
          changed: true
        },
        {
          id: "who_worst_part",
          text: "What part of your work consistently creates problems, eats time, or makes you consider quitting?",
          helper: "Be specific — not 'admin' but which part of admin drains you most. Not 'difficult clients' but what those clients actually do. What's the operational problem, not just the feeling?",
          tier: "should-ask",
          changed: true
        },
        {
          id: "who_current_clients",
          text: "Who actually hires you? What types of clients or companies pay for your work?",
          helper: "Describe your actual clients — not who you want to work with. What industry? What size? What role is the person who hires you? What budget level?",
          tier: "should-ask",
          changed: true
        },
        {
          id: "who_client_language",
          text: "What compliments from your best clients make you feel the most proud of your work?",
          helper: "Not what you wish they'd say — what they actually say. Exact words if you remember. Text messages, emails, reviews. The actual language real humans used about you.",
          tier: "must-ask",
          changed: true
        },
        {
          id: "who_differentiation",
          text: "Why do clients hire you instead of the alternatives?",
          helper: "What did they say they couldn't find elsewhere? What made them choose you specifically? If you don't know, what's your best guess based on what keeps coming back?",
          tier: "must-ask"
        },
        {
          id: "who_unspoken_value",
          text: "What do you do for clients that they don't know you do for them?",
          helper: "The invisible work. The unspoken benefits. The value you create that they don't realize is happening or that they take for granted.",
          tier: "should-ask",
          isNew: true
        },
        {
          id: "who_casual",
          text: "How do you describe what you do to a stranger at a barbecue?",
          helper: "The casual version. Not the elevator pitch — the real thing that comes out of your mouth when someone asks 'so what do you do?'",
          tier: "should-ask",
          changed: true
        },
        {
          id: "who_professional",
          text: "How do you describe what you do when pitching a potential client?",
          helper: "The pitch version. Does it sound different from how you'd tell a friend? If so, why? Which version is more honest?",
          tier: "must-ask",
          changed: true
        },
        {
          id: "who_ideal",
          text: "If you could only do one type of project for the rest of your career, what would it be?",
          helper: "Not the most profitable. Not the most common. The one that makes you feel like you're doing what you were meant to do.",
          tier: "must-ask"
        }
      ]
    },
    {
      id: 2,
      name: "Market & Positioning",
      subtitle: "Understand where you sit relative to alternatives and what makes you different",
      questions: [
        {
          id: "mkt_competitors",
          text: "Who do clients compare you to or consider instead of you?",
          helper: "Name specific competitors, alternatives, or substitutes. Include the obvious ones and the ones most people don't think about. Who would they hire if you didn't exist?",
          tier: "should-ask",
          changed: true
        },
        {
          id: "mkt_strengths",
          text: "In your opinion, what do those alternatives do well?",
          helper: "Be honest. Not what you're jealous of — what they've actually figured out that works. Why do some clients choose them over you?",
          tier: "should-ask",
          changed: true
        },
        {
          id: "mkt_weaknesses",
          text: "In your opinion, what do those alternatives do poorly?",
          helper: "Where do they fall short? What complaints have you heard from clients who came to you after working with someone else?",
          tier: "should-ask",
          changed: true
        },
        {
          id: "mkt_unanswered",
          text: "What question do prospects ask that nobody in your industry answers well?",
          helper: "Think about the questions that come up in every sales conversation. Is there one that you answer better than anyone else — or one that everyone dodges?",
          tier: "must-ask"
        },
        {
          id: "mkt_only",
          text: "Can you fill in this sentence: 'I'm the only ______ who ______.'",
          helper: "This is hard. It might take a few tries. The first part is what you are (not your job title — more specific). The second part is what only you actually do. If this sentence could describe anyone else, it's not right yet.",
          tier: "must-ask"
        },
        {
          id: "mkt_stage",
          text: "What market stage are you in?",
          helper: "Emerging (clients don't know what they need yet), Growing (demand increasing, new competitors entering), Maturing (well-established, many competitors), or Consolidating (winners emerging, smaller players disappearing)?",
          tier: "optional"
        },
        {
          id: "mkt_anti_language",
          text: "What do competitors say about themselves that sounds generic or fake?",
          helper: "What claims do you see repeated across your industry that make you roll your eyes?",
          tier: "optional"
        }
      ]
    },
    {
      id: 3,
      name: "Three Relationships",
      subtitle: "Discover your natural service tiers",
      questions: [
        {
          id: "three_split",
          text: "Think about your work in three categories: 1) Client tells you exactly what to do, you execute. 2) Client has goals, you collaborate on the solution. 3) Client trusts you completely, you design and deliver. What percentage of your current work falls into each?",
          helper: "Be honest about the split. Most people do all three but haven't named them or priced them differently. There's no wrong answer — just your reality right now.",
          tier: "must-ask"
        },
        {
          id: "three_profitable",
          text: "Which of those three makes you the most money per project?",
          helper: "Not total revenue — profit per project. Which type of work pays best for the time and energy you invest?",
          tier: "must-ask",
          changed: true
        },
        {
          id: "three_fulfilling",
          text: "Which of those three is most fulfilling to you?",
          helper: "If money were equal across all three, which would you choose? Which one makes you feel like you're doing your actual job?",
          tier: "must-ask",
          changed: true
        },
        {
          id: "three_desired",
          text: "Which of those three do you WANT to do more of?",
          helper: "This might be different from the most fulfilling one. Maybe you want more collaboration because it's the sweet spot between control and creativity. Maybe you want more full-trust work even though it's scary. What do you want your business to look like?",
          tier: "must-ask"
        },
        {
          id: "three_descriptions",
          text: "For each tier, describe what the client gets, what you deliver, and what the outcome is.",
          helper: "Even if you haven't named these tiers before, try to describe each one. What does the 'just execute' version include? What does the 'full trust' version include? How are they different in scope, timeline, and result?",
          tier: "should-ask"
        },
        {
          id: "three_movement",
          text: "How do clients move between these tiers?",
          helper: "Do clients start with 'just execute' and upgrade to full collaboration? Do your best clients start with trust and stay there? Is there a natural progression?",
          tier: "should-ask",
          changed: true
        }
      ]
    },
    {
      id: 4,
      name: "Voice & Language",
      subtitle: "Capture how you actually sound — not how you think you should sound",
      questions: [
        {
          id: "voice_recurring",
          text: "What words or phrases do you say repeatedly?",
          helper: "Metaphors, concepts, expressions that come out of your mouth over and over. The things a friend would say 'you always say that.' These are clues to your natural voice.",
          tier: "must-ask"
        },
        {
          id: "voice_anti_jargon",
          text: "What industry terms confuse your clients or make their eyes glaze over?",
          helper: "What terms make you cringe? What words feel fake when you say them? What language does your industry use that you refuse to use?",
          tier: "must-ask",
          changed: true
        },
        {
          id: "voice_sample_good",
          text: "Share 3 examples of writing that sounds like you — emails, blog posts, social content, or proposals.",
          helper: "Pick three different formats if possible. Client emails you're proud of. Social posts that landed. Proposals that felt right. Things where you read them back and thought 'yeah, that's me.'",
          tier: "should-ask",
          changed: true
        },
        {
          id: "voice_sample_bad",
          text: "Show me something you've written that doesn't sound like you.",
          helper: "Marketing copy someone else wrote for you. A bio that feels off. A pitch that doesn't feel right. Something that's technically accurate but doesn't sound like a human you recognize.",
          tier: "should-ask"
        },
        {
          id: "voice_persona",
          text: "If your brand was a person, how would they talk?",
          helper: "Fast or slow? Careful or bold? Funny or serious? Detailed or high-level? Formal or casual? Pick the real version, not the aspirational one.",
          tier: "should-ask"
        },
        {
          id: "voice_match",
          text: "Does your voice match your audience?",
          helper: "How does your ideal client talk? Are you too formal for them? Too casual? Do you speak the same language?",
          tier: "optional"
        }
      ]
    },
    {
      id: 5,
      name: "Pricing & Reality",
      subtitle: "Surface what you charge, what you should charge, and what's in the way",
      questions: [
        {
          id: "price_current",
          text: "What are you currently charging?",
          helper: "Actual numbers. Per project, per hour, per tier — however you price it. How did you arrive at that number? Do you feel good about it?",
          tier: "must-ask"
        },
        {
          id: "price_dream",
          text: "What would you charge if you weren't afraid?",
          helper: "If you knew the client would say yes, what would you quote? Not fantasy — the number that would make you feel like the work is truly worth it.",
          tier: "must-ask"
        },
        {
          id: "price_market",
          text: "What do your competitors actually charge?",
          helper: "If you know, share it. If you don't, that's also useful information. What's the market rate for what you do?",
          tier: "should-ask",
          changed: true
        },
        {
          id: "price_working",
          text: "What's actually working in your business right now?",
          helper: "What's bringing in good clients? What effort is actually paying off? What's generating revenue or fulfillment?",
          tier: "should-ask",
          changed: true
        },
        {
          id: "price_not_working",
          text: "What's not working?",
          helper: "What effort isn't paying off? What do you spend time on that doesn't seem to matter? What would you cut if you could?",
          tier: "should-ask",
          changed: true
        },
        {
          id: "price_ceiling",
          text: "What price point loses you ideal clients?",
          helper: "Not cheap clients — your IDEAL clients. At what price do they hesitate or walk away?",
          tier: "optional"
        },
        {
          id: "price_floor",
          text: "What price point attracts the wrong clients?",
          helper: "Is there a number that, when you quote it, brings in people who make the work miserable?",
          tier: "optional"
        }
      ]
    },
    {
      id: 6,
      name: "Energy & Sustainability",
      subtitle: "Separate life-giving work from soul-sucking work",
      questions: [
        {
          id: "energy_look_forward",
          text: "What types of work do you look forward to?",
          helper: "When you see it on the calendar, you feel good. You show up energized. You're in your element. What do these projects have in common?",
          tier: "must-ask",
          changed: true
        },
        {
          id: "energy_dread",
          text: "What types of work do you dread?",
          helper: "When you see it on the calendar, your stomach drops. You procrastinate. You consider canceling. Be specific — what patterns show up?",
          tier: "must-ask",
          changed: true
        },
        {
          id: "energy_flow",
          text: "What type of work puts you in flow state? What could you do for 6 hours without noticing?",
          helper: "The work where time disappears. Where you forget to check your phone. Where you're completely absorbed.",
          tier: "should-ask",
          changed: true
        },
        {
          id: "energy_life_giving",
          text: "Describe your life-giving clients. What makes them different?",
          helper: "What makes them energize you? Why do you love working with them? What do they have in common — behaviors, not demographics?",
          tier: "must-ask",
          changed: true
        },
        {
          id: "energy_soul_sucking",
          text: "Describe your soul-sucking clients. What patterns do they share?",
          helper: "What kind of client drains you? What do they have in common? What would you change about working with them — or should you stop working with them entirely?",
          tier: "must-ask",
          changed: true
        },
        {
          id: "energy_breaking_point",
          text: "What would make this work unsustainable for you?",
          helper: "What can't continue? What's the breaking point? What would make you walk away entirely?",
          tier: "optional",
          changed: true
        },
        {
          id: "energy_worth_it",
          text: "What outcome would make you feel like this work was truly worth it?",
          helper: "Not money — though money counts. What needs to be true for you to feel good about doing this?",
          tier: "optional",
          changed: true
        }
      ]
    },
    {
      id: 7,
      name: "Proof & Evidence",
      subtitle: "Mine for case studies, metrics, and client language that proves everything above",
      questions: [
        {
          id: "proof_stories",
          text: "Tell me about your 3 best client stories.",
          helper: "For each one: What was the client's actual problem? What did they try before you? What did you do that was different? What was the measurable result? What did they say afterward? Don't be modest — if it was great, say so.",
          tier: "must-ask"
        },
        {
          id: "proof_metrics",
          text: "What metrics or numbers prove your work delivers results?",
          helper: "Years in business. Number of clients. Revenue growth. Repeat client rate. Specific outcomes you can quantify. Even rough numbers are better than none.",
          tier: "should-ask",
          changed: true
        },
        {
          id: "proof_client_language",
          text: "What do clients say about you that you don't say about yourself?",
          helper: "There's usually a gap between how you describe your work and how clients describe it. The client version is almost always better for marketing. What words do they use that you don't?",
          tier: "should-ask"
        },
        {
          id: "proof_proudest",
          text: "What work makes you most proud professionally?",
          helper: "Not biggest revenue. The work that made you think 'this is why I do this.'",
          tier: "optional",
          changed: true
        }
      ]
    },
    {
      id: 8,
      name: "Meta Questions",
      subtitle: "Zoom out and find the real why",
      questions: [
        {
          id: "meta_frustration",
          text: "What frustrates you about how other people in your field do this work?",
          helper: "Where there's frustration, there's usually differentiation. What standards do you hold that others don't? What approaches do you reject? What do you see that makes you think 'I would never do it that way'?",
          tier: "must-ask",
          changed: true
        },
        {
          id: "meta_superpower",
          text: "What do you do that you think everyone does, but they actually don't?",
          helper: "Things so natural to you that you don't even realize they're special. Skills or habits you assume are standard but that clients are constantly surprised by.",
          tier: "must-ask"
        },
        {
          id: "meta_why",
          text: "Why does this work matter to you — not to your clients, to you?",
          helper: "What would happen if you stopped doing this? What are you actually building? What's the deeper reason you keep going?",
          tier: "must-ask",
          changed: true
        },
        {
          id: "meta_no_constraints",
          text: "What would you do if you knew you couldn't fail?",
          helper: "Remove every constraint — money, time, skill, reputation. What would you build?",
          tier: "optional"
        },
        {
          id: "meta_misconception",
          text: "What misconception about your work do you wish you could correct for everyone?",
          helper: "What do people assume about what you do that's just wrong? What would you tell everyone if you could?",
          tier: "optional"
        },
        {
          id: "meta_no_title",
          text: "If you couldn't use your job title, how would you describe what you actually do for people?",
          helper: "No labels. No industry terms. Just the truth of what you actually do.",
          tier: "optional",
          changed: true
        }
      ]
    },
    {
      id: 9,
      name: "Documentation Readiness",
      subtitle: "Assess what you already have and what needs to be built",
      questions: [
        {
          id: "doc_current_state",
          text: "Where does your business knowledge currently live?",
          helper: "In your head? In scattered documents? In emails? In a CRM? On your website? Be honest about how organized (or not) it is.",
          tier: "should-ask"
        },
        {
          id: "doc_repeated",
          text: "What do you explain in every single sales conversation?",
          helper: "The things you repeat to every potential client. The same explanation, the same objections handled, the same questions answered. These are the things that should be written once and deployed everywhere.",
          tier: "should-ask"
        },
        {
          id: "doc_faqs",
          text: "What questions do clients ask you most often?",
          helper: "The real ones. Not the ones you wish they'd ask. The actual questions that come up in almost every conversation.",
          tier: "should-ask"
        },
        {
          id: "doc_objections",
          text: "What objections do you hear most often from potential clients?",
          helper: "What pushback do they give before deciding to hire you? Price too high? Timeline too long? Don't understand the value? How do you handle each one?",
          tier: "should-ask",
          changed: true
        },
        {
          id: "doc_digital_presence",
          text: "What's your current digital presence?",
          helper: "Website, social media, Google Business Profile, review sites, directories. What exists and how does it feel — accurate? Outdated? Embarrassing?",
          tier: "optional"
        }
      ]
    },
    {
      id: 10,
      name: "Custom Questions & Influences",
      subtitle: "Your questions + the content that shapes your thinking",
      questions: [
        {
          id: "custom_1",
          text: "Custom Question 1",
          helper: "Edit this question to ask something specific to your business or situation. Then answer it.",
          tier: "should-ask"
        },
        {
          id: "custom_2",
          text: "Custom Question 2",
          helper: "Edit this question to dig into something unique to your work.",
          tier: "should-ask"
        },
        {
          id: "custom_3",
          text: "Custom Question 3",
          helper: "Edit this question to explore an area that matters to you.",
          tier: "should-ask"
        },
        {
          id: "custom_4",
          text: "Custom Question 4",
          helper: "Edit this question to capture something the other sections missed.",
          tier: "optional"
        },
        {
          id: "custom_5",
          text: "Custom Question 5",
          helper: "Edit this question for any final thoughts or areas you want to document.",
          tier: "optional"
        },
        {
          id: "media_library",
          text: "What books, podcasts, blogs, or videos do you resonate with?",
          helper: "List the content that has shaped how you think about your work. Include titles, authors, episodes, or links. We'll analyze these to understand what influences your approach and extract patterns that matter to you. Think: books you recommend to everyone, podcasts you never skip, thought leaders you follow religiously.",
          tier: "must-ask"
        }
      ]
    }
  ];

  const tierConfig = {
    'must-ask': { icon: CheckCircle2, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Must Ask' },
    'should-ask': { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Should Ask' },
    'optional': { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Optional' }
  };

  const totalQuestions = steps.reduce((sum, step) => sum + step.questions.length, 0);
  const changedCount = steps.reduce((sum, step) =>
    sum + step.questions.filter(q => q.changed || q.isNew).length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                The Overlap Questions v3.0
              </h1>
              <p className="text-lg text-slate-600">
                Systematically polished for universal applicability
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{totalQuestions}</div>
              <div className="text-sm text-slate-500">questions</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-700">{changedCount} polished</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-slate-700">2 new</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, stepIdx) => {
            const isExpanded = expandedStep === step.id;
            const Icon = isExpanded ? ChevronDown : ChevronRight;

            return (
              <div key={step.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                {/* Step Header */}
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="w-6 h-6 text-slate-400" />
                    <div className="text-left">
                      <div className="text-xl font-bold text-slate-900">
                        Step {step.id}: {step.name}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        {step.subtitle}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-500">
                      {step.questions.length} questions
                    </div>
                  </div>
                </button>

                {/* Questions */}
                {isExpanded && (
                  <div className="border-t border-slate-200 divide-y divide-slate-100">
                    {step.questions.map((q, qIdx) => {
                      const TierIcon = tierConfig[q.tier].icon;
                      const isSelected = selectedQuestion === q.id;

                      return (
                        <div
                          key={q.id}
                          onClick={() => setSelectedQuestion(isSelected ? null : q.id)}
                          className={`p-6 cursor-pointer transition-all ${
                            isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
                          } ${q.changed ? 'bg-green-50/30' : ''} ${q.isNew ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              <TierIcon className={`w-5 h-5 ${tierConfig[q.tier].color}`} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs font-medium px-2 py-1 rounded ${tierConfig[q.tier].bg} ${tierConfig[q.tier].color} ${tierConfig[q.tier].border} border`}>
                                      {tierConfig[q.tier].label}
                                    </span>
                                    {q.isNew && (
                                      <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700 border border-blue-200">
                                        NEW
                                      </span>
                                    )}
                                    {q.changed && (
                                      <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700 border border-green-200">
                                        POLISHED
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="text-lg font-semibold text-slate-900 leading-tight mb-2">
                                    {q.text}
                                  </h3>
                                </div>
                              </div>

                              <div className={`transition-all ${isSelected ? 'opacity-100' : 'opacity-70'}`}>
                                <p className="text-sm text-slate-600 leading-relaxed italic">
                                  {q.helper}
                                </p>
                              </div>

                              <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                                <span className="font-mono">{q.id}</span>
                                <span>•</span>
                                <span>Q{stepIdx + 1}.{qIdx + 1}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl p-8 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{totalQuestions}</div>
              <div className="text-sm text-slate-400">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">10</div>
              <div className="text-sm text-slate-400">Steps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{changedCount}</div>
              <div className="text-sm text-slate-400">Polished</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">v3.0</div>
              <div className="text-sm text-slate-400">Ready for Feb 24</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
