'use client';

import React from 'react';
import { Languages } from 'lucide-react';
import { SupportedLanguage } from '@/types';

interface LanguageSwitcherProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
      <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 hidden sm:block" />
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => onLanguageChange(l.code)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
            currentLanguage === l.code
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
