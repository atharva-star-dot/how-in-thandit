'use client';

import React from 'react';
import { Wind, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AirQualitySnapshot, SupportedLanguage } from '@/types';
import { CPCB_BANDS, getCpcbCategory } from '@/lib/aqi';

interface AirSnapshotCardProps {
  snapshot: AirQualitySnapshot;
  language: SupportedLanguage;
}

export function AirSnapshotCard({ snapshot, language }: AirSnapshotCardProps) {
  const band = CPCB_BANDS[snapshot.category];

  const categoryLabels: Record<string, Record<SupportedLanguage, string>> = {
    Good: { en: 'Good', hi: 'अच्छा (Good)', mr: 'उत्कृष्ट (Good)' },
    Satisfactory: { en: 'Satisfactory', hi: 'संतोषजनक', mr: 'समाधानकारक' },
    Moderate: { en: 'Moderate', hi: 'मध्यम', mr: 'मध्यम' },
    Poor: { en: 'Poor', hi: 'खराब (Poor)', mr: 'वाईट (Poor)' },
    'Very Poor': { en: 'Very Poor', hi: 'बहुत खराब', mr: 'अतिशय वाईट' },
    Severe: { en: 'Severe / Hazardous', hi: 'अत्यंत गंभीर (Severe)', mr: 'धोकादायक (Severe)' },
  };

  const localizedCategory = categoryLabels[snapshot.category]?.[language] || snapshot.category;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Banner with Status */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium">
          <Wind className="w-4 h-4 text-slate-400" />
          <span>{snapshot.city}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {snapshot.isLive ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              {language === 'hi' ? 'लाइव डेटा' : language === 'mr' ? 'थेट माहिती' : 'Live Data'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <AlertCircle className="w-3 h-3" />
              {language === 'hi' ? 'मौसमी अनुमान (ऑफलाइन)' : language === 'mr' ? 'हंगामी अंदाज' : 'Seasonal Baseline'}
            </span>
          )}
        </div>
      </div>

      {/* Main AQI Section */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {language === 'hi' ? 'वायु गुणवत्ता सूचकांक (AQI)' : language === 'mr' ? 'हवेची गुणवत्ता (AQI)' : 'Air Quality Index (AQI)'}
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span
                className="text-5xl sm:text-6xl font-extrabold tracking-tight"
                style={{ color: band.color }}
              >
                {snapshot.aqi}
              </span>
              <span
                className={`text-sm sm:text-base font-bold px-3 py-1 rounded-full ${band.badgeBg} ${band.textColor}`}
              >
                {localizedCategory}
              </span>
            </div>
          </div>

          {/* Particulate Badges */}
          <div className="flex gap-2 sm:gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 self-start sm:self-auto">
            <div className="px-2.5 py-1 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">PM2.5</div>
              <div className="text-sm font-semibold text-slate-700">{snapshot.pm25} <span className="text-[10px] text-slate-400 font-normal">µg/m³</span></div>
            </div>
            <div className="w-[1px] bg-slate-200" />
            <div className="px-2.5 py-1 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">PM10</div>
              <div className="text-sm font-semibold text-slate-700">{snapshot.pm10} <span className="text-[10px] text-slate-400 font-normal">µg/m³</span></div>
            </div>
          </div>
        </div>

        {/* Plain Language Meaning Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p className="font-medium text-slate-900 mb-0.5">
            {language === 'hi' ? 'आज का मतलब क्या है?' : language === 'mr' ? 'याचा आज काय अर्थ होतो?' : 'What this means for your family:'}
          </p>
          <p className="text-slate-600">{snapshot.plainMeaning}</p>
        </div>

        {/* Hourly Trend Bar */}
        {snapshot.hourlyForecast.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'hi' ? 'आज का प्रति घंटा रुझान' : language === 'mr' ? 'आजचा तासांचा अंदाज' : 'Hourly Smog Forecast'}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {snapshot.hourlyForecast.slice(0, 8).map((hour, idx) => {
                const hourBand = CPCB_BANDS[getCpcbCategory(hour.aqi)];
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 min-w-[58px] text-center"
                  >
                    <span className="text-[11px] text-slate-400 font-medium">{hour.time}</span>
                    <span
                      className="text-xs font-bold my-1"
                      style={{ color: hourBand.color }}
                    >
                      {hour.aqi}
                    </span>
                    <span className="text-[9px] text-slate-400">{hour.pm25} µg</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
