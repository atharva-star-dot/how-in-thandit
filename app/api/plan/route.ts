import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { generateGeminiPlan } from '@/lib/gemini';
import { generateFallbackPlan } from '@/lib/fallback-plan';
import { CpcbCategory, SupportedLanguage, HouseholdProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (10 requests / IP / hour)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, { limit: 10, windowMs: 60 * 60 * 1000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a while before generating a new plan.' },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const { city, aqi, pm25, category, language = 'en', profile } = body;

    if (!city || typeof aqi !== 'number' || !profile) {
      return NextResponse.json(
        { error: 'Missing required parameters: city, aqi, or profile.' },
        { status: 400 }
      );
    }

    const cpcbCategory = (category || 'Very Poor') as CpcbCategory;
    const lang = (language || 'en') as SupportedLanguage;
    const household = profile as HouseholdProfile;

    // 3. Attempt GenAI generation
    const aiSections = await generateGeminiPlan(city, aqi, pm25 || 120, cpcbCategory, household, lang);

    const todayStr = new Date().toISOString().split('T')[0];

    const disclaimerMap: Record<SupportedLanguage, string> = {
      en: 'Notice: This daily plan provides environmental harm-reduction strategies and is not medical advice. For asthma attacks, persistent cough, or respiratory distress, consult a certified physician immediately.',
      hi: 'महत्वपूर्ण: यह योजना केवल वायु प्रदूषण से बचाव के उपाय बताती है, चिकित्सीय परामर्श नहीं। सांस की तकलीफ होने पर तुरंत डॉक्टर से संपर्क करें।',
      mr: 'सूचना: हे नियोजन केवळ हवेच्या प्रदूषणापासून संरक्षणासाठी आहे, कोणताही वैद्यकीय सल्ला नाही. प्रकृती बिघडल्यास डॉक्टरांचा सल्ला घ्या.',
    };

    if (aiSections) {
      return NextResponse.json({
        date: todayStr,
        city,
        aqi,
        category: cpcbCategory,
        language: lang,
        sections: aiSections,
        medicalDisclaimer: disclaimerMap[lang],
        isFallback: false,
      });
    }

    // 4. Graceful fallback to deterministic rule-based plan (Constitution Principle II)
    const fallbackPlan = generateFallbackPlan(city, aqi, cpcbCategory, household, lang);
    return NextResponse.json(fallbackPlan);
  } catch (err) {
    console.error('Unhandled error in /api/plan route:', err);
    return NextResponse.json(
      { error: 'Internal server error processing daily plan.' },
      { status: 500 }
    );
  }
}
