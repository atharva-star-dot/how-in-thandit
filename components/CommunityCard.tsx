'use client';

import React, { useState } from 'react';
import { X, Share2, Copy, Check } from 'lucide-react';
import { CommunityCardData, SupportedLanguage } from '@/types';
import { CPCB_BANDS } from '@/lib/aqi';

interface CommunityCardProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: CommunityCardData;
  language: SupportedLanguage;
}

export function CommunityCard({ isOpen, onClose, cardData, language }: CommunityCardProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const band = CPCB_BANDS[cardData.category];

  const labels = {
    title: { en: 'Society & School Air Digest', hi: 'सोसायटी व स्कूल के लिए आज का बुलेटिन', mr: 'सोसायटी आणि शाळेसाठी आजचा फलक' },
    topActions: { en: 'Top 3 Community Actions', hi: 'शीर्ष 3 समुदाय उपाय', mr: 'आजचे ३ महत्त्वाचे उपाय' },
    share: { en: 'Share via Apps', hi: 'शेयर करें', mr: 'शेअर करा' },
    copy: { en: 'Copy to Clipboard', hi: 'क्लिपबोर्ड पर कॉपी करें', mr: 'क्लिपबोर्डवर कॉपी करा' },
    copied: { en: 'Copied!', hi: 'कॉपी हो गया!', mr: 'कॉपी झाले!' },
    via: { en: 'via How In थंडीत', hi: '— How In थंडीत', mr: '— How In थंडीत' },
    today: { en: 'Today', hi: 'आज', mr: 'आज' },
    cpcb: { en: 'Indian CPCB Standard', hi: 'सीपीसीबी मानक', mr: 'सीपीसीबी मानके' },
  };

  const categoryLabels: Record<string, Record<SupportedLanguage, string>> = {
    Good: { en: 'Good', hi: 'अच्छा', mr: 'उत्कृष्ट' },
    Satisfactory: { en: 'Satisfactory', hi: 'संतोषजनक', mr: 'समाधानकारक' },
    Moderate: { en: 'Moderate', hi: 'मध्यम', mr: 'मध्यम' },
    Poor: { en: 'Poor', hi: 'खराब', mr: 'वाईट' },
    'Very Poor': { en: 'Very Poor', hi: 'बहुत खराब', mr: 'अतिशय वाईट' },
    Severe: { en: 'Severe / Hazardous', hi: 'अत्यंत गंभीर', mr: 'धोकादायक' },
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardData.shareTextPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = cardData.shareTextPayload;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (typeof navigator.share !== 'undefined') {
      try {
        await navigator.share({
          title: 'How In थंडीत – Air Quality Alert',
          text: cardData.shareTextPayload,
        });
      } catch (err) {
        console.warn('Share canceled:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 flex items-center justify-between bg-slate-50 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{labels.title[language]}</h2>
            <p className="text-xs text-slate-500">{labels.via[language]}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Card Content (WhatsApp-friendly layout) */}
        <div className="p-5 space-y-5">
          {/* City + Date + AQI Block */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">📍 {cardData.city}</p>
              <p className="text-xs text-slate-400">
                {labels.today[language]}, {cardData.date}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{labels.cpcb[language]}</p>
            </div>

            <div className="text-right">
              <div
                className="text-5xl font-extrabold leading-none"
                style={{ color: band.color }}
              >
                {cardData.aqi}
              </div>
              <div
                className={`text-xs font-bold mt-0.5 px-2.5 py-0.5 rounded-full inline-block ${band.badgeBg} ${band.textColor}`}
              >
                {categoryLabels[cardData.category]?.[language] || cardData.category}
              </div>
            </div>
          </div>

          {/* AQI Color Bar */}
          <div
            className="h-2 rounded-full"
            style={{ background: `linear-gradient(to right, #16a34a, #ca8a04, #ef4444, #7f1d1d)` }}
          />

          {/* Top 3 Community Actions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
              {labels.topActions[language]}
            </h4>
            <ul className="space-y-1.5">
              {cardData.topActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 mt-0.5 shrink-0">
                    {idx + 1}.
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Attribution */}
          <p className="text-[11px] text-slate-400 text-center">
            {language === 'hi'
              ? 'How In थंडीत | भारतीय परिवारों के लिए वायु प्रदूषण सुरक्षा'
              : language === 'mr'
              ? 'How In थंडीत | भारतीय कुटुंबांसाठी हवेचे संरक्षण'
              : 'How In थंडीत | Indian Family Winter Smog Protection'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-2">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            {labels.share[language]}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                {labels.copied[language]}
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                {labels.copy[language]}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
