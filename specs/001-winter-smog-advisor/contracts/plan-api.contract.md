# Contract: POST /api/plan

**Description**: Accepts the live air snapshot and household profile, returning a structured personalized daily action plan with 4 categories, impact explainers, and guardrails.

---

## Endpoint Details

- **Method**: `POST`
- **Path**: `/api/plan`
- **Content-Type**: `application/json`
- **Rate Limit**: 10 requests / IP / hour

---

## Request Body

```json
{
  "city": "Pune",
  "aqi": 340,
  "pm25": 145.2,
  "category": "Very Poor",
  "language": "en",
  "profile": {
    "members": ["children", "respiratory"],
    "commuteMode": "two_wheeler",
    "homeType": "apartment",
    "hasPurifier": false,
    "cookingFuel": "lpg",
    "budgetLevel": "low"
  }
}
```

### TypeScript Definition
```typescript
export interface PlanApiRequest {
  city: string;
  aqi: number;
  pm25: number;
  category: string;
  language: 'en' | 'hi' | 'mr';
  profile: {
    members: ('children' | 'elderly' | 'respiratory' | 'pregnant')[];
    commuteMode: 'walk' | 'two_wheeler' | 'auto' | 'car' | 'public_transit';
    homeType: 'apartment' | 'independent_house';
    hasPurifier: boolean;
    cookingFuel: 'lpg' | 'induction' | 'biomass';
    budgetLevel: 'low' | 'medium' | 'high';
  };
}
```

---

## Response Body (200 OK)

```json
{
  "date": "2026-11-22",
  "city": "Pune",
  "aqi": 340,
  "category": "Very Poor",
  "language": "en",
  "sections": {
    "morningRoutine": [
      {
        "id": "mr-1",
        "title": "Shift Two-Wheeler Commute & Wear Fitted N95",
        "action": "Wear a certified N95/FFP2 mask tightly over nose and mouth; avoid unmasked two-wheeler travel before 8:30 AM when temperature inversions trap smog.",
        "whoBenefits": "Two-wheeler commuters & family members with asthma",
        "impactLevel": "High",
        "whyItHelps": "A snug N95 mask can filter out a substantial portion of fine PM2.5 particulates before they enter airways."
      }
    ],
    "indoorHacks": [
      {
        "id": "ih-1",
        "title": "Damp Towel Door & Window Gap Sealing",
        "action": "Place damp rolled towels or cloth strips along outside-facing balcony door and window bottom crevices.",
        "whoBenefits": "Entire household, especially children",
        "impactLevel": "Medium",
        "whyItHelps": "Damp fabric physically catches coarse settling dust and noticeably reduces outdoor smog draft infiltration into living rooms."
      }
    ],
    "kidsEldersCare": [
      {
        "id": "kc-1",
        "title": "Move Outdoor Sports & Early Walks Indoors",
        "action": "Substitute early morning balcony/garden walks with gentle indoor corridor stretches; keep children engaged in indoor activities until afternoon.",
        "whoBenefits": "Children and elderly members with respiratory conditions",
        "impactLevel": "High",
        "whyItHelps": "Peak morning air traps maximum ground-level pollutants; avoiding heavy respiration during these hours substantially reduces lung exposure."
      }
    ],
    "sustainableAlternatives": [
      {
        "id": "sa-1",
        "title": "Eliminate Indoor Incense & Dhoop",
        "action": "Pause burning agarbatti, camphor, and mosquito coils indoors; opt for mechanical mosquito nets or clean ventilation.",
        "whoBenefits": "Indoor family air quality",
        "impactLevel": "High",
        "whyItHelps": "Incense smoke generates heavy indoor fine particulate spikes that can double existing indoor PM2.5 levels."
      }
    ]
  },
  "medicalDisclaimer": "Important Note: This daily plan is for educational and harm-reduction purposes only and is not medical advice. If you or family members experience wheezing, shortness of breath, or cardiac distress, please consult a qualified doctor immediately.",
  "isFallback": false
}
```

---

## Error Responses

- **400 Bad Request**: Invalid body parameters or missing required profile fields.
- **429 Too Many Requests**: IP rate limit exceeded (`{"error": "Too many requests. Please try again later."}`).
- **500 Internal Server Error**: Internal runtime failure (if rule-based fallback fails completely).
