/**
 * Shared request guards for public API endpoints
 * v1.0.0 — 2026-06-15
 *
 * - rateLimit(): per-IP fixed-window counter via Vercel KV. Fails OPEN on KV
 *   error so a storage hiccup can never take the app down.
 * - checkOrigin(): optional Origin/Referer allowlist. No-op unless the
 *   ALLOWED_ORIGINS env var is set (keeps local/preview working by default).
 */

import { createClient } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const kv = createClient({
  url: process.env.STORAGE_REST_API_URL!,
  token: process.env.STORAGE_REST_API_TOKEN!,
});

function clientIp(req: VercelRequest): string {
  // `x-real-ip` is set by Vercel's edge to the true client IP and overwrites any
  // client-supplied value — trust it first. `x-forwarded-for` is a client-
  // prependable chain, so the FIRST entry is attacker-controlled; only the LAST
  // hop (appended by the platform) is trustworthy. Keying on the first entry
  // would let an attacker rotate the header into unlimited fresh rate buckets.
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) return realIp.trim();

  const xff = req.headers['x-forwarded-for'];
  const chain = Array.isArray(xff) ? xff.join(',') : xff;
  if (typeof chain === 'string' && chain.trim()) {
    const parts = chain.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return (req.socket as { remoteAddress?: string })?.remoteAddress || 'unknown';
}

interface RateLimitOpts {
  /** Logical bucket name, e.g. 'transcribe' — combined with the caller IP. */
  key: string;
  /** Max requests allowed per window. */
  limit: number;
  /** Window length in seconds. */
  windowSec: number;
}

/** Returns true if the request may proceed; false if rate-limited (429 already sent). */
export async function rateLimit(
  req: VercelRequest,
  res: VercelResponse,
  opts: RateLimitOpts
): Promise<boolean> {
  try {
    const bucket = `rl:${opts.key}:${clientIp(req)}`;
    const count = await kv.incr(bucket);
    if (count === 1) {
      await kv.expire(bucket, opts.windowSec);
    }
    if (count > opts.limit) {
      res.setHeader('Retry-After', String(opts.windowSec));
      res.status(429).json({ error: 'Too many requests. Please slow down and try again shortly.' });
      return false;
    }
    return true;
  } catch (err) {
    // Never take the app down because the limiter's backing store hiccuped.
    console.error('[guard] rateLimit error (failing open):', err);
    return true;
  }
}

/** Returns true if the Origin is allowed; false if blocked (403 already sent). */
export function checkOrigin(req: VercelRequest, res: VercelResponse): boolean {
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Not configured → don't block (keeps local dev and preview deploys working).
  if (allowed.length === 0) return true;

  const origin = String(req.headers.origin || req.headers.referer || '');
  if (origin && allowed.some((a) => origin === a || origin.startsWith(a + '/'))) {
    return true;
  }
  res.status(403).json({ error: 'Forbidden origin' });
  return false;
}
