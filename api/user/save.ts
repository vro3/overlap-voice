/**
 * Save user progress to Google Sheets
 * v2.0.0 — 2026-02-21 (migrated from Vercel KV/Redis)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { saveUserProgress } from '../lib/sheets.js';

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

    const lastSaved = await saveUserProgress(email, progress);

    return res.status(200).json({
      success: true,
      lastSaved,
    });
  } catch (error) {
    console.error('Error saving user data:', error);
    return res.status(500).json({ error: 'Failed to save user data' });
  }
}
