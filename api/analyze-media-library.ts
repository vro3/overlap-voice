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
    const { mediaList } = req.body;

    if (!mediaList || typeof mediaList !== 'string') {
      return res.status(400).json({ error: 'Media list is required' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        parsedMedia: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              type: {
                type: Type.STRING,
                description: "book, podcast, blog, video, article, or other"
              },
              keyThemes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 main themes from this source"
              }
            },
            required: ["title", "type"]
          },
          description: "Parsed list of media sources mentioned"
        },
        commonThemes: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3-5 recurring themes across all sources. Be specific: 'systems thinking and long-term optimization' not 'success mindset'"
        },
        languagePatterns: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "2-4 patterns in how these sources communicate. Examples: 'Direct, no-BS communication', 'Principles over tactics', 'Storytelling-driven'"
        },
        mentalModels: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "2-4 mental models or frameworks reflected across sources. Examples: 'First principles thinking', 'Compounding effects', 'Anti-fragility'"
        },
        valuesAlignment: {
          type: Type.STRING,
          description: "A 2-3 sentence summary of what these content choices reveal about the person's values and approach to work. Use 'you' and 'your'. Be specific and actionable."
        },
        businessAlignment: {
          type: Type.STRING,
          description: "How this media diet connects to how they talk about their own work. Use 'you' and 'your'. Point out specific patterns. Example: 'Your influences emphasize patience and systems, which shows up in how you describe your work as transformation over tactics.'"
        },
        recommendedDirection: {
          type: Type.STRING,
          description: "Based on these influences, suggest 1-2 specific positioning directions or messaging approaches that would resonate. Be concrete and actionable."
        }
      },
      required: ["parsedMedia", "commonThemes", "valuesAlignment", "businessAlignment"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            text: `You are analyzing someone's media influences to extract patterns that reveal how they think about their work.

MEDIA THEY RESONATE WITH:
${mediaList}

YOUR TASK:
1. Parse each item (book, podcast, blog, video, etc.) - extract title, author if mentioned, and type
2. For each source, identify 2-3 key themes
3. Look across ALL sources to find:
   - Common themes (what ideas keep showing up?)
   - Language patterns (how do these sources communicate? Direct? Storytelling? Principle-based?)
   - Mental models (what frameworks appear repeatedly? First principles? Compounding? Systems thinking?)
4. Synthesize what this media diet reveals about the PERSON:
   - What values do these choices reflect?
   - How does this show up in how they talk about their own work?
   - What positioning direction would align with these influences?

IMPORTANT:
- Be specific, not generic. "Systems thinking and long-term optimization" > "positive mindset"
- Look for PATTERNS across sources, not isolated mentions
- Connect their influences to their business/work positioning
- Use "you" and "your" when addressing insights back to them
- If they listed specific episodes, quotes, or chapters, pay extra attention to those

Example good analysis:
"Your influences (Atomic Habits, Naval Ravikant, Seth Godin) emphasize patience, systems, and contrarian thinking. This shows up in how you describe your work - you focus on transformation and outcomes, not tactics and quick wins. Your positioning should lean into being the 'long game' option - the choice for clients who want sustainable results, not fast hacks."

Example bad analysis:
"You like business books and podcasts about success. This means you value growth."`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, // Slightly higher for creative pattern recognition
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
    return res.status(500).json({ error: "Failed to analyze media library" });
  }
}
