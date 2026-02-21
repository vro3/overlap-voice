/**
 * Setup script for Overlap Voice Google Sheets storage
 * v1.0.0 — 2026-02-21
 *
 * Run: node setup-sheet.mjs
 *
 * Creates a new Google Sheet with correct headers and shares it
 * with your Google account. Outputs the Sheet ID and Vercel env commands.
 */

import { JWT } from 'google-auth-library';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load service account creds from vrcg-system
let serviceAccountJson;
try {
  const envFile = readFileSync(resolve(__dirname, '../vrcg-system/core/dashboard/.env.vercel'), 'utf-8');
  const match = envFile.match(/GOOGLE_SERVICE_ACCOUNT_JSON="([\s\S]+?)"\s*$/m);
  if (match) {
    serviceAccountJson = JSON.parse(match[1].replace(/\\n/g, '\n'));
  }
} catch (e) {
  console.error('Could not read vrcg-system env file:', e.message);
}

if (!serviceAccountJson) {
  console.error('Could not find GOOGLE_SERVICE_ACCOUNT_JSON');
  process.exit(1);
}

console.log(`Using service account: ${serviceAccountJson.client_email}\n`);

const auth = new JWT({
  email: serviceAccountJson.client_email,
  key: serviceAccountJson.private_key,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
  ],
});

const { access_token } = await auth.authorize();

async function api(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

// 1. Create spreadsheet with headers
console.log('Creating "Overlap Voice — User Answers"...');

const spreadsheet = await api('https://sheets.googleapis.com/v4/spreadsheets', {
  properties: { title: 'Overlap Voice — User Answers' },
  sheets: [{
    properties: {
      title: 'Users',
      gridProperties: { frozenRowCount: 1 },
    },
    data: [{
      startRow: 0,
      startColumn: 0,
      rowData: [{
        values: ['email', 'routerAnswer', 'currentStep', 'currentScreen', 'answers', 'lastSaved'].map(h => ({
          userEnteredValue: { stringValue: h },
          userEnteredFormat: { textFormat: { bold: true } },
        })),
      }],
    }],
  }],
});

const sheetId = spreadsheet.spreadsheetId;
const sheetUrl = spreadsheet.spreadsheetUrl;
console.log(`Created: ${sheetUrl}\n`);

// 2. Share with Vince
try {
  await api(`https://www.googleapis.com/drive/v3/files/${sheetId}/permissions`, {
    type: 'user',
    role: 'writer',
    emailAddress: 'vromanelli@gmail.com',
  });
  console.log('Shared with vromanelli@gmail.com (editor)\n');
} catch (e) {
  console.log(`Could not auto-share: ${e.message}`);
  console.log(`Share manually from: ${sheetUrl}\n`);
}

// 3. Write to local .env.local
const envPath = resolve(__dirname, '.env.local');
let envContent = readFileSync(envPath, 'utf-8');
if (envContent.includes('GOOGLE_SHEETS_ID')) {
  envContent = envContent.replace(/GOOGLE_SHEETS_ID=.*/, `GOOGLE_SHEETS_ID="${sheetId}"`);
} else {
  envContent += `\nGOOGLE_SHEETS_ID="${sheetId}"\n`;
}
if (!envContent.includes('GOOGLE_SERVICE_ACCOUNT_JSON')) {
  envContent += `GOOGLE_SERVICE_ACCOUNT_JSON='${JSON.stringify(serviceAccountJson)}'\n`;
}
const { writeFileSync } = await import('fs');
writeFileSync(envPath, envContent);
console.log('Updated .env.local with GOOGLE_SHEETS_ID\n');

// 4. Output next steps
console.log('='.repeat(60));
console.log('DONE! Next steps:');
console.log('='.repeat(60));
console.log(`\nSheet ID: ${sheetId}\n`);
console.log('Add these env vars to Vercel:\n');
console.log('  npx vercel env add GOOGLE_SHEETS_ID');
console.log(`    → ${sheetId}\n`);
console.log('  npx vercel env add GOOGLE_SERVICE_ACCOUNT_JSON');
console.log('    → paste the full JSON from vrcg-system .env.vercel\n');
console.log('Then deploy:');
console.log('  npx vercel --prod\n');
