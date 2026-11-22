'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { SupportedLanguage } from '@/types';

interface MedicalDisclaimerProps {
  language?: SupportedLanguage;
  className?: string;
}

export function MedicalDisclaimer({ language = 'en', className = '' }: MedicalDisclaimerProps) {
  const messages: Record<SupportedLanguage, string> = {
    en: 'Important: This app provides environmental harm-reduction strategies and is not medical advice. For asthma attacks, severe coughing, or distress in infants/seniors, consult a qualified physician immediately.',
    hi: 'महत्वपूर्ण सूचना: यह ऐप प्रदूषण से बचाव के उपाय बताता है, यह कोई डॉक्टरी सलाह नहीं है। सांस फूलने, तेज खांसी या किसी भी गंभीर स्थिति में तुरंत डॉक्टर से संपर्क करें।',
    mr: 'महत्त्वाची सूचना: हे ॲप प्रदूषणापासून बचावाचे उपाय सुचवते, हा वैद्यकीय सल्ला नाही. दम लागल्यास किंवा लहान मुलांची/ज्येष्ठांची प्रकृती बिघडल्यास तात्काळ डॉक्टरांशी संपर्क साधा.',
  };

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs sm:text-sm leading-relaxed ${className}`}
      role="alert"
    >
      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold">{language === 'hi' ? 'सलाह: ' : language === 'mr' ? 'सूचना: ' : 'Notice: '}</span>
        {messages[language]}
      </div>
    </div>
  );
}
