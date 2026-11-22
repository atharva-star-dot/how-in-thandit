# Research & Architectural Decisions: Winter Smog Family Assistant ("How In थंडीत")

**Feature**: `specs/001-winter-smog-advisor`  
**Date**: 2026-11-22  
**Status**: Completed  

---

## 1. Next.js App Router & Architecture

### Decision
Use **Next.js (App Router)** with **TypeScript (strict: true)** and **Tailwind CSS**, deployable as a serverless application on **Vercel**.

### Rationale
- **Zero-Database Requirement**: Entirely client-orchestrated state stored in browser `localStorage`, with stateless serverless route handlers for API proxying and AI generation.
- **Server/Client Boundary Security**: Keeping `GEMINI_API_KEY` strictly in server runtime (`process.env.GEMINI_API_KEY`) ensuring zero leakage to client bundles (fulfilling Constitution Principle VII).
- **Mobile-First Responsiveness**: Tailwind CSS delivers sub-100kb utility-first CSS optimized for low-bandwidth mobile devices common among Indian urban households.

### Alternatives Considered
- *Vite + React SPA*: Requires an external backend or cloud function server for Gemini API calls to avoid client-side API key exposure; Next.js combines both cleanly in one repository.
- *Remix / SvelteKit*: Viable, but Next.js on Vercel provides the most frictionless zero-config deployment and wide community adoption for serverless LLM integrations.

---

## 2. Geocoding & Air Quality Feeds (Open-Meteo)

### Decision
Integrate **Open-Meteo Geocoding API** and **Open-Meteo Air Quality API**.
- Geocoding Endpoint: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5&language=en&format=json`
- Air Quality Endpoint: `https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&current=pm2_5,pm10,us_aqi&hourly=pm2_5,pm10,us_aqi&forecast_days=1&timezone=Asia%2FKolkata`

### CPCB Indian AQI Mapping
Open-Meteo provides raw PM2.5 (µg/m³) and PM10 (µg/m³). In India, Central Pollution Control Board (CPCB) standards are canonical:
- **Good (0–50)**: PM2.5 0–30 µg/m³
- **Satisfactory (51–100)**: PM2.5 31–60 µg/m³
- **Moderate (101–200)**: PM2.5 61–90 µg/m³
- **Poor (201–300)**: PM2.5 91–120 µg/m³
- **Very Poor (301–400)**: PM2.5 121–250 µg/m³
- **Severe / Hazardous (401–500+)**: PM2.5 > 250 µg/m³

### Rationale
- **No API Keys Required**: Completely eliminates user onboarding friction and operational billing barriers.
- **Reliable Lat/Lon Search**: Supports major Indian cities, tier-2/3 municipal districts, and direct GPS coordinates from mobile browsers.
- **Hourly Forecast**: Enables actionable morning vs. afternoon routine planning.

---

## 3. Gemini API Integration & Structured Outputs

### Decision
Use Google's Gemini API via official SDK (`@google/genai` or `@google/generative-ai`) in Next.js Server Route Handlers (`/api/plan` and `/api/chat`).
- Enforce schema validation on server responses using **Zod** (`zod`).
- For `/api/plan`: Use `responseMimeType: "application/json"` with a strict `responseSchema` or Zod parsing to guarantee:
  - 4 sections: `morningRoutine`, `indoorHacks`, `kidsEldersCare`, `sustainableAlternatives`.
  - Every action item contains: `action`, `whoBenefits`, `impactLevel` ("Low" | "Medium" | "High"), and `whyItHelps` (hedged explanation).
- For `/api/chat`: Grounded chat completion with system instructions enforcing medical safety guardrails.

### Rationale
- Zod prevents runtime schema mismatch crashes and guarantees that the UI never receives broken or malformed recommendation structures.
- Server-side invocation protects API keys and enforces IP rate limiting.

---

## 4. Guardrails & Rule-Based Fallback Engine

### Decision
Implement a multi-tiered guardrail and fallback strategy:
1. **System Prompt Guardrails**:
   - Strict prohibition on clinical triage, diagnosis, medication dosages, and synthetic statistical percentages (e.g., "reduces PM2.5 by 84.2%").
   - Explicit instructions to emphasize low-cost Indian household context (damp cloth sealing, wet mopping, afternoon outdoor shifts, N95/FFP2 masks).
   - Mandatory inclusion of "not medical advice" notices.
2. **Deterministic Rule-Based Fallback Engine**:
   - If the Gemini API returns a 429 (rate-limited), 5xx, timeout, or fails Zod schema validation, the server immediately serves a pre-compiled rule-based plan matched to the user's CPCB band and profile vulnerabilities.
   - The returned response includes a flag `isFallback: true` so the UI informs the user: *"Generated using verified general seasonal guidance (AI service currently unavailable)"*.

### Rationale
Meets Constitution Principle I (Safety First), Principle II (Honesty About Data), and Principle III (Impact Transparency). Ensures 100% uptime even during LLM outages or quota exhaustion.

---

## 5. Lightweight Localization (i18n)

### Decision
Implement an in-memory dictionary system for English (`en`), Hindi (`hi`), and Marathi (`mr`).
- Client UI uses a dictionary lookup: `t(key, lang)`.
- Server API routes accept a `language` parameter (`"en" | "hi" | "mr"`).
- The Gemini prompt specifies: *"All text in the output JSON must be written in fluent, warm, accessible [English / Hindi / Marathi]."*
- Language choice is stored in `localStorage` and defaults to English or browser language.

### Rationale
Eliminates heavy external i18n libraries and complex routing sub-paths (`/hi/...`, `/mr/...`). Single-page mobile app remains lightning-fast.

---

## 6. Community Mode Share Card

### Decision
Build an image-friendly, standalone CSS card component that can be:
1. Copied to clipboard as formatted text (with key emojis, AQI badge, top 3 actions, and website URL) via `navigator.clipboard.writeText`.
2. Shared via native Web Share API (`navigator.share`) on mobile devices.
3. Exported/downloaded as a PNG image card using `html-to-image` or HTML5 canvas rendering.

### Rationale
Parents and housing society committees frequently share alerts via WhatsApp groups; giving them both instant text copy and visual image cards maximizes community adoption.

---

## 7. In-Memory IP Rate Limiting

### Decision
Implement an in-memory token-bucket / sliding window rate limiter in route handlers:
- `/api/plan`: 10 requests per IP per hour.
- `/api/chat`: 20 requests per IP per hour.
- Standard headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`.

### Rationale
Protects serverless endpoints against abusive scraping and denial-of-wallet without requiring an external Redis / Upstash database for the MVP.
