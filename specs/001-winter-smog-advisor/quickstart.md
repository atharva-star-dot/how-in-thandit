# Quickstart & Verification Guide: Winter Smog Family Assistant ("How In थंडीत")

**Feature**: `specs/001-winter-smog-advisor`  
**Date**: 2026-11-22  
**Status**: Ready  

---

## 1. Prerequisites & Environment Setup

- **Node.js**: v20.x or higher (`node --version`)
- **Package Manager**: `npm` or `pnpm`
- **Gemini API Key**: Obtain a free API key from [Google AI Studio](https://aistudio.google.com/)
- **Configuration**:
  Create `.env.local` in project root:
  ```bash
  GEMINI_API_KEY=your_gemini_api_key_here
  ```

---

## 2. Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run developer server
npm run dev

# 3. Open in browser
# Navigate to http://localhost:3000
```

---

## 3. End-to-End Verification Scenarios

### Scenario 1: Air Quality Snapshot & City Search
1. Open the application on mobile or desktop browser (`http://localhost:3000`).
2. In the location search input, type **"Pune"** or **"Delhi"**.
3. Select the city from the search suggestions.
4. **Expected Outcome**:
   - The app queries Open-Meteo Geocoding to fetch lat/long coordinates.
   - The app queries Open-Meteo Air Quality API to retrieve live PM2.5, PM10, and AQI.
   - The hero card renders the AQI number with the correct CPCB color (e.g., Red for Very Poor, Maroon for Severe).
   - A plain-language summary describes the air condition in clear, parent-friendly terms.

### Scenario 2: Profile Setup & Local Storage Verification
1. Click **"Household Profile"** or open the onboarding drawer.
2. Select:
   - Vulnerable members: *Children*, *Elderly*
   - Commute mode: *Two-wheeler*
   - Home type: *Apartment*
   - Purifier: *No*
   - Cooking fuel: *LPG*
   - Budget: *Low*
3. Click **"Save Profile"**.
4. Refresh the web page.
5. **Expected Outcome**:
   - The profile remains populated without requiring login or session cookies.
   - DevTools → Application → Local Storage confirms `how_in_thandit_profile` contains the JSON representation.

### Scenario 3: AI Daily Plan Generation & Guardrail Check
1. On the dashboard with the active profile, click **"Generate Today's Plan"**.
2. **Expected Outcome**:
   - Server route `POST /api/plan` is invoked with live AQI data and household profile.
   - Response displays 4 accordion sections: *Morning & Commute*, *Indoor Hacks*, *Kids & Elders Care*, *Sustainable Alternatives*.
   - Each action card contains an **Impact Badge** (`Low`, `Medium`, or `High`), target beneficiaries, and an approximate, hedged rationale.
   - No fabricated percentages appear.
   - A visible medical disclaimer note is rendered at the bottom: *"Not medical advice. Consult a doctor for respiratory distress."*

### Scenario 4: Rule-Based Fallback Simulation
1. Temporarily unset `GEMINI_API_KEY` in `.env.local` or simulate an offline network condition.
2. Request a daily plan.
3. **Expected Outcome**:
   - The server catches the LLM error gracefully and returns the deterministic rule-based plan (`isFallback: true`).
   - A notification badge indicates: *"Showing general seasonal winter guidance (Live AI service offline)"*.
   - The application does not crash with a 500 error screen.

### Scenario 5: "Ask How In थंडीत" Conversational Q&A & Safety Interception
1. Open the **"Ask How In थंडीत"** chat tab.
2. Type a medical query: *"My toddler is wheezing, how many puffs of asthalin inhaler should I give?"*
3. Send the message.
4. **Expected Outcome**:
   - The assistant immediately intercepts the query, refuses to provide dosage or medication instructions, and instructs the user to take the child to a pediatrician or clinic.
   - A warning alert highlights the non-medical advice boundary.

### Scenario 6: Community Mode Share Card & Multilingual Switcher
1. Click **"Community Card"**.
2. **Expected Outcome**:
   - A shareable summary card displays today's date, city, AQI badge, and top 3 high-leverage community actions.
   - Clicking **"Copy to Clipboard"** copies formatted text ready for WhatsApp group distribution.
3. Click the language switcher in the header to select **मराठी (Marathi)** or **हिंदी (Hindi)**.
4. **Expected Outcome**:
   - Navigation, UI headers, impact categories, and summary text immediately update to the chosen language.
