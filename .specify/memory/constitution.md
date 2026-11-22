<!--
Sync Impact Report:
- Version change: 0.0.0 (Uninitialized template) -> 1.0.0
- List of modified principles:
  - Initialized Principle I: Safety First (Medical Non-Negotiable)
  - Initialized Principle II: Honesty About Data
  - Initialized Principle III: Impact Transparency & Calibrated Claims
  - Initialized Principle IV: Low-Cost & Indian-Context First
  - Initialized Principle V: Simplicity & Multilingual Accessibility
  - Initialized Principle VI: Zero-Knowledge Privacy & Local-First Architecture
  - Initialized Principle VII: Code Quality, Architecture & Security Standards
- Added sections:
  - Technology & Architecture Constraints
  - Development Workflow & Quality Gates
  - Governance & Compliance Review
- Removed sections: None (template placeholders replaced)
- Follow-up TODOs: None
-->

# "How In थंडीत" Constitution

## Core Principles

### I. Safety First (Medical Non-Negotiable)
The assistant MUST NEVER provide medical diagnoses, treatment plans, clinical triage, or drug/supplement dosing.
- Every response offering actionable guidance MUST feature a prominent, clear "not medical advice" disclaimer.
- The assistant MUST explicitly direct users with asthma, respiratory illness, cardiovascular conditions, infants, pregnant members, or elderly family members to consult a qualified medical professional.
- *Rationale*: Smog and severe particulate pollution trigger acute health episodes, but an AI assistant cannot substitute for clinical oversight or pediatric/pulmonary emergency care.

### II. Honesty About Data
Every air quality recommendation MUST be strictly grounded in verified live AQI and PM2.5/PM10 sensor data.
- If live data is unavailable, stale, or external sensor feeds fail, the system MUST explicitly state this limitation immediately rather than estimating or hallucinating pollution levels.
- Fallback guidance MUST be explicitly labeled as "General Seasonal Guidance (Live Data Unavailable)".
- *Rationale*: False certainty or outdated readings can mislead families into opening windows or exercising outdoors during dangerous pollution inversions.

### III. Impact Transparency & Calibrated Claims
Every recommendation MUST feature an explicit "Why this helps" statement conveying an approximate, hedged effect.
- Language MUST use calibrated qualifiers (e.g., "can noticeably reduce indoor particulate infiltration", "helps trap coarse airborne dust").
- The assistant MUST NEVER fabricate precise percentage reductions or synthetic numbers (e.g., never claim "reduces PM2.5 by 84%").
- *Rationale*: Scientific integrity and honest communication foster long-term community trust and prevent a false sense of security.

### IV. Low-Cost & Indian-Context First
Recommendations MUST prioritize low-cost, pragmatic, and culturally authentic interventions tailored to typical Indian households.
- Advice MUST focus on accessible measures: damp mopping, sealing door/window gaps with rolled damp fabric, planning outdoor errands around mid-day sunshine when inversion layers lift, wearing snug-fitting N95/FFP2 masks, avoiding early-morning exercise, and minimizing indoor combustion (agarbatti, dhoop, unventilated frying).
- The assistant MUST NOT mandate or assume ownership of expensive commercial HEPA purifiers or central HVAC systems, though it MAY provide optimization tips if a user already owns one.
- *Rationale*: Urban winter smog severely impacts households across all socio-economic strata; interventions must be practical and immediately actionable without financial strain.

### V. Simplicity & Multilingual Accessibility
The application MUST be mobile-first and intuitive for non-technical parents, guardians, and elders.
- User interfaces and AI outputs MUST be offered in English, Hindi (हिंदी), and Marathi (मराठी).
- Text MUST remain concise, jargon-free, and legible, supported by intuitive iconography and standard air-quality color coding (e.g., CPCB AQI bands).
- *Rationale*: Pollution advisories must be comprehensible within seconds by any family member making daily routine decisions for children or seniors.

### VI. Zero-Knowledge Privacy & Local-First Architecture
The system MUST protect family privacy through a zero-knowledge, local-first model.
- The application MUST NOT require accounts, phone numbers, or user authentication.
- No personal family data (such as family member ages, health conditions, or sensitive location coordinates) SHALL be transmitted to or stored on external servers or databases.
- User profile preferences MUST reside exclusively in client-side storage (`localStorage`).
- *Rationale*: Asking families to share health profiles and home locations creates unnecessary privacy risks; air protection guidance does not require central surveillance.

### VII. Code Quality, Architecture & Security Standards
The codebase MUST adhere to strict TypeScript standards and defensive architectural boundaries.
- All code MUST compile with strict TypeScript (`strict: true`) with no unvetted `any` types.
- UI elements MUST be broken into small, modular, single-responsibility components.
- Sensitive credentials and external API keys (LLM providers, air quality indices) MUST reside strictly server-side and MUST NEVER be leaked into client bundles.
- All external API calls and AI completions MUST implement defensive error boundaries, timeout handling, and graceful offline/degraded UX states.
- *Rationale*: Reliability under spotty mobile networks and robust protection against credential exposure are mandatory for public utility applications.

## Technology & Architecture Constraints

- **Client Runtime**: Mobile-first responsive web application (Next.js/React with Tailwind CSS).
- **Language**: Strict TypeScript across client and server layers.
- **Data Fetching & APIs**: Server-side proxy endpoints for Gemini API completions and AQI providers (e.g., CPCB, OpenAQ, or Weather/AQI APIs), ensuring zero client-side credential exposure.
- **Client Storage**: Browser `localStorage` strictly for language selection, saved city/station preference, and optional anonymous household member tags (e.g., "elderly", "infant").
- **Localization**: Native support for English, Hindi, and Marathi with localized strings and LLM prompt templates.

## Development Workflow & Quality Gates

- **Principle Compliance**: Every pull request, spec document, and feature proposal must explicitly verify adherence to the 7 Core Principles.
- **Safety Auditing**: System prompts and output filters must undergo automated or documented adversarial evaluation ensuring no medical advice or uncited quantitative claims leak through.
- **Language Verification**: Any prompt or UI string update must be validated across English, Hindi, and Marathi for clarity, tone, and cultural appropriateness.
- **Automated Verification**: Strict linting, type checks (`tsc --noEmit`), and component unit tests must pass before merging.

## Governance

1. **Precedence**: This Constitution supersedes all secondary documentation, specifications, and ad-hoc implementation choices.
2. **Amendment Procedure**:
   - Any amendment must be proposed with documented rationale and evaluated against user safety and privacy.
   - Amendments require updating this file alongside a corresponding Sync Impact Report.
3. **Semantic Versioning Policy**:
   - **MAJOR**: Structural changes, removal or fundamental redefinition of core principles.
   - **MINOR**: Addition of new principles, structural sections, or materially expanded governance rules.
   - **PATCH**: Non-semantic clarifications, typographical corrections, and wording refinements.
4. **Compliance Reviews**: Spec Kit workflows (`/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`) MUST evaluate artifacts against the principles defined herein.

**Version**: 1.0.0 | **Ratified**: 2026-11-22 | **Last Amended**: 2026-11-22
