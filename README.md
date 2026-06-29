# AI4Everyone — Product Manual

A full-stack web platform for AI education workshops and AI-built product showcases. Built entirely using AI tools by a non-coder with 22 years of IT experience across TechMahindra, Wipro, IBM, Kyndryl, and PwC.

---

## What It Does

AI4Everyone serves two purposes:

1. **Workshop Registration & Payment** — Users enroll in one of three AI learning tracks and pay via Razorpay (UPI, cards, net banking).
2. **AI Products Showcase & Lead Capture** — Nine AI-built tools are showcased with interest/enquiry forms that capture leads into Google Sheets and GitHub CSV files.

The site is a single-page app with no frameworks — pure vanilla JavaScript, HTML, and CSS. All deployment and secret management is automated via GitHub Actions and hosted on GitHub Pages.

---

## File Reference

```
AI4Everyone/
├── index.html              Entry point; loads config.js and app.js
├── app.js                  All app logic, CSS (~550 lines), and HTML DOM (~1,612 lines total)
├── config.example.js       Template for required secrets (copy to config.js for local dev)
├── config.js               Auto-generated at build time by GitHub Actions (not committed)
│
├── workshop-script.js      Google Apps Script for capturing workshop registrations to Google Sheet
├── leads-script.js         Google Apps Script for capturing product leads to Google Sheet
│
├── setup-guide.html        Interactive 4-step setup guide with live endpoint health checks
│
├── registrations/          Daily CSV backups of workshop sign-ups (YYYY-MM-DD.csv)
├── leads/                  Daily CSV backups of product enquiries (YYYY-MM-DD.csv)
│
└── .github/
    └── workflows/
        └── deploy.yml      CI/CD pipeline: injects secrets → builds dist/ → deploys to GitHub Pages
```

### Key File Details

| File | Role |
|------|------|
| `app.js` | Entire frontend: UI rendering, form logic, Razorpay integration, API calls to Google Sheets and GitHub |
| `workshop-script.js` | Deployed as a Google Apps Script Web App; receives POST from app.js on payment success; writes row to "AI Workshop Registrations" Google Sheet |
| `leads-script.js` | Deployed as a Google Apps Script Web App; receives POST from lead capture forms; writes row to "AI Products Leads" Google Sheet |
| `deploy.yml` | On every push to `main`: injects 4 GitHub secrets into `config.js`, embeds it inline into `index.html`, copies files to `dist/`, deploys to GitHub Pages |
| `config.example.js` | Shows the 4 required secrets; copy and fill in for local testing |

---

## Architecture

```
User Browser
    │
    ├─── Razorpay Checkout Modal (payment)
    │         │
    │         └─── On success → app.js POSTs to:
    │                   ├── Google Apps Script (workshop-script.js) → Google Sheet
    │                   └── GitHub API → registrations/YYYY-MM-DD.csv
    │
    └─── Lead Capture Form → app.js POSTs to:
              ├── Google Apps Script (leads-script.js) → Google Sheet
              └── (no CSV backup for leads currently)

Code Push (main branch)
    └── GitHub Actions (deploy.yml)
          ├── Injects secrets into config.js
          ├── Embeds config inline into index.html
          ├── Copies to dist/
          └── Deploys to GitHub Pages
```

**Technologies:**
- Frontend: Vanilla JS, CSS (no frameworks)
- Payment: Razorpay
- Backend: Google Apps Script (serverless webhooks)
- Storage: Google Sheets + GitHub CSV files
- Hosting: GitHub Pages
- CI/CD: GitHub Actions
- External libs (CDN): Razorpay checkout.js, QRCode.js, Google Fonts

---

## Workflow

### Workshop Registration Flow

1. User lands on the page and clicks **"Reserve My Seat"**
2. Selects a plan:
   | Plan | Duration | Price |
   |------|----------|-------|
   | Track A | 5 days | ₹1,500 |
   | Track B | 10 days | ₹3,500 |
   | Track C | 7 days | ₹2,500 |
   | Combo | 22 days | ₹6,499 |
3. Selects a batch:
   - **Weekday** — Mon–Fri, 8–10 PM IST
   - **Weekend** — Sat–Sun, 10 AM–1 PM IST
4. Fills in: Name, Email, WhatsApp number
5. Pays via Razorpay (UPI / card / net banking)
6. On payment success:
   - Data is POSTed to the Google Apps Script → saved to Google Sheet
   - Data is also written to `registrations/YYYY-MM-DD.csv` via GitHub API
   - User sees a confirmation screen with the Razorpay payment ID

**Data captured:** Timestamp (IST), Name, Email, Phone, Plan, Batch, Amount (INR), Razorpay Payment ID

### Product Lead Capture Flow

1. User browses the AI Products section
2. Clicks **"I'm Interested"** on any product card
3. Fills in: Name, WhatsApp number, Email (optional), Message
4. On submit:
   - Data is POSTed to the leads Google Apps Script → saved to Google Sheet
   - User sees a success confirmation

**Data captured:** Timestamp (IST), Product Name, Name, Phone, Email, Message

---

## The 9 AI Products

| Product | Description |
|---------|-------------|
| Resume Builder | Tailors resumes to specific job descriptions |
| Ready4Exam Portal | Self-serve exam prep platform (free + paid tiers) |
| TeluguBuddy | Bilingual language learning, chapter by chapter |
| SEO Optimization Tool | YouTube/blog keyword discovery and content optimization |
| Patent Assistant | Provisional patent drafting and prior art search |
| WhatsApp Marketing App | Bulk personalized campaign messaging |
| Sector-Specific Marketing | Automated outreach for colleges and universities |
| Custom App Development | Web apps, Android APKs, bots, and AI agents |
| Ready4Launch — TextToApp | Queue-based AI text-to-app generator (₹499 / 5-day slot) |

---

## Configuration & Secrets

Four secrets must be configured in **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `GOOGLE_SHEET_URL` | Web App URL from deployed `workshop-script.js` |
| `RAZORPAY_KEY_ID` | Razorpay publishable key (`rzp_live_*` or `rzp_test_*`) |
| `CSV_GITHUB_TOKEN` | Fine-grained GitHub PAT with Contents Read+Write on this repo |
| `LEADS_SHEET_URL` | Web App URL from deployed `leads-script.js` |

At build time, `deploy.yml` injects these into `config.js` and embeds it inline into `index.html` so no separate HTTP request is needed at runtime.

For **local development**, copy `config.example.js` to `config.js` and fill in your values.

---

## Setup Guide (One-Time)

1. **Create two Google Sheets:**
   - `AI Workshop Registrations`
   - `AI Products Leads`

2. **Deploy Apps Scripts:**
   - In each sheet: Extensions → Apps Script → paste the respective `.js` file → Deploy as Web App (access: Anyone)
   - Copy the Web App URLs

3. **Generate a GitHub PAT:**
   - Settings → Developer settings → Fine-grained tokens
   - Scope: Contents Read + Write on this repository only

4. **Add the 4 secrets** to GitHub Actions (see table above)

5. **Push to `main`** — GitHub Actions builds and deploys automatically

6. **Test:** Use Razorpay test mode (`rzp_test_*`) with card `4111 1111 1111 1111`

The interactive `setup-guide.html` walks through all steps with live health-check buttons to verify each endpoint.

---

## Local Development

```
# No build tools or npm needed

1. Copy config.example.js to config.js and fill in your values
2. Open index.html directly in your browser
```

Everything runs client-side. The only requirement is a browser and a filled `config.js`.

---

## Data Storage

User data is stored in three places simultaneously:

| Store | What | File/Location |
|-------|------|---------------|
| Google Sheets | Workshop registrations | "AI Workshop Registrations" sheet |
| Google Sheets | Product leads | "AI Products Leads" sheet |
| GitHub repo | Workshop registrations | `registrations/YYYY-MM-DD.csv` |

CSV files in `registrations/` are date-stamped and committed to the repo, providing a version-controlled audit trail of all enrollments.

---

## UI Features

- Dark theme (deep purples, indigos, oranges)
- Responsive layout (1-col mobile → 3-4 col desktop)
- Sticky navigation with scroll-depth progress bar
- Bottom sheet modals (drag-to-dismiss on mobile) for forms
- Smooth section scrolling with tab navigation
- Fade-in animations via Intersection Observer
- Multi-step form with dot progress indicators
- Inline form validation with error states
