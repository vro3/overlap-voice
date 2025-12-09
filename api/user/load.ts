import { createClient } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface UserData {
  email: string;
  sessions: any[];
  activeSessionId: string;
  lastUpdated: string;
}

// Create KV client with STORAGE prefix env vars
const kv = createClient({
  url: process.env.STORAGE_REST_API_URL!,
  token: process.env.STORAGE_REST_API_TOKEN!,
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
    const key = `user:${normalizedEmail}`;

    const userData = await kv.get<UserData>(key);

    if (userData) {
      return res.status(200).json({
        exists: true,
        data: userData
      });
    } else {
      return res.status(200).json({
        exists: false,
        data: null
      });
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    return res.status(500).json({ error: 'Failed to load user data' });
  }
}
