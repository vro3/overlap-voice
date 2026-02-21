/**
 * Load user progress from Google Sheets
 * v2.0.0 — 2026-02-21 (migrated from Vercel KV/Redis)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadUserProgress } from '../lib/sheets.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    const data = await loadUserProgress(email);

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
