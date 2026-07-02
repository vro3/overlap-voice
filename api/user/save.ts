/**
 * Save user progress to Google Sheets
 * v3.0.0 — 2026-06-15 (ownership-token guard + origin/rate-limit)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { saveUserProgress } from '../lib/sheets.js';
import { rateLimit, checkOrigin } from '../lib/guard.js';
import { checkOwnership, claimEmail } from '../lib/userAuth.js';

export const config = {
  api: { bodyParser: { sizeLimit: '1mb' } },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkOrigin(req, res)) return;
  if (!(await rateLimit(req, res, { key: 'user-save', limit: 60, windowSec: 60 }))) return;

  try {
    const { email, progress, token } = req.body as {
      email?: string;
      progress?: unknown;
      token?: string;
    };

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!progress || typeof progress !== 'object') {
      return res.status(400).json({ error: 'Progress data is required' });
    }

    const ownership = await checkOwnership(email, token);
    if (ownership === 'denied') {
      return res.status(403).json({
        error: 'This email is already claimed by another device. Cloud save is disabled here.',
      });
    }

    // Persist the answers FIRST. Only mint the ownership token once the write
    // has succeeded — otherwise a failed Sheets write would leave a token hash
    // in KV that no client possesses, permanently locking the email's cloud data.
    const lastSaved = await saveUserProgress(
      email,
      progress as Parameters<typeof saveUserProgress>[1]
    );

    // First save for this email (brand-new or legacy row) claims it and gets a token back.
    let issuedToken: string | undefined;
    if (ownership === 'unclaimed') {
      issuedToken = await claimEmail(email);
    }

    return res.status(200).json({ success: true, lastSaved, token: issuedToken });
  } catch (error) {
    console.error('Error saving user data:', error);
    return res.status(500).json({ error: 'Failed to save user data' });
  }
}
