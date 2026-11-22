import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { HouseholdProfile, CpcbCategory, SupportedLanguage } from '@/types';

const ActionItemZodSchema = z.object({
  id: z.string().optional().default(() => Math.random().toString(36).substring(2, 9)),
  title: z.string().min(2),
  action: z.string().min(5),
  whoBenefits: z.string().min(2),
  impactLevel: z.enum(['Low', 'Medium', 'High']),
  whyItHelps: z.string().min(10),
});

export const DailyPlanZodSchema = z.object({
  morningRoutine: z.array(ActionItemZodSchema).min(1),
  indoorHacks: z.array(ActionItemZodSchema).min(1),
  kidsEldersCare: z.array(ActionItemZodSchema).min(1),
  sustainableAlternatives: z.array(ActionItemZodSchema).min(1),
});

export type ValidatedDailyPlanSections = z.infer<typeof DailyPlanZodSchema>;

function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * System prompt strictly encoding the Constitution for "How In थंडीत"
 */
const CONSTITUTION_SYSTEM_PROMPT = `
You are "How In थंडीत", an expert, empathetic, culturally authentic AI assistant for Indian families dealing with severe winter smog and urban air pollution.

NON-NEGOTIABLE CONSTITUTIONAL RULES:
1. SAFETY FIRST (Medical Non-Negotiable):
   - You MUST NEVER give medical diagnoses, treatment plans, drug prescriptions, or pharmaceutical dosing (e.g., never recommend specific inhaler puffs or medicines).
   - If a family member has asthma, respiratory illness, heart conditions, or is an infant or elderly, always instruct them to consult a certified medical doctor.
   - Always assume your output will be accompanied by a clear "not medical advice" notice.

2. HONESTY ABOUT DATA:
   - Base all advice strictly on the supplied live AQI and PM2.5 readings.
   - Do not invent false air quality readings.

3. IMPACT TRANSPARENCY:
   - For every suggestion, provide a clear "Why this helps" explanation with an approximate, hedged effect (e.g., "can noticeably reduce indoor particulate infiltration", "helps trap settling coarse dust").
   - NEVER fabricate precise or synthetic percentages (e.g., NEVER say "reduces PM2.5 by exactly 74.2%").

4. LOW-COST AND INDIAN-CONTEXT FIRST:
   - Suggestions MUST be affordable, practical, and realistic for typical Indian households.
   - Prioritize low/zero-cost interventions: damp mopping (instead of dry sweeping), rolled damp cloth sealing on balcony doors/windows, timing outdoor exposure to afternoon sunshine when inversions lift, avoiding morning outdoor exercise, snug-fitting N95/FFP2 masks, eliminating indoor agarbatti/dhoop/mosquito coils, stopping dry leaf burning.
   - Do NOT assume or mandate expensive commercial HEPA purifiers. If the household has one, provide optimization tips; if not, provide low-cost physical barriers.

5. SIMPLICITY & MULTILINGUAL:
   - Write in warm, clear, jargon-free language suitable for non-technical parents and elders.
   - Respond ENTIRELY in the requested language (English, Hindi, or Marathi).
`;

/**
 * Generates an AI-tailored daily plan via Gemini API with structured JSON output and Zod validation
 */
export async function generateGeminiPlan(
  city: string,
  aqi: number,
  pm25: number,
  category: CpcbCategory,
  profile: HouseholdProfile,
  language: SupportedLanguage
): Promise<ValidatedDailyPlanSections | null> {
  const genAI = getGeminiClient();
  if (!genAI) {
    console.warn('GEMINI_API_KEY not configured; using rule-based fallback.');
    return null;
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const languagePrompt =
    language === 'hi'
      ? 'Respond strictly in fluent, natural Hindi (हिंदी). All titles, actions, whoBenefits, and whyItHelps fields must be in Devanagari Hindi.'
      : language === 'mr'
      ? 'Respond strictly in fluent, natural Marathi (मराठी). All titles, actions, whoBenefits, and whyItHelps fields must be in Devanagari Marathi.'
      : 'Respond in clean, warm, accessible Indian English.';

  const prompt = `
${CONSTITUTION_SYSTEM_PROMPT}

CURRENT CONTEXT:
- City: ${city}
- AQI: ${aqi} (Indian CPCB Category: ${category})
- PM2.5: ${pm25} µg/m³
- Household Profile:
  - Vulnerable Members: ${profile.members.join(', ') || 'None reported'}
  - Commute Mode: ${profile.commuteMode}
  - Home Type: ${profile.homeType}
  - Purifier Owned: ${profile.hasPurifier ? 'Yes' : 'No (strictly focus on low-cost/DIY hacks)'}
  - Cooking Fuel: ${profile.cookingFuel}
  - Budget Level: ${profile.budgetLevel}
- Target Language: ${languagePrompt}

TASK:
Generate a personalized 4-section daily smog protection plan as a valid JSON object matching this exact schema:
{
  "morningRoutine": [
    {
      "title": "Short title",
      "action": "Specific practical step",
      "whoBenefits": "e.g., Two-wheeler commuters & infants",
      "impactLevel": "Low" | "Medium" | "High",
      "whyItHelps": "Hedged explanation without fake percentage stats"
    }
  ],
  "indoorHacks": [ ... 1 or 2 items ... ],
  "kidsEldersCare": [ ... 1 or 2 items ... ],
  "sustainableAlternatives": [ ... 1 or 2 items ... ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const rawJson = JSON.parse(text);

    // Validate using Zod schema
    const parsed = DailyPlanZodSchema.safeParse(rawJson);
    if (!parsed.success) {
      console.error('Gemini plan output failed Zod schema validation:', parsed.error);
      return null;
    }

    return parsed.data;
  } catch (err) {
    console.error('Error invoking Gemini API for plan:', err);
    return null;
  }
}

/**
 * Handles conversational follow-up queries for "Ask How In थंडीत"
 */
export async function generateGeminiChat(
  messages: Array<{ sender: 'user' | 'assistant'; text: string }>,
  context: {
    city: string;
    aqi: number;
    category: CpcbCategory;
    language: SupportedLanguage;
    profile: HouseholdProfile;
  }
): Promise<string> {
  const genAI = getGeminiClient();
  if (!genAI) {
    const offlineMsg =
      context.language === 'hi'
        ? 'क्षमा करें, AI सेवा वर्तमान में ऑफ़लाइन है। कृपया अपने शहर के AQI और प्रोफ़ाइल के अनुसार सामान्य घरेलू उपाय अपनाएं। यदि सांस की तकलीफ हो, तो तुरंत डॉक्टर से परामर्श लें।'
        : context.language === 'mr'
        ? 'माफ करा, AI सेवा सध्या बंद आहे. कृपया हवेच्या दर्जानुसार घरगुती उपाय योजा. श्वसनाचा त्रास जाणवल्यास डॉक्टरांचा सल्ला घ्या.'
        : 'The AI assistant is currently in offline mode. Please follow general household smog precautions based on your local AQI. Consult a doctor for any breathing discomfort.';
    return offlineMsg;
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.3,
    },
  });

  const chatHistory = messages.map((m) => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');

  const languagePrompt =
    context.language === 'hi'
      ? 'Reply strictly in natural Hindi (हिंदी).'
      : context.language === 'mr'
      ? 'Reply strictly in natural Marathi (मराठी).'
      : 'Reply in clear Indian English.';

  const prompt = `
${CONSTITUTION_SYSTEM_PROMPT}

CONTEXT:
- City: ${context.city} | Current AQI: ${context.aqi} (${context.category})
- Household: ${context.profile.members.join(', ') || 'No vulnerable members reported'} | Commute: ${context.profile.commuteMode} | Purifier: ${context.profile.hasPurifier ? 'Yes' : 'No'}
- Language: ${languagePrompt}

CONVERSATION HISTORY:
${chatHistory}

INSTRUCTION:
Answer the latest user message with empathetic, practical smog-protection advice.
- If the user asks for medical diagnosis, prescriptions, or drug dosage (e.g. inhaler puffs, cough syrups), REFUSE to provide medical dosing/diagnosis, clearly warn them, and urge immediate consultation with a certified doctor.
- Conclude every response with a concise line reminding them: "(Not medical advice. Consult a doctor for clinical symptoms.)"
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('Error generating chat response:', err);
    return 'Unable to connect to AI assistant at this moment. Please check your internet connection or try again later.';
  }
}
