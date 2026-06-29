/**
 * LOCAL DEV CONFIG
 * ─────────────────────────────────────────────────────────────
 * 1. Copy this file:  config.example.js  →  config.js
 * 2. Fill in real values in config.js
 * 3. Never commit config.js  (it is in .gitignore)
 *
 * In production, GitHub Actions injects these values at build
 * time from repository secrets → Settings → Secrets → Actions.
 */

window.APP_CONFIG = {

  /* ── Workshop registration → Google Sheets ── */
  /* Apps Script URL — see apps-script.js for setup instructions */
  GOOGLE_SHEET_URL: 'https://script.google.com/macros/s/YOUR_WORKSHOP_SCRIPT_ID/exec',

  /* ── Razorpay (workshop payments) ── */
  /* Publishable key — starts with rzp_live_ or rzp_test_ */
  RAZORPAY_KEY_ID: 'rzp_live_YOUR_KEY_ID',

  /* ── GitHub CSV backup ── */
  /* Fine-grained PAT with Contents: Read+Write on this repo */
  GITHUB_TOKEN: 'github_pat_YOUR_TOKEN_HERE',
  GITHUB_REPO:  'karnkeshav/aiproducts',

  /* ── Product leads → Google Sheets ── */
  /* Separate Apps Script URL for product interest capture */
  LEADS_SHEET_URL: 'https://script.google.com/macros/s/YOUR_LEADS_SCRIPT_ID/exec',

};
