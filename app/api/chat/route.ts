import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { generateGeminiChat } from '@/lib/gemini';
import { CpcbCategory, SupportedLanguage, HouseholdProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (20 requests / IP / hour)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, { limit: 20, windowMs: 60 * 60 * 1000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a while before sending more messages.' },
        { status: 429 }
      );
    }

    // 2. Parse request
    const body = await req.json();
    const { messages, context } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required.' },
        { status: 400 }
      );
    }

    const city = context?.city || 'Pune';
    const aqi = typeof context?.aqi === 'number' ? context.aqi : 250;
    const category = (context?.category || 'Poor') as CpcbCategory;
    const language = (context?.language || 'en') as SupportedLanguage;
    const profile = (context?.profile || {
      members: ['children'],
      commuteMode: 'two_wheeler',
      homeType: 'apartment',
      hasPurifier: false,
      cookingFuel: 'lpg',
      budgetLevel: 'low',
      lastUpdated: new Date().toISOString(),
    }) as HouseholdProfile;

    // 3. Safety Guardrail check for explicit medical dosing/diagnosis keywords (Constitution Principle I)
    const latestUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
    const medicalKeywords = [
      'dose',
      'dosage',
      'puffs',
      'mg',
      'prescribe',
      'prescription',
      'antibiotic',
      'inhaler puff',
      'syrup dose',
      'tablet',
      'diagnose',
      'diagnosis',
      'दवा की खुराक',
      'दवा का नाम',
      'औषधाचे प्रमाण',
      'डोस',
    ];

    const triggersMedicalGuard = medicalKeywords.some((kw) => latestUserMsg.includes(kw));

    if (triggersMedicalGuard) {
      const refusalMap: Record<SupportedLanguage, string> = {
        en: 'Safety Alert: "How In थंडीत" cannot diagnose medical illnesses or prescribe medication dosages (such as inhaler puffs or syrups). If you, your child, or an elderly family member is experiencing coughing, wheezing, or chest tightness, please consult a certified doctor or visit an urgent care clinic immediately.\n\n*Note: This app provides environmental smog precautions only and is not medical advice.*',
        hi: 'सुरक्षा सूचना: "How In थंडीत" चिकित्सीय निदान या दवाओं की खुराक (जैसे इनहेलर के पफ या सिरप) बताने के लिए अधिकृत नहीं है। यदि परिवार के किसी सदस्य को सांस लेने में कठिनाई या तेज खांसी हो, तो कृपया तुरंत किसी योग्य डॉक्टर से परामर्श लें।\n\n*ध्यान दें: यह केवल पर्यावरण से बचाव की सलाह है, चिकित्सकीय सलाह नहीं।*',
        mr: 'सुरक्षा सूचना: "How In थंडीत" कोणताही आजार तपासणे किंवा औषधांचे डोस (उदा. इन्हेलरचे पफ किंवा औषधाचे प्रमाण) सांगू शकत नाही. कुटुंबातील कोणालाही श्वास घेण्यास त्रास किंवा जास्त खोकला असल्यास त्वरित डॉक्टरांशी संपर्क साधा.\n\n*टीप: ही माहिती केवळ प्रदूषणापासून संरक्षणासाठी आहे, वैद्यकीय सल्ला नाही.*',
      };

      return NextResponse.json({
        reply: refusalMap[language],
        hasMedicalDisclaimer: true,
      });
    }

    // 4. Generate grounded AI response
    const reply = await generateGeminiChat(messages, {
      city,
      aqi,
      category,
      language,
      profile,
    });

    return NextResponse.json({
      reply,
      hasMedicalDisclaimer: true,
    });
  } catch (err) {
    console.error('Unhandled error in /api/chat route:', err);
    return NextResponse.json(
      { error: 'Internal server error processing chat.' },
      { status: 500 }
    );
  }
}
