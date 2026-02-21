/**
 * Google Sheets persistence layer for Overlap Voice
 * v1.0.0 — 2026-02-21
 *
 * Replaces dead Upstash Redis with Google Sheets for user answer storage.
 * Uses service account auth via google-spreadsheet package.
 */

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

interface UserRow {
  email: string;
  routerAnswer: string;
  currentStep: string;
  currentScreen: string;
  answers: string; // JSON string
  lastSaved: string;
}

let _doc: GoogleSpreadsheet | null = null;

function getCredentials(): { client_email: string; private_key: string } {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!json) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var not set');

  let parsed: { client_email: string; private_key: string };
  try {
    parsed = JSON.parse(json);
  } catch {
    // Fallback: env var might have literal \n that broke JSON.parse
    parsed = JSON.parse(json.replace(/\n/g, '\\n'));
  }
  // Ensure private_key has real newlines (PEM format requires them)
  parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  return { client_email: parsed.client_email, private_key: parsed.private_key };
}

async function getDoc(): Promise<GoogleSpreadsheet> {
  if (_doc) return _doc;

  const sheetId = process.env.GOOGLE_SHEETS_ID;
  if (!sheetId) throw new Error('GOOGLE_SHEETS_ID env var not set');

  const creds = getCredentials();
  const auth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  _doc = new GoogleSpreadsheet(sheetId, auth);
  await _doc.loadInfo();
  return _doc;
}

async function getUsersSheet() {
  const doc = await getDoc();
  let sheet = doc.sheetsByTitle['Users'];
  if (!sheet) {
    sheet = doc.sheetsByIndex[0];
  }
  return sheet;
}

export async function saveUserProgress(
  email: string,
  progress: { routerAnswer?: string; currentStep?: string; currentScreen?: string; answers?: Record<string, string> }
): Promise<string> {
  const sheet = await getUsersSheet();
  const rows = await sheet.getRows<UserRow>();
  const normalizedEmail = email.toLowerCase().trim();
  const now = new Date().toISOString();

  const existing = rows.find(
    (r) => r.get('email')?.toLowerCase().trim() === normalizedEmail
  );

  if (existing) {
    existing.set('routerAnswer', progress.routerAnswer || '');
    existing.set('currentStep', progress.currentStep || '');
    existing.set('currentScreen', progress.currentScreen || '');
    existing.set('answers', JSON.stringify(progress.answers || {}));
    existing.set('lastSaved', now);
    await existing.save();
  } else {
    await sheet.addRow({
      email: normalizedEmail,
      routerAnswer: progress.routerAnswer || '',
      currentStep: progress.currentStep || '',
      currentScreen: progress.currentScreen || '',
      answers: JSON.stringify(progress.answers || {}),
      lastSaved: now,
    });
  }

  return now;
}

export async function loadUserProgress(
  email: string
): Promise<{
  email: string;
  routerAnswer: string;
  currentStep: string;
  currentScreen: string;
  answers: Record<string, string>;
  lastSaved: string;
} | null> {
  const sheet = await getUsersSheet();
  const rows = await sheet.getRows<UserRow>();
  const normalizedEmail = email.toLowerCase().trim();

  const row = rows.find(
    (r) => r.get('email')?.toLowerCase().trim() === normalizedEmail
  );

  if (!row) return null;

  let answers: Record<string, string> = {};
  try {
    answers = JSON.parse(row.get('answers') || '{}');
  } catch {
    answers = {};
  }

  return {
    email: row.get('email') || normalizedEmail,
    routerAnswer: row.get('routerAnswer') || '',
    currentStep: row.get('currentStep') || '',
    currentScreen: row.get('currentScreen') || '',
    answers,
    lastSaved: row.get('lastSaved') || '',
  };
}
