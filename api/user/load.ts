/**
 * Load user progress from Google Sheets
 * v3.0.0 — 2026-06-15 (ownership-token guard + origin/rate-limit)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadUserProgress } from '../lib/sheets.js';
import { rateLimit, checkOrigin } from '../lib/guard.js';
import { checkOwnership } from '../lib/userAuth.js';

export const config = {
  api: { bodyParser: { sizeLimit: '1mb' } },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkOrigin(req, res)) return;
  if (!(await rateLimit(req, res, { key: 'user-load', limit: 30, windowSec: 60 }))) return;

  try {
    const { email, token } = req.body as { email?: string; token?: string };

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    const ownership = await checkOwnership(email, token);
    if (ownership === 'denied') {
      // A token exists for this email but the caller's doesn't match —
      // don't reveal the data. (Client falls back to its localStorage copy.)
      return res.status(200).json({ exists: true, locked: true, data: null });
    }

    // 'authorized' (token matches) or 'unclaimed' (legacy row, grandfathered).
    const data = await loadUserProgress(email);

    if (data) {
      return res.status(200).json({ exists: true, locked: false, data });
    }
    return res.status(200).json({ exists: false, locked: false, data: null });
  } catch (error) {
    console.error('Error loading user data:', error);
    return res.status(500).json({ error: 'Failed to load user data' });
  }
}
