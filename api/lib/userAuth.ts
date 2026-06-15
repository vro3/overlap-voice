/**
 * Per-email ownership tokens for accountless user progress
 * v1.0.0 — 2026-06-15
 *
 * On the first save for an email a random bearer token is minted and returned
 * to that client exactly once; only its SHA-256 hash is persisted (Vercel KV).
 * Later reads/writes must present the token. This binds saved answers to
 * whoever created them without requiring real accounts — a new beta user just
 * types their email, saves, and is transparently protected from then on.
 *
 * Outcomes:
 *   unclaimed  → no token on file yet (brand-new email, or a legacy row that
 *                predates this feature). Caller grandfathers reads and claims
 *                on the next save.
 *   authorized → presented token matches the stored hash.
 *   denied     → a token exists for this email but the caller's doesn't match.
 *
 * NOTE: complete protection (secure cross-device return, anti-squatting) needs
 * emailed magic-link verification. This is the non-breaking interim guard.
 */

import { createClient } from '@vercel/kv';
import crypto from 'node:crypto';

const kv = createClient({
  url: process.env.STORAGE_REST_API_URL!,
  token: process.env.STORAGE_REST_API_TOKEN!,
});

const normEmail = (email: string): string => email.toLowerCase().trim();
const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

export type OwnershipResult = 'unclaimed' | 'authorized' | 'denied';

async function getStoredHash(email: string): Promise<string | null> {
  try {
    return await kv.get<string>(`usertoken:${normEmail(email)}`);
  } catch (err) {
    // Fail open: a KV outage degrades to pre-feature behaviour, never a lockout.
    console.error('[userAuth] getStoredHash error:', err);
    return null;
  }
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function checkOwnership(
  email: string,
  token: string | undefined
): Promise<OwnershipResult> {
  const storedHash = await getStoredHash(email);
  if (!storedHash) return 'unclaimed';
  if (token && safeEqual(hashToken(token), storedHash)) return 'authorized';
  return 'denied';
}

/** Mint a token for this email, persist its hash, and return the raw token (shown once). */
export async function claimEmail(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  try {
    await kv.set(`usertoken:${normEmail(email)}`, hashToken(token));
  } catch (err) {
    console.error('[userAuth] claimEmail error:', err);
  }
  return token;
}
