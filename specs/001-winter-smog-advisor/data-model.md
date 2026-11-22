# Data Model: Winter Smog Family Assistant ("How In थंडीत")

**Feature**: `specs/001-winter-smog-advisor`  
**Date**: 2026-11-22  
**Status**: Completed  

---

## 1. Client-Side Persistent Models (Stored in `localStorage`)

### 1.1 `HouseholdProfile`
Captures user household constraints and vulnerabilities without storing personal identifiers or server databases.

```typescript
export type VulnerableMember = 'children' | 'elderly' | 'respiratory' | 'pregnant';

export type CommuteMode = 'walk' | 'two_wheeler' | 'auto' | 'car' | 'public_transit';

export type HomeType = 'apartment' | 'independent_house';

export type CookingFuel = 'lpg' | 'induction' | 'biomass';

export type BudgetLevel = 'low' | 'medium' | 'high';

export interface HouseholdProfile {
  members: VulnerableMember[];
  commuteMode: CommuteMode;
  homeType: HomeType;
  hasPurifier: boolean;
  cookingFuel: CookingFuel;
  budgetLevel: BudgetLevel;
  lastUpdated: string; // ISO 8601
}
```

**Validation Rules**:
- `members`: Set of valid strings; empty array allowed if no vulnerable members present.
- `commuteMode`: Must be one of the defined enum values.
- `homeType`: Must be one of the defined enum values.
- `cookingFuel`: Must be one of the defined enum values.
- `budgetLevel`: Defaults to `'low'` (to ensure accessible Indian context by default).

---

### 1.2 `UserSettings`
Holds client language and location preferences.

```typescript
export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface UserSettings {
  language: SupportedLanguage;
  savedCity?: {
    name: string;
    latitude: number;
    longitude: number;
    state?: string;
  };
}
```

---

## 2. Air Quality & Environmental Domain Models

### 2.1 `AirQualitySnapshot`
Standardized environmental observation mapped to Indian Central Pollution Control Board (CPCB) standards.

```typescript
export type CpcbCategory = 
  | 'Good' 
  | 'Satisfactory' 
  | 'Moderate' 
  | 'Poor' 
  | 'Very Poor' 
  | 'Severe';

export interface HourlyForecastItem {
  time: string; // ISO string or 'HH:00'
  pm25: number; // µg/m³
  aqi: number;
}

export interface AirQualitySnapshot {
  city: string;
  latitude: number;
  longitude: number;
  aqi: number; // CPCB derived scale (0-500+)
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  category: CpcbCategory;
  severityColor: string; // Hex color for UI badge
  plainMeaning: string; // Localized, parent-friendly summary
  hourlyForecast: HourlyForecastItem[];
  isLive: boolean; // False if falling back to seasonal baseline
  fetchedAt: string; // ISO 8601
}
```

**CPCB Category Mapping Table**:
| Category | AQI Range | PM2.5 (µg/m³) | UI Color | Plain Meaning (Summary) |
|---|---|---|---|---|
| **Good** | 0 – 50 | 0 – 30 | `#16a34a` (Green) | Minimal impact; clean air. |
| **Satisfactory** | 51 – 100 | 31 – 60 | `#84cc16` (Light Green) | Minor breathing discomfort to sensitive people. |
| **Moderate** | 101 – 200 | 61 – 90 | `#eab308` (Yellow) | Breathing discomfort to people with lung disease/asthma. |
| **Poor** | 201 – 300 | 91 – 120 | `#f97316` (Orange) | Discomfort to most people on prolonged exposure. |
| **Very Poor** | 301 – 400 | 121 – 250 | `#ef4444` (Red) | Respiratory illness on prolonged exposure. |
| **Severe** | 401 – 500+ | > 250 | `#7f1d1d` (Maroon/Dark Red) | Affects healthy people; seriously impacts vulnerable groups. |

---

## 3. Daily Plan & AI Output Schema (Zod Validated)

### 3.1 `ActionItem`
An individual actionable hack or routine intervention.

```typescript
export type ImpactLevel = 'Low' | 'Medium' | 'High';

export interface ActionItem {
  id: string;
  title: string;
  action: string;
  whoBenefits: string;
  impactLevel: ImpactLevel;
  whyItHelps: string; // Approximate, hedged reason (no fake numbers)
}
```

### 3.2 `DailyPlanResponse`
The complete personalized daily schedule structure.

```typescript
export interface DailyPlanResponse {
  date: string; // YYYY-MM-DD
  city: string;
  aqi: number;
  category: CpcbCategory;
  language: SupportedLanguage;
  sections: {
    morningRoutine: ActionItem[];
    indoorHacks: ActionItem[];
    kidsEldersCare: ActionItem[];
    sustainableAlternatives: ActionItem[];
  };
  medicalDisclaimer: string;
  isFallback: boolean; // True if generated via rule-based engine during LLM failure
}
```

**Zod Validation Schema (Server-side)**:
```typescript
import { z } from 'zod';

export const ActionItemSchema = z.object({
  title: z.string().min(2),
  action: z.string().min(5),
  whoBenefits: z.string().min(2),
  impactLevel: z.enum(['Low', 'Medium', 'High']),
  whyItHelps: z.string().min(10),
});

export const DailyPlanPayloadSchema = z.object({
  morningRoutine: z.array(ActionItemSchema).min(1).max(3),
  indoorHacks: z.array(ActionItemSchema).min(1).max(3),
  kidsEldersCare: z.array(ActionItemSchema).min(1).max(3),
  sustainableAlternatives: z.array(ActionItemSchema).min(1).max(3),
});
```

---

## 4. Chat & Community Models

### 4.1 `ChatMessage`
```typescript
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
```

### 4.2 `CommunityCardData`
```typescript
export interface CommunityCardData {
  city: string;
  date: string;
  aqi: number;
  category: CpcbCategory;
  topActions: string[]; // 3 high-impact community actions
  shareTextPayload: string;
}
```
