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
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        transcription: {
          type: Type.STRING,
          description: "The original text, preserved exactly as submitted.",
        },
        summary: {
          type: Type.STRING,
          description: "A concise 1-2 sentence summary that PRESERVES specific details. Include any names, numbers, percentages, dollar amounts, or unique insights mentioned. Never use generic placeholders. Address the person directly using 'you' and 'your'.",
        },
        keyInsight: {
          type: Type.STRING,
          description: "The single most important insight, belief, or pattern revealed about this person. Write it as a clear, actionable statement using 'you' and 'your'. Example: 'You differentiate through speed - your average turnaround is 48 hours vs industry standard 2 weeks.'",
        },
        actionItems: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Concrete action items or recommendations for this person to explore. Only include if clearly actionable. Use 'you' language. Example: ['Consider raising your Tier 2 pricing to $3,500', 'You might stop accepting projects under $1,000']",
        },
        quotable: {
          type: Type.STRING,
          description: "A direct quote (exact words) from the text that would be powerful in marketing materials, case studies, or positioning documents. Only include if genuinely quotable.",
        },
      },
      required: ["transcription", "summary"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            text: `You are helping a business positioning consultant extract structured insights from client responses. Analyze the following text and extract actionable intelligence. Use second-person language ("you", "your") when addressing the insights back to the person.

TEXT TO ANALYZE:
"${text}"

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
- A direct quote from their text that would work in marketing materials or case studies
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

    const responseText = response.text;
    if (!responseText) {
      return res.status(500).json({ error: "No response from Gemini" });
    }

    const result = JSON.parse(responseText);
    return res.status(200).json(result);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to analyze text" });
  }
}
