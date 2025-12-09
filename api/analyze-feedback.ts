import { GoogleGenAI, Type, Schema } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY not found in environment");
    return res.status(500).json({ error: "API Key not configured" });
  }

  try {
    const { responses, totalQuestions, sessions } = req.body;

    if (!responses || responses.length === 0) {
      return res.status(400).json({ error: 'No responses to analyze' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        themes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Theme name that could become a keyword cluster, e.g. 'Speed & Efficiency', 'Premium Quality'" },
              mentions: { type: Type.NUMBER, description: "How many times this theme appears" },
              strength: { type: Type.STRING, description: "One of: strong, emerging, weak" },
              details: { type: Type.STRING, description: "How this theme could translate to website messaging or SEO keywords" }
            },
            required: ["name", "mentions", "strength", "details"]
          },
          description: "Key themes that will inform brand messaging and keyword strategy"
        },
        gaps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              area: { type: Type.STRING, description: "What's missing for website/SEO, e.g. 'Service pricing for schema markup', 'Specific outcomes for case studies'" },
              suggestion: { type: Type.STRING, description: "What they should elaborate on for SEO/AEO/branding purposes, using 'you' language" },
              priority: { type: Type.STRING, description: "One of: high, medium, low" },
              useCase: { type: Type.STRING, description: "How this info will be used: 'homepage hero', 'service page', 'FAQ schema', 'about page', 'meta description', 'AI answer optimization'" },
              relatedQuestionId: { type: Type.STRING, description: "ID of a related unanswered question if applicable" },
              relatedSessionId: { type: Type.STRING, description: "ID of the session containing the related question" }
            },
            required: ["area", "suggestion", "priority", "useCase"]
          },
          description: "Information gaps that will affect website copy, SEO, or AI answer optimization"
        },
        strengths: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              area: { type: Type.STRING, description: "What content is ready for the website" },
              evidence: { type: Type.STRING, description: "Specific quote or paraphrase that can be used" },
              useCase: { type: Type.STRING, description: "Where to use it: 'headline', 'testimonial page', 'about section', 'service description', 'FAQ', 'schema markup'" }
            },
            required: ["area", "evidence", "useCase"]
          },
          description: "Content that's ready to be turned into website copy or structured data"
        },
        seoReadiness: {
          type: Type.OBJECT,
          properties: {
            hasTargetAudience: { type: Type.BOOLEAN, description: "Can we write persona-targeted content?" },
            hasDifferentiator: { type: Type.BOOLEAN, description: "Is there a clear unique value prop for headlines?" },
            hasPricing: { type: Type.BOOLEAN, description: "Can we add pricing schema markup?" },
            hasServices: { type: Type.BOOLEAN, description: "Are services defined enough for service pages?" },
            hasProof: { type: Type.BOOLEAN, description: "Are there testimonials/case studies for trust signals?" },
            hasFAQContent: { type: Type.BOOLEAN, description: "Is there enough for FAQ schema/AEO?" },
            hasVoice: { type: Type.BOOLEAN, description: "Is brand voice clear enough for consistent copy?" }
          },
          required: ["hasTargetAudience", "hasDifferentiator", "hasPricing", "hasServices", "hasProof", "hasFAQContent", "hasVoice"]
        },
        nextSteps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3-5 specific things to answer that will unlock website/SEO deliverables"
        },
        readiness: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "0-100 score for website/SEO readiness" },
            label: { type: Type.STRING, description: "e.g. 'Gathering Info', 'Building Foundation', 'Almost Ready to Build', 'Ready for Website'" },
            message: { type: Type.STRING, description: "What we can and can't build yet for their website, using 'you' language" }
          },
          required: ["score", "label", "message"]
        },
        websiteBlocks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              section: { type: Type.STRING, description: "Website section: 'hero', 'services', 'about', 'testimonials', 'faq', 'pricing', 'cta'" },
              status: { type: Type.STRING, description: "One of: ready, partial, missing" },
              content: { type: Type.STRING, description: "Draft content if ready, or what's needed if not" }
            },
            required: ["section", "status", "content"]
          },
          description: "Status of each website section based on collected information"
        }
      },
      required: ["themes", "gaps", "strengths", "seoReadiness", "nextSteps", "readiness", "websiteBlocks"]
    };

    // Build context about completed vs incomplete questions
    const sessionContext = sessions.map((s: any) => {
      const unanswered = s.questions.filter((q: any) =>
        !responses.find((r: any) => r.questionId === q.id)
      );
      return `${s.name}: ${s.completedCount}/${s.questions.length} complete${
        unanswered.length > 0 ? `. Unanswered: ${unanswered.map((q: any) => `"${q.text}" (id: ${q.id}, session: ${s.id})`).join(', ')}` : ''
      }`;
    }).join('\n');

    // Build response context
    const responseContext = responses.map((r: any) =>
      `[${r.sessionName}] Q: "${r.questionText}"\nResponse: ${r.transcription}\nKey Insight: ${r.keyInsight || 'None extracted'}`
    ).join('\n\n');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            text: `You are analyzing client interview responses to determine what we can build for their website, SEO strategy, and AI answer optimization (AEO). The goal is to identify what content is ready to use, what gaps need filling, and what website sections we can create.

PROGRESS CONTEXT:
${sessionContext}

RESPONSES SO FAR:
${responseContext}

ANALYSIS INSTRUCTIONS - Focus on SEO/AEO/Website Branding deliverables:

1. THEMES: Identify 2-4 themes that will become:
   - Primary keyword clusters for SEO
   - Core messaging pillars for the website
   - Brand voice characteristics
   Mark strength based on how clearly they've articulated it. Note how it translates to web content.

2. GAPS: Identify what's MISSING that we need for specific deliverables:
   - "Service pricing" → needed for: pricing schema, service pages
   - "Specific client outcomes" → needed for: case studies, testimonials schema
   - "Target audience details" → needed for: persona-targeted landing pages
   - "FAQ-worthy questions" → needed for: FAQ schema, AEO optimization
   - "Competitor differentiation" → needed for: homepage hero, meta descriptions
   Use "you" language. Include useCase for each gap (where this info will be used on the website).
   Priority: high = blocks a major website section, medium = weakens the content, low = nice to have

3. STRENGTHS: What content is READY to turn into website copy?
   - Quote their actual words when possible
   - Specify exactly where to use it: 'homepage headline', 'about section', 'service page hero', 'FAQ answer', 'testimonial', 'schema markup'

4. SEO READINESS: Boolean checklist of what we can build:
   - hasTargetAudience: Can we write persona-targeted content?
   - hasDifferentiator: Is there a clear USP for headlines?
   - hasPricing: Can we add pricing/offer schema?
   - hasServices: Are services defined for service pages?
   - hasProof: Do we have testimonials/results for trust signals?
   - hasFAQContent: Is there FAQ-worthy content for schema/AEO?
   - hasVoice: Is brand voice clear for consistent copy?

5. WEBSITE BLOCKS: For each major section, assess if we can build it:
   - hero: Do we have headline, subhead, CTA?
   - services: Are offerings clearly defined?
   - about: Do we have story, values, personality?
   - testimonials: Do we have client quotes/results?
   - faq: Do we have common questions answered?
   - pricing: Do we have tier/pricing info?
   - cta: Do we have clear call-to-action language?
   Status: "ready" (can write now), "partial" (some info), "missing" (need more)

6. NEXT STEPS: 3-5 specific questions they should answer to UNLOCK website sections:
   - "Answer the pricing question so we can build your pricing page"
   - "Describe a client success story for the testimonials section"

7. READINESS SCORE (0-100) for website-readiness:
   - 0-25: "Gathering Info" - just started, need more responses
   - 26-50: "Building Foundation" - have basics, missing key sections
   - 51-75: "Almost Ready to Build" - can start website, some gaps
   - 76-100: "Ready for Website" - have enough for full site build

Use second-person ("you", "your"). Be specific about what we CAN and CAN'T build yet.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4,
      }
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: "No response from Gemini" });
    }

    const result = JSON.parse(text);

    // Add progress info
    result.overallProgress = {
      percent: Math.round((responses.length / totalQuestions) * 100),
      completed: responses.length,
      total: totalQuestions
    };

    return res.status(200).json(result);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to analyze feedback" });
  }
}
