'use client';

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { ImpactLevel, SupportedLanguage } from '@/types';

interface ImpactBadgeProps {
  level: ImpactLevel;
  whoBenefits?: string;
  whyItHelps?: string;
  language?: SupportedLanguage;
}

export function ImpactBadge({ level, whoBenefits, whyItHelps, language = 'en' }: ImpactBadgeProps) {
  const levelStyles: Record<ImpactLevel, { bg: string; text: string; border: string; label: Record<SupportedLanguage, string> }> = {
    High: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      label: { en: 'High Impact', hi: 'असरदार उपाय', mr: 'महत्त्वाचा उपाय' },
    },
    Medium: {
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-200',
      label: { en: 'Moderate Impact', hi: 'मध्यम असरदार', mr: 'मध्यम उपाय' },
    },
    Low: {
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-200',
      label: { en: 'Low Effort/Impact', hi: 'हल्का असर', mr: 'साधा उपाय' },
    },
  };

  const current = levelStyles[level] || levelStyles.Medium;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${current.bg} ${current.text} ${current.border}`}
        >
          <ShieldCheck className="w-3 h-3" />
          {current.label[language] || current.label.en}
        </span>
        {whoBenefits && (
          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-none">
            • {whoBenefits}
          </span>
        )}
      </div>

      {whyItHelps && (
        <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-slate-50 text-[11px] sm:text-xs text-slate-600 border border-slate-100 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-700">
              {language === 'hi' ? 'यह क्यों मदद करता है: ' : language === 'mr' ? 'याचा उपयोग कसा होतो: ' : 'Why this helps: '}
            </strong>
            {whyItHelps}
          </div>
        </div>
      )}
    </div>
  );
}
