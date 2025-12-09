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
              name: { type: Type.STRING, description: "Theme name, e.g. 'Speed & Efficiency'" },
              mentions: { type: Type.NUMBER, description: "How many times this theme appears" },
              strength: { type: Type.STRING, description: "One of: strong, emerging, weak" },
              details: { type: Type.STRING, description: "Brief explanation of this theme in their responses" }
            },
            required: ["name", "mentions", "strength", "details"]
          },
          description: "Key themes emerging from responses"
        },
        gaps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              area: { type: Type.STRING, description: "What's missing, e.g. 'Pricing specifics'" },
              suggestion: { type: Type.STRING, description: "What they should elaborate on, using 'you' language" },
              priority: { type: Type.STRING, description: "One of: high, medium, low" },
              relatedQuestionId: { type: Type.STRING, description: "ID of a related unanswered question if applicable" },
              relatedSessionId: { type: Type.STRING, description: "ID of the session containing the related question" }
            },
            required: ["area", "suggestion", "priority"]
          },
          description: "Areas that need more detail or elaboration"
        },
        strengths: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              area: { type: Type.STRING, description: "What they're doing well" },
              evidence: { type: Type.STRING, description: "Specific example from their responses" }
            },
            required: ["area", "evidence"]
          },
          description: "Areas where they've provided strong, clear positioning"
        },
        nextSteps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3-5 concrete next steps to strengthen their positioning"
        },
        readiness: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "0-100 score for positioning readiness" },
            label: { type: Type.STRING, description: "e.g. 'Getting Started', 'Making Progress', 'Almost There', 'Ready'" },
            message: { type: Type.STRING, description: "Personalized message about their current state, using 'you' language" }
          },
          required: ["score", "label", "message"]
        }
      },
      required: ["themes", "gaps", "strengths", "nextSteps", "readiness"]
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
            text: `You are a business positioning consultant analyzing a client's interview responses in real-time. Your job is to identify patterns, gaps, and provide actionable feedback to help them articulate their positioning more clearly.

PROGRESS CONTEXT:
${sessionContext}

RESPONSES SO FAR:
${responseContext}

ANALYSIS INSTRUCTIONS:

1. THEMES: Identify 2-4 recurring themes across their responses. Look for:
   - Repeated concepts, values, or differentiators
   - Consistent language patterns
   - Underlying beliefs about their work
   Mark strength as "strong" (3+ clear mentions), "emerging" (2 mentions), or "weak" (1 vague mention)

2. GAPS: Identify 2-4 areas needing elaboration. Look for:
   - Vague statements that need specifics (e.g., "we're different" without explaining how)
   - Missing quantifiable details (pricing, timelines, results)
   - Contradictions or unclear positioning
   - Important unanswered questions from the list above
   Use "you" language in suggestions. Prioritize as "high" (critical for positioning), "medium" (would strengthen), "low" (nice to have)
   If suggesting they answer a specific unanswered question, include its relatedQuestionId and relatedSessionId

3. STRENGTHS: Identify 2-3 things they're articulating well. Look for:
   - Clear, specific statements about their value
   - Authentic voice and perspective
   - Concrete examples or results
   Include a brief quote or paraphrase as evidence

4. NEXT STEPS: Suggest 3-5 specific actions to strengthen positioning. Be concrete:
   - "Quantify your typical project timeline" not "Add more specifics"
   - "Describe your ideal client's budget range" not "Think about pricing"

5. READINESS: Score 0-100 based on:
   - Clarity of who they serve (25 points)
   - Clarity of what they do differently (25 points)
   - Specific details and examples (25 points)
   - Authentic voice/perspective (25 points)
   Labels: 0-25 "Getting Started", 26-50 "Building Foundation", 51-75 "Making Progress", 76-90 "Almost There", 91-100 "Ready"
   Message should be encouraging and specific about what would move the needle most.

Remember: Use second-person language ("you", "your") throughout. Be specific, not generic. Reference their actual words when possible.`
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
