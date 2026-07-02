# Cloud backup — plan for when Vince is ready

**Status:** parked (Vince: "eventually I'll need to cloud back this up" — 2026-07-02)
**Not urgent.** The app is on-device-only today and that's intentional. This is the plan for adding a durable cloud copy later, without a rewrite.

## Why this is a small add, not a rewrite
All persistence is isolated in `hooks/useAutoSave.ts` (localStorage read/write/flush) and the shape is `SavedProgress` in `types.ts`. Adding cloud = writing the same `SavedProgress` blob to a second place inside `saveProgress`/`flush`, and reading it in `loadProgress`. Nothing else in the app changes.

## Recommended approach: Firestore
- **Why Firestore:** already in Vince's Firebase ecosystem (vCommand uses it), rock-solid, effectively free at this scale, per-document atomic writes (no full-table-scan problem the old Google Sheets path had), and the client SDK writes directly from the browser so no serverless backend is needed.
- **Key each respondent by a generated resume id** (a random id stored in localStorage + optionally in the URL as `?r=<id>`), NOT by email. This avoids the old "type someone's email, see their answers" hole and makes cross-device resume work by keeping the link.
- **Keep localStorage as the instant layer.** Firestore is the durable backup + cross-device path; localStorage stays the zero-latency primary. Both get written on save; on load, prefer whichever is newer by `lastSaved`.

## Concrete steps when starting
1. Create/choose a Firebase project; enable Firestore. Add the web SDK config as Vite env vars (client-side, safe to ship) — `VITE_FIREBASE_*`.
2. Add `firebase` dep; init the app + Firestore in a small `services/firestore.ts`.
3. In `useAutoSave.ts`: on write, also `setDoc(doc(db,'responses',resumeId), data)`; add a `loadFromCloud(resumeId)`.
4. Generate/persist a `resumeId` (localStorage `overlap_resume_id`; reflect in URL so a bookmarked link resumes on any device).
5. Firestore security rules: allow read/write only to a doc whose id matches the caller's resume id (or open write + unguessable ids for a beta — decide based on sensitivity).
6. On mount: load local + cloud, take the newer. Show a subtle "Synced" state next to the existing "Saved on this device" pill.

## Cheaper alternatives if Firestore feels heavy
- **Re-provision Vercel KV / Upstash Redis** and store the blob by resume id (simpler than Sheets, no scan problem). The old KV store was decommissioned; a fresh one is a few minutes to set up.
- **Supabase** (hosted Postgres) if Vince wants SQL/table views of responses.

## Bridge that already exists today
The sidebar has a **JSON backup download + restore** — a respondent can save a file and re-import it on any device right now. That's the manual version of what cloud automates.

## Env-var note
When cloud goes in, the app needs new `VITE_FIREBASE_*` (or KV) vars. The OLD vars from the removed Sheets/KV backend (`STORAGE_REST_API_URL/TOKEN`, `GOOGLE_SERVICE_ACCOUNT_JSON`, `GOOGLE_SHEETS_ID`, `CRON_SECRET`, `API_KEY`) are all unused now and can be deleted from Vercel.
