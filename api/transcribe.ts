import { GoogleGenAI, Type, Schema } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { rateLimit, checkOrigin } from './lib/guard.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkOrigin(req, res)) return;
  if (!(await rateLimit(req, res, { key: 'transcribe', limit: 15, windowSec: 60 }))) return;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY not found in environment");
    return res.status(500).json({ error: "API Key not configured" });
  }

  try {
    const { audioBase64, mimeType } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        transcription: {
          type: Type.STRING,
          description: "Verbatim transcription of the audio. Preserve ALL specific details: names, company names, numbers, dollar amounts, percentages, timelines, and technical terms exactly as spoken.",
        },
        summary: {
          type: Type.STRING,
          description: "A concise 1-2 sentence summary that PRESERVES specific details. Address the person directly using 'you' and 'your'. Include any names, numbers, percentages, dollar amounts, or unique insights mentioned. Never use generic placeholders.",
        },
        keyInsight: {
          type: Type.STRING,
          description: "The single most important insight, belief, or pattern revealed about this person. Write using 'you' and 'your' language. Example: 'You differentiate through speed - your average turnaround is 48 hours vs industry standard 2 weeks.'",
        },
        actionItems: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Concrete action items or recommendations for this person to explore. Use 'you' language. Example: ['Consider raising your Tier 2 pricing to $3,500', 'You might stop accepting projects under $1,000']",
        },
        quotable: {
          type: Type.STRING,
          description: "A direct quote (exact words) from the speaker that would be powerful in marketing materials, case studies, or positioning documents. Only include if genuinely quotable.",
        },
      },
      required: ["transcription", "summary"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || "audio/webm",
              data: audioBase64,
            },
          },
          {
            text: `You are helping a business positioning consultant extract structured insights from client voice recordings. Transcribe the audio and extract actionable intelligence. Use second-person language ("you", "your") when addressing the insights back to the person.

TRANSCRIPTION:
- Capture every word exactly as spoken
- Preserve ALL specifics: names, companies, numbers, dollar amounts, percentages, timelines, technical terms

THE GIST (1-2 sentences):
- Summarize what this person shared, addressing them directly with "you"
- Preserve exact figures and names - never generalize "$5,000" to "a fee" or "Sarah at Acme" to "a client"

WHAT THIS MEANS:
- Extract the single most important strategic insight for this person
- Write as a direct statement to them: "You differentiate through X because Y"
- Include relevant numbers/specifics that support the insight

TO EXPLORE (only if clearly implied):
- Concrete, specific things for this person to explore or consider
- Use "you" language: "Consider raising your prices to $X" not "They should raise prices"

IN YOUR WORDS (only if genuinely quotable):
- A direct quote from their recording that would work in marketing materials or case studies
- Must be their exact words, powerful and authentic`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: "No response from Gemini" });
    }

    const result = JSON.parse(text);
    return res.status(200).json(result);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to process audio" });
  }
}
