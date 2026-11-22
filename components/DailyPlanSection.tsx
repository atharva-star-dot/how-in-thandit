'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Sun,
  Home,
  Heart,
  Leaf,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { DailyPlanResponse, SupportedLanguage, ActionItem } from '@/types';
import { ImpactBadge } from './ImpactBadge';

interface DailyPlanSectionProps {
  plan: DailyPlanResponse;
  language: SupportedLanguage;
}

export function DailyPlanSection({ plan, language }: DailyPlanSectionProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    morning: true,
    indoor: true,
    kidsElders: true,
    sustainable: true,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const sectionTitles = {
    morning: {
      en: 'Morning & Commute Routine',
      hi: 'सुबह और यात्रा की दिनचर्या',
      mr: 'सकाळची आणि प्रवासाची दिनचर्या',
      icon: Sun,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    indoor: {
      en: 'Indoor Air Quality Hacks',
      hi: 'घर की हवा साफ रखने के नुस्खे',
      mr: 'घरातील हवा स्वच्छ ठेवण्याचे उपाय',
      icon: Home,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    kidsElders: {
      en: 'Kids & Elders Protection',
      hi: 'बच्चों और बुजुर्गों की सुरक्षा',
      mr: 'लहान मुले आणि ज्येष्ठांची काळजी',
      icon: Heart,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    sustainable: {
      en: 'Reduce Our Own Emissions',
      hi: 'खुद प्रदूषण कम करने के विकल्प',
      mr: 'स्वतःचे प्रदूषण कमी करण्याचे मार्ग',
      icon: Leaf,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  };

  const renderItemList = (items: ActionItem[]) => {
    if (!items || items.length === 0) {
      return (
        <p className="text-xs text-slate-400 italic py-2">
          {language === 'hi'
            ? 'कोई विशेष उपाय उपलब्ध नहीं है।'
            : language === 'mr'
            ? 'कोणतेही विशेष नियोजन उपलब्ध नाही.'
            : 'No specific actions required.'}
        </p>
      );
    }

    return (
      <div className="space-y-4 pt-2">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-shadow shadow-xs space-y-3"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-800 leading-snug">{item.title}</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{item.action}</p>
            </div>

            <ImpactBadge
              level={item.impactLevel}
              whoBenefits={item.whoBenefits}
              whyItHelps={item.whyItHelps}
              language={language}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {language === 'hi'
              ? 'आज की व्यक्तिगत सुरक्षा योजना'
              : language === 'mr'
              ? 'आजचे वैयक्तिक नियोजन'
              : "Today's Personalized Action Plan"}
          </h3>
        </div>

        {plan.isFallback && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            {language === 'hi' ? 'मौसमी मार्गदर्शक' : language === 'mr' ? 'हंगामी नियोजन' : 'Seasonal Baseline'}
          </span>
        )}
      </div>

      {/* 4 Accordion Categories */}
      <div className="space-y-3">
        {/* 1. Morning Routine */}
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
          <button
            onClick={() => toggleSection('morning')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${sectionTitles.morning.bg}`}>
                <Sun className={`w-4 h-4 ${sectionTitles.morning.color}`} />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {sectionTitles.morning[language]}
              </span>
            </div>
            {openSections.morning ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {openSections.morning && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100">
              {renderItemList(plan.sections.morningRoutine)}
            </div>
          )}
        </div>

        {/* 2. Indoor Hacks */}
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
          <button
            onClick={() => toggleSection('indoor')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${sectionTitles.indoor.bg}`}>
                <Home className={`w-4 h-4 ${sectionTitles.indoor.color}`} />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {sectionTitles.indoor[language]}
              </span>
            </div>
            {openSections.indoor ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {openSections.indoor && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100">
              {renderItemList(plan.sections.indoorHacks)}
            </div>
          )}
        </div>

        {/* 3. Kids & Elders Protection */}
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
          <button
            onClick={() => toggleSection('kidsElders')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${sectionTitles.kidsElders.bg}`}>
                <Heart className={`w-4 h-4 ${sectionTitles.kidsElders.color}`} />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {sectionTitles.kidsElders[language]}
              </span>
            </div>
            {openSections.kidsElders ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {openSections.kidsElders && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100">
              {renderItemList(plan.sections.kidsEldersCare)}
            </div>
          )}
        </div>

        {/* 4. Sustainable Alternatives */}
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
          <button
            onClick={() => toggleSection('sustainable')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${sectionTitles.sustainable.bg}`}>
                <Leaf className={`w-4 h-4 ${sectionTitles.sustainable.color}`} />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {sectionTitles.sustainable[language]}
              </span>
            </div>
            {openSections.sustainable ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {openSections.sustainable && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100">
              {renderItemList(plan.sections.sustainableAlternatives)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
