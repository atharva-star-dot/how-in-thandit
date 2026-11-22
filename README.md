# How In थंडीत 🌫️

**A GenAI-powered winter smog and air pollution guide for Indian families and communities.**

Built for [hack2Skill](https://hack2skill.com) · Powered by **Google Gemini API** · Developed with **Google Antigravity + GitHub Spec Kit**

---

## What It Does

Indian families face dangerously poor air quality every winter — especially in northern and central India. How In थंडीत (pronounced *How In Thandi*, meaning *"How in the cold"*) gives every household a **live, personalized, low-cost action plan** in their own language.

### Features

| # | Feature | Detail |
|---|---|---|
| 1 | **Live Air Snapshot** | AQI, PM2.5, and PM10 for any Indian city via Open-Meteo — color-coded hero card with CPCB bands (Good → Severe) and plain-language meaning |
| 2 | **Household Profile** | Children, elders, respiratory conditions, commute mode, home type, purifier ownership, cooking fuel, budget — stored **only in the browser**, zero server storage |
| 3 | **Gemini Daily Plan** | 4-section personalized plan — Commute Routine · Indoor Air Hacks · Kids & Elders Care · Sustainable Alternatives — each tip has an Impact badge (Low / Medium / High) and a *"Why this helps"* explanation |
| 4 | **AI Chat Assistant** | "Ask How In थंडीत" — grounded follow-up Q&A with safety guardrails that refuse medical diagnosis or drug dosing |
| 5 | **Multilingual** | English · हिंदी · मराठी — toggle updates the full UI and instructs Gemini to respond in the chosen language |
| 6 | **Community Card** | Shareable digest for housing societies and schools — AQI + top 3 actions, copy to clipboard or share via any app |
| 7 | **Resilient by Design** | Rule-based fallback plan if Gemini is unavailable, in-memory IP rate limiting, graceful error states, mobile-first UI |

---

## Tech Stack

### GenAI

| Component | Technology |
|---|---|
| **Plan generation** | Google Gemini API (`gemini-1.5-flash`) — schema-constrained JSON output validated with **Zod**, grounded in live AQI + household profile |
| **Follow-up chat** | Google Gemini API — contextual Q&A with a constitution system prompt (no medical advice, hedged impact claims, low-cost Indian context) |
| **Safety guardrails** | Keyword interception for medical dosing/diagnosis queries; Gemini system prompt enforces all 7 constitution principles |
| **Multilingual output** | Gemini instructed per-request to respond in English, Hindi, or Marathi |
| **API key security** | Gemini API called **only from server-side Next.js route handlers** (`/api/plan`, `/api/chat`) — never exposed to the client bundle |

### Development Workflow

**Google Antigravity + GitHub Spec Kit** (`spec-kit`) — the entire product was designed and built through a spec-driven AI agent workflow:

```
/speckit.constitution  →  7 guiding principles (safety, honesty, transparency, low-cost, simplicity, privacy, code quality)
/speckit.specify       →  Full product spec with 4 user stories
/speckit.clarify       →  Resolved API choices (Open-Meteo keyless vs WAQI)
/speckit.plan          →  Architecture plan with constitution gate checks
/speckit.tasks         →  30 tasks across 7 phases
/speckit.analyze       →  API contracts, data model, research docs
/speckit.implement     →  Autonomous code generation, build fixes, git commit
```

All governance artifacts are version-controlled in [`.specify/`](.specify/) and [`specs/`](specs/).

### Non-GenAI APIs (No API Keys Required)

| API | Usage |
|---|---|
| [Open-Meteo Air Quality](https://air-quality-api.open-meteo.com) | Live PM2.5, PM10, US AQI + hourly forecast |
| [Open-Meteo Geocoding](https://geocoding-api.open-meteo.com) | City name → latitude/longitude |

### Application Stack

- **Framework**: Next.js 15 (App Router) · TypeScript strict
- **Styling**: Tailwind CSS · mobile-first responsive
- **Validation**: Zod (Gemini JSON output schema)
- **i18n**: Lightweight static dictionaries — `locales/en.json`, `hi.json`, `mr.json`
- **Storage**: `localStorage` only — no database, no accounts
- **Deployment**: Vercel (zero-config Next.js detection)

---

## Constitution (7 Non-Negotiable Principles)

Encoded in [`.specify/memory/constitution.md`](.specify/memory/constitution.md) and enforced in every Gemini prompt:

1. **Safety First** — Never diagnose or prescribe; always show "not medical advice"; flag vulnerable members to consult a doctor
2. **Honesty About Data** — All advice grounded in live AQI; fallback explicitly labelled as seasonal estimate
3. **Impact Transparency** — Hedged qualitative impact (Low / Medium / High); no fake percentages
4. **Low-Cost Indian Context** — Prioritise zero-cost interventions (damp cloth sealing, N95 mask timing, wet mopping)
5. **Simplicity & Multilingual** — Readable by non-technical parents and elders; EN / HI / MR
6. **Privacy** — No accounts, no server-side personal data; profile stays in the browser
7. **Code Quality** — TypeScript strict, Zod-validated AI output, server-only API keys, graceful error states

---

## Getting Started

### Prerequisites

- Node.js 20+
- Gemini API key from [aistudio.google.com](https://aistudio.google.com) *(optional — app works without it using the rule-based fallback)*

### Setup

```bash
# Clone or open the project
cd how-in-thandit

# Install dependencies
npm install

# Create your environment file
cp .env.example .env.local
# Edit .env.local and set: GEMINI_API_KEY=your_key_here

# Start development server
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm start
```

> **Without `GEMINI_API_KEY`**: The app still delivers a full experience — it falls back to a deterministic Hindi/Marathi/English rule-based plan. AQI data always works since Open-Meteo requires no key.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add environment variable: `GEMINI_API_KEY` = your Gemini key
4. Deploy — Next.js auto-detected, zero config needed

> API keys are set as Vercel environment variables and **never** reach the client bundle.

---

## Project Structure

```
how-in-thandit/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── layout.tsx            # Root layout + metadata
│   ├── error.tsx             # Global error boundary
│   ├── globals.css           # Tailwind + scrollbar styles
│   └── api/
│       ├── plan/route.ts     # POST /api/plan — Gemini plan + Zod + fallback
│       └── chat/route.ts     # POST /api/chat — guardrailed chat
├── components/
│   ├── AirSnapshotCard.tsx   # AQI hero card with CPCB color bands
│   ├── ProfileDrawer.tsx     # Household profile form (localStorage)
│   ├── DailyPlanSection.tsx  # 4-category accordion
│   ├── ImpactBadge.tsx       # Low/Medium/High badge + "Why this helps"
│   ├── ChatDrawer.tsx        # Sliding chat drawer with starter questions
│   ├── CommunityCard.tsx     # Shareable digest card
│   ├── LanguageSwitcher.tsx  # EN / HI / MR toggle
│   └── MedicalDisclaimer.tsx # Amber safety banner
├── lib/
│   ├── aqi.ts                # CPCB bands, PM2.5→AQI calculation
│   ├── gemini.ts             # Gemini API client + Zod schema + system prompt
│   ├── open-meteo.ts         # Geocoding + Air Quality fetchers
│   ├── fallback-plan.ts      # Rule-based plan (EN/HI/MR)
│   ├── rate-limit.ts         # In-memory sliding-window IP limiter
│   └── storage.ts            # localStorage profile + settings
├── locales/
│   ├── en.json               # English UI strings
│   ├── hi.json               # Hindi UI strings
│   └── mr.json               # Marathi UI strings
├── types/index.ts            # Canonical TypeScript types
├── specs/001-winter-smog-advisor/   # Spec Kit governance artifacts
│   ├── spec.md · plan.md · tasks.md · research.md · data-model.md
│   ├── contracts/plan-api.contract.md · chat-api.contract.md
│   └── checklists/requirements.md
└── .specify/memory/constitution.md  # 7 product principles
```

---

## Out of Scope (MVP)

- User accounts or authentication
- Database or server-side data persistence
- Push notifications
- Hardware air quality sensors
- Medical advice of any kind

---

## License

MIT
