import { GoogleGenAI, Type, Schema } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

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
          description: "A concise 1-2 sentence summary that PRESERVES specific details. Include any names, numbers, percentages, dollar amounts, or unique insights mentioned. Never use generic placeholders.",
        },
        keyInsight: {
          type: Type.STRING,
          description: "The single most important insight, belief, or pattern revealed. Write it as a clear, actionable statement a consultant could use. Example: 'Clients choose them for speed over quality - average turnaround is 48 hours vs industry standard 2 weeks.'",
        },
        actionItems: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Concrete action items or recommendations implied by what was said. Only include if clearly actionable. Example: ['Raise Tier 2 pricing to $3,500', 'Stop accepting projects under $1,000']",
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
            text: `You are helping a business positioning consultant extract structured insights from client voice recordings. Transcribe the audio and extract actionable intelligence.

TRANSCRIPTION:
- Capture every word exactly as spoken
- Preserve ALL specifics: names, companies, numbers, dollar amounts, percentages, timelines, technical terms

SUMMARY (1-2 sentences):
- Preserve exact figures and names - never generalize "$5,000" to "a fee" or "Sarah at Acme" to "a client"
- Focus on the main point with supporting specifics

KEY INSIGHT:
- Extract the single most important strategic insight for consulting work
- Write as an actionable statement: "Their differentiator is X because Y"
- Include relevant numbers/specifics that support the insight

ACTION ITEMS (only if clearly implied):
- Concrete, specific next steps the client should take
- Include numbers where mentioned: "Raise prices to $X" not "Raise prices"

QUOTABLE (only if genuinely quotable):
- A direct quote from the speaker that would work in marketing materials or case studies
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
