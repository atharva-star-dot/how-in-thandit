# Contract: POST /api/chat

**Description**: Handles interactive follow-up Q&A for "Ask How In थंडीत", grounding replies in the user's active household profile, language, and current air quality while enforcing strict medical safety guardrails.

---

## Endpoint Details

- **Method**: `POST`
- **Path**: `/api/chat`
- **Content-Type**: `application/json`
- **Rate Limit**: 20 requests / IP / hour

---

## Request Body

```json
{
  "messages": [
    {
      "sender": "user",
      "text": "Should I send my 6-year-old child to school for sports practice today?"
    }
  ],
  "context": {
    "city": "Delhi",
    "aqi": 380,
    "category": "Very Poor",
    "language": "en",
    "profile": {
      "members": ["children"],
      "commuteMode": "walk",
      "homeType": "apartment",
      "hasPurifier": false,
      "cookingFuel": "lpg",
      "budgetLevel": "medium"
    }
  }
}
```

---

## Response Body (200 OK)

```json
{
  "reply": "At an AQI of 380 (Very Poor), outdoor athletic sports practice involves heavy deep breathing of high PM2.5 concentrations, which can irritate developing airways. It is strongly recommended to speak with school teachers to request indoor low-intensity activities instead of outdoor exertion today. If your child has a cough or breathing sensitivity, consult your pediatrician.\n\n*Note: This is general air protection guidance and not medical advice.*",
  "hasMedicalDisclaimer": true
}
```

---

## Error Handling

- **400 Bad Request**: Missing messages array or invalid text length.
- **429 Too Many Requests**: IP rate limit exceeded.
- **500 Internal Server Error**: Service failure with polite localized fallback message.
