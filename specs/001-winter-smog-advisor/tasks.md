---
description: "Task list for Winter Smog Family Assistant (How In थंडीत)"
---

# Tasks: Winter Smog Family Assistant ("How In थंडीत")

**Input**: Design documents from `specs/001-winter-smog-advisor/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`)  
**Prerequisites**: `plan.md`, `spec.md`, `data-model.md`, `contracts/`  
**Organization**: Tasks are grouped by phase and user story to enable independent implementation and testing of each story.

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Maps to user stories from `spec.md` (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Canonical field constraints cited from `data-model.md` (`Entity.field`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, core Next.js 15+ App Router dependencies, and styling infrastructure.

- [X] T001 Initialize Next.js 15+ App Router project with TypeScript strict mode and Tailwind CSS in `package.json` and `tsconfig.json`
- [X] T002 [P] Configure Tailwind CSS with responsive mobile breakpoints and custom air quality palette in `tailwind.config.js` and `app/globals.css`
- [X] T003 [P] Create environment configuration template with `GEMINI_API_KEY` in `.env.example`
- [X] T004 [P] Define core TypeScript domain interfaces and enums citing `data-model.md` (`HouseholdProfile.members`, `HouseholdProfile.commuteMode`, `HouseholdProfile.homeType`, `HouseholdProfile.hasPurifier`, `HouseholdProfile.cookingFuel`, `HouseholdProfile.budgetLevel`, `AirQualitySnapshot.category`, `ActionItem.impactLevel`, `UserSettings.language`) in `types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities, i18n dictionaries, rate limiter, and CPCB mapping required by all user stories.

- [X] T005 [P] Implement CPCB scale mapping, AQI calculation, and severity color resolver citing `data-model.md` (`AirQualitySnapshot.category`) in `lib/aqi.ts`
- [X] T006 [P] Create English, Hindi, and Marathi static UI localization dictionaries citing `data-model.md` (`UserSettings.language`) in `locales/en.json`, `locales/hi.json`, and `locales/mr.json`
- [X] T007 [P] Implement client-side `localStorage` wrapper with zero-server storage policy citing `data-model.md` (`HouseholdProfile`, `UserSettings`) in `lib/storage.ts`
- [X] T008 [P] Implement in-memory sliding-window IP rate limiter for API routes in `lib/rate-limit.ts`
- [X] T009 [P] Create persistent regulatory medical disclaimer banner component in `components/MedicalDisclaimer.tsx`
- [X] T010 Setup root application layout, viewport metadata, and navigation header in `app/layout.tsx`

**Checkpoint**: Core foundation ready — User story implementation can now proceed.

---

## Phase 3: User Story 1 - Local Air Quality Snapshot & Household Setup (Priority: P1) 🎯 MVP

**Goal**: Enable users to view live AQI/PM2.5 mapped to Indian CPCB bands and save their household profile locally with zero mandatory account creation.  
**Independent Test**: Enter city "Pune", verify live PM2.5/AQI hero card renders with correct CPCB color, save profile options in drawer, and refresh page to confirm `localStorage` persistence.

- [X] T011 [P] [US1] Implement Open-Meteo Geocoding & Air Quality client fetchers with seasonal offline fallback in `lib/open-meteo.ts`
- [X] T012 [P] [US1] Create AQI Hero Snapshot Card component displaying AQI number, PM2.5 metric, severity badge, and plain-language interpretation in `components/AirSnapshotCard.tsx`
- [X] T013 [US1] Build Household Profile Drawer component with interactive selectors citing `data-model.md` (`HouseholdProfile.members`, `HouseholdProfile.commuteMode`, `HouseholdProfile.homeType`, `HouseholdProfile.hasPurifier`, `HouseholdProfile.cookingFuel`, `HouseholdProfile.budgetLevel`) in `components/ProfileDrawer.tsx`
- [X] T014 [US1] Integrate location search bar and profile drawer into the main dashboard page in `app/page.tsx`

**Checkpoint**: User Story 1 is fully functional and delivers an independently valuable MVP.

---

## Phase 4: User Story 2 - Personalized Daily Smog Plan with Impact Explainers (Priority: P1)

**Goal**: Generate AI-personalized 4-part daily action plan grounded in live AQI and profile, complete with "Impact Explainers" (Low/Medium/High) and a rule-based fallback.  
**Independent Test**: Invoke `POST /api/plan` with active profile; verify 4 accordion sections render with impact badges and hedged explanations, and verify rule-based fallback when offline.

- [X] T015 [P] [US2] Implement deterministic rule-based fallback plan generator covering CPCB bands citing `data-model.md` (`DailyPlanResponse`, `ActionItem.impactLevel`) in `lib/fallback-plan.ts`
- [X] T016 [P] [US2] Implement Gemini API client with system prompt enforcing Constitution principles (no medical advice, hedged claims) in `lib/gemini.ts`
- [X] T017 [US2] Create Next.js server route handler `POST /api/plan` with Zod schema validation and fallback error recovery per contract `contracts/plan-api.contract.md` in `app/api/plan/route.ts`
- [X] T018 [P] [US2] Create Impact Badge and explainer popover component citing `data-model.md` (`ActionItem.impactLevel`, `ActionItem.whoBenefits`, `ActionItem.whyItHelps`) in `components/ImpactBadge.tsx`
- [X] T019 [US2] Create Daily Plan Accordion UI with 4 categories (Morning/Commute, Indoor Hacks, Kids & Elders Care, Sustainable Alternatives) in `components/DailyPlanSection.tsx`
- [X] T020 [US2] Wire plan generation trigger and state management into `app/page.tsx`

**Checkpoint**: User Stories 1 and 2 operate together as a complete personalized air advisor.

---

## Phase 5: User Story 3 - "Ask How In थंडीत" Conversational Assistant (Priority: P2)

**Goal**: Provide a grounded contextual Q&A chat for follow-up family smog questions with strict medical safety guardrails.  
**Independent Test**: Ask "Should my asthmatic child go to morning sports?", verify grounded response without medical dosing, and test interception on prescription queries.

- [X] T021 [US3] Create Next.js server route handler `POST /api/chat` with safety guardrails per contract `contracts/chat-api.contract.md` citing `data-model.md` (`ChatMessage.sender`) in `app/api/chat/route.ts`
- [X] T022 [US3] Create "Ask How In थंडीत" slide-over drawer and messaging interface in `components/ChatDrawer.tsx`
- [X] T023 [US3] Connect chat drawer trigger to dashboard and pass active AQI + profile context in `app/page.tsx`

**Checkpoint**: User Stories 1, 2, and 3 are functional and interactive.

---

## Phase 6: User Story 4 - Community Summary Card & Multilingual Experience (Priority: P3)

**Goal**: Deliver instant language toggle across English, Hindi, and Marathi, and generate a shareable community digest card for WhatsApp/society groups.  
**Independent Test**: Switch language to Marathi/Hindi; verify UI strings update instantly; click "Community Card", verify top 3 actions render and copy to clipboard.

- [X] T024 [P] [US4] Implement Language Switcher component with instant state updates citing `data-model.md` (`UserSettings.language`) in `components/LanguageSwitcher.tsx`
- [X] T025 [P] [US4] Create Community Summary Card component with clipboard text copy and image-friendly layout citing `data-model.md` (`CommunityCardData`) in `components/CommunityCard.tsx`
- [X] T026 [US4] Integrate language switcher and Community Card modal into the main navigation and dashboard in `app/page.tsx`

**Checkpoint**: All 4 user stories are functional and localized.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification, error boundary hardening, mobile optimization, and build validation.

- [X] T027 [P] Implement global error boundary and offline network banner in `app/error.tsx`
- [X] T028 [P] Optimize mobile viewport typography, touch targets, and contrast ratios in `app/globals.css`
- [X] T029 Execute end-to-end verification scenarios defined in `specs/001-winter-smog-advisor/quickstart.md`
- [X] T030 Validate TypeScript strict compilation (`tsc --noEmit`) and production build (`npm run build`) ✅ **PASSED** 2026-11-22

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Independent — starts immediately.
- **Foundational (Phase 2)**: Depends on Setup (T001–T004) — BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2).
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) and US1 data types.
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) and Gemini service (T016).
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2) and localization dictionaries (T006).
- **Polish (Phase 7)**: Depends on user stories being implemented.

### Parallel Execution Opportunities
- **Setup**: T002, T003, T004 in parallel after T001.
- **Foundational**: T005, T006, T007, T008, T009 in parallel.
- **User Story 1**: T011 and T012 in parallel.
- **User Story 2**: T015, T016, and T018 in parallel.
- **User Story 4**: T024 and T025 in parallel.
