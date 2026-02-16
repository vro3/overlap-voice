import { createClient } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const kv = createClient({
  url: process.env.STORAGE_REST_API_URL!,
  token: process.env.STORAGE_REST_API_TOKEN!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, progress } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!progress || typeof progress !== 'object') {
      return res.status(400).json({ error: 'Progress data is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const key = `overlap:${normalizedEmail}`;

    const data = {
      ...progress,
      email: normalizedEmail,
      lastSaved: new Date().toISOString(),
    };

    await kv.set(key, data);

    return res.status(200).json({
      success: true,
      lastSaved: data.lastSaved,
    });
  } catch (error) {
    console.error('Error saving user data:', error);
    return res.status(500).json({ error: 'Failed to save user data' });
  }
}
