import { createClient } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const key = `overlap:${normalizedEmail}`;

    const data = await kv.get(key);

    if (data) {
      return res.status(200).json({ exists: true, data });
    } else {
      return res.status(200).json({ exists: false, data: null });
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    return res.status(500).json({ error: 'Failed to load user data' });
  }
}
