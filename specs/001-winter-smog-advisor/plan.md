# Implementation Plan: Winter Smog Family Assistant ("How In थंडीत")

**Branch**: `001-winter-smog-advisor` | **Date**: 2026-11-22 | **Spec**: [specs/001-winter-smog-advisor/spec.md](spec.md)

**Input**: Feature specification from `specs/001-winter-smog-advisor/spec.md` with Next.js App Router, TypeScript strict, Tailwind CSS, Open-Meteo APIs, Gemini API with Zod validation, guardrails, fallback engine, and i18n support.

---

## Summary

Build a mobile-first web application ("How In थंडीत") that helps Indian families and communities navigate severe winter smog and urban air pollution. The application combines live air quality data (via Open-Meteo Geocoding & Air Quality APIs), client-stored household profiles (`localStorage`), and server-proxied Gemini AI generation (`/api/plan` and `/api/chat`) with strict medical safety guardrails, Zod schema validation, a deterministic rule-based fallback, and native multilingual support (English, Hindi, Marathi).

---

## Technical Context

**Language/Version**: TypeScript 5.x (`strict: true`), Node.js 20+

**Primary Dependencies**: 
- `next`: ^15.x (React 19, App Router)
- `react`, `react-dom`: ^19.x
- `@google/genai` (or `@google/generative-ai`): official Google Gemini API SDK
- `zod`: ^3.23.x (schema validation for AI outputs & API payloads)
- `lucide-react`: icon set for mobile UI
- `tailwindcss`: ^3.4.x (utility-first mobile styling)
- `html-to-image`: client-side rendering for community card PNG export (optional/progressive enhancement)

**Storage**: Zero server database. Client browser `localStorage` strictly for profile preferences, language, and saved city.

**Testing**: 
- Unit & Contract tests: Vitest or Jest with React Testing Library
- TypeScript type-checking: `tsc --noEmit`
- Linting: ESLint with Next.js standard config

**Target Platform**: Mobile-first Web, deployed on Vercel (Edge/Serverless Node.js runtime).

**Project Type**: Full-stack Next.js Web Application (React Client Components + Serverless API Route Handlers).

**Performance Goals**:
- Initial page load < 1.5 seconds on mobile 4G
- AI Daily Plan generation < 3.5 seconds (or instant rule-based fallback)
- Client-side language toggle transition < 50ms

**Constraints**:
- Zero database storage (Constitution Principle VI)
- Gemini API key MUST remain server-side only in `process.env.GEMINI_API_KEY` (Principle VII)
- No medical diagnoses, dosing, or fabricated statistics (Principles I & III)
- In-memory IP rate limiting on `/api/plan` (10/hr) and `/api/chat` (20/hr)

**Scale/Scope**:
- Single-page responsive web application with 4 primary feature areas: Air Snapshot, Personalized Plan, Q&A Chat, and Community Card
- 3 supported languages: English (`en`), Hindi (`hi`), Marathi (`mr`)

---

## Constitution Check

*GATE: Evaluated against `.specify/memory/constitution.md`*

| Constitution Principle | Requirement / Gate | Compliance Strategy | Status |
|---|---|---|:---:|
| **I. Safety First** | Never medical diagnosis/dosing; prominent disclaimer; doctor referral for vulnerable groups. | System prompt negative constraints + Zod schema + UI disclaimer banner. Medical queries intercepted. | **PASS** |
| **II. Honesty About Data** | Grounded in verified live sensor feeds; explicit "Live Data Unavailable" indicator with labeled fallback. | Open-Meteo live API integration + explicit fallback badge if station offline. | **PASS** |
| **III. Impact Transparency** | "Why this helps" with approximate, hedged rationale; no fake statistics. | Enforced in Gemini prompt schema (`whyItHelps`) and reviewed in test assertions. | **PASS** |
| **IV. Low-Cost Indian Context** | Pragmatic solutions for Indian homes; no assuming expensive purifiers. | Prompts prioritize damp mopping, cloth sealing, afternoon schedule shifts, and N95 masks. | **PASS** |
| **V. Simplicity & Multilingual** | Mobile-first; clear language; English, Hindi, Marathi support. | Responsive card UI + lightweight i18n dictionary + localized LLM output. | **PASS** |
| **VI. Zero-Knowledge Privacy** | No user accounts; no server-side PII or health tags stored. | No database used. Profile stored exclusively in client `localStorage`. | **PASS** |
| **VII. Code Quality & Security** | TypeScript strict; modular components; server-side only API keys; error boundaries. | `tsconfig.json` (`strict: true`), route handlers for Gemini, fallback plan engine, and rate limiting. | **PASS** |

*All gates passed with zero unjustified violations.*

---

## Project Structure

### Documentation (this feature)

```text
specs/001-winter-smog-advisor/
├── spec.md              # Feature specification & requirements
├── plan.md              # This architecture plan
├── research.md          # Technical decisions & rationale
├── data-model.md        # Entity schemas & types
├── quickstart.md        # Setup & verification guide
├── checklists/
│   └── requirements.md  # Spec quality review checklist
└── contracts/
    ├── plan-api.contract.md # POST /api/plan schema
    └── chat-api.contract.md # POST /api/chat schema
```

### Source Code (repository root)

```text
how-in-thandit/
├── app/
│   ├── layout.tsx                # Root layout with metadata and fonts
│   ├── page.tsx                  # Main single-page application dashboard
│   ├── globals.css               # Tailwind CSS imports & theme
│   └── api/
│       ├── plan/
│       │   └── route.ts          # POST handler: Gemini AI + Rule-based fallback
│       └── chat/
│           └── route.ts          # POST handler: Grounded Q&A with medical guardrails
├── components/
│   ├── AirSnapshotCard.tsx       # AQI hero card with CPCB color coding & meaning
│   ├── ProfileDrawer.tsx         # Onboarding/editing household profile drawer
│   ├── DailyPlanSection.tsx      # Accordion list with 4 plan categories & impact badges
│   ├── ImpactBadge.tsx           # Visual badge (Low/Medium/High) with explainer popover
│   ├── ChatDrawer.tsx            # "Ask How In थंडीत" slide-over chat interface
│   ├── CommunityCard.tsx         # Shareable summary card with text copy & image export
│   ├── LanguageSwitcher.tsx      # One-touch switcher (EN, HI, MR)
│   └── MedicalDisclaimer.tsx     # Persistent regulatory safety notice
├── lib/
│   ├── aqi.ts                    # CPCB scale calculation & plain-meaning mapping
│   ├── open-meteo.ts             # Client/server fetchers for Geocoding & Air Quality
│   ├── gemini.ts                 # Server-side Gemini client & prompt templates
│   ├── fallback-plan.ts          # Deterministic rule-based plan generator
│   ├── rate-limit.ts             # In-memory sliding window IP rate limiter
│   └── storage.ts                # Type-safe browser localStorage helpers
├── locales/
│   ├── en.json                   # English UI dictionary
│   ├── hi.json                   # Hindi UI dictionary
│   └── mr.json                   # Marathi UI dictionary
├── types/
│   └── index.ts                  # Shared TypeScript interfaces (from data-model.md)
├── .env.example                  # Template with GEMINI_API_KEY
├── package.json
├── tsconfig.json                 # strict: true
└── tailwind.config.js
```

**Structure Decision**: Standard Next.js 15+ App Router application with separate `components/`, `lib/`, `locales/`, and `types/` directories. Isolates external API interaction to `lib/` and keeps all sensitive API key access inside `app/api/`.

---

## Complexity Tracking

*No architectural violations or unnecessary complexity introduced.*

| Component | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Rule-Based Fallback Engine | Guarantees 100% plan generation availability when Gemini API is rate-limited or offline. | Pure LLM fails during network outages or quota limits, violating Constitution Principle II. |
| In-memory Rate Limiter | Prevents denial-of-wallet and quota abuse on public serverless routes. | Redis/Upstash rejected to maintain zero external database footprint for MVP. |
| Client-Side LocalStorage | Preserves household settings across visits with zero login friction. | User accounts/PostgreSQL rejected to honor Constitution Principle VI (Zero-Knowledge Privacy). |
