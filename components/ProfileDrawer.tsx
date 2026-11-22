'use client';

import React, { useState } from 'react';
import { X, Users, Bike, Home, Wind, Flame, Wallet, Check } from 'lucide-react';
import {
  HouseholdProfile,
  VulnerableMember,
  CommuteMode,
  HomeType,
  CookingFuel,
  BudgetLevel,
  SupportedLanguage,
} from '@/types';
import { saveProfile } from '@/lib/storage';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HouseholdProfile;
  onProfileUpdated: (newProfile: HouseholdProfile) => void;
  language: SupportedLanguage;
}

export function ProfileDrawer({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
  language,
}: ProfileDrawerProps) {
  const [formData, setFormData] = useState<HouseholdProfile>(profile);
  const [savedBadge, setSavedBadge] = useState(false);

  if (!isOpen) return null;

  const toggleMember = (m: VulnerableMember) => {
    setFormData((prev) => {
      const exists = prev.members.includes(m);
      return {
        ...prev,
        members: exists ? prev.members.filter((x) => x !== m) : [...prev.members, m],
      };
    });
  };

  const handleSave = () => {
    saveProfile(formData);
    onProfileUpdated(formData);
    setSavedBadge(true);
    setTimeout(() => {
      setSavedBadge(false);
      onClose();
    }, 500);
  };

  const labels = {
    title: { en: 'Household Profile', hi: 'पारिवारिक प्रोफ़ाइल', mr: 'कुटुंबाची माहिती' },
    sub: {
      en: 'Customize advice for your family. Stored only in your browser (no account needed).',
      hi: 'सलाह को अपने परिवार के अनुसार ढालें। यह केवल आपके फ़ोन/ब्राउज़र में सुरक्षित रहता है।',
      mr: 'तुमच्या कुटुंबासाठी योग्य सल्ला मिळवा. ही माहिती फक्त तुमच्या फोनमध्ये सुरक्षित राहते.',
    },
    members: { en: 'Vulnerable Family Members', hi: 'संवेदनशील सदस्य', mr: 'घरातील संवेदनशील व्यक्ती' },
    children: { en: 'Children (<12 yrs)', hi: 'छोटे बच्चे (<12)', mr: 'लहान मुले (<12)' },
    elderly: { en: 'Elderly (60+ yrs)', hi: 'बुजुर्ग (60+)', mr: 'ज्येष्ठ नागरिक (60+)' },
    respiratory: { en: 'Asthma / Bronchitis', hi: 'दमा / सांस की तकलीफ', mr: 'दमा / श्वसनाचा त्रास' },
    pregnant: { en: 'Pregnant Members', hi: 'गर्भवती सदस्य', mr: 'गरोदर व्यक्ती' },
    commute: { en: 'Primary Commute Mode', hi: 'यात्रा का साधन', mr: 'प्रवासाचे साधन' },
    walk: { en: 'Walking', hi: 'पैदल', mr: 'चालत' },
    two_wheeler: { en: 'Two-Wheeler (Bike/Scooter)', hi: 'दोपहिया (बाइक/स्कूटर)', mr: 'दुचाकी (बाईक/स्कूटर)' },
    auto: { en: 'Open Auto', hi: 'ऑटो रिक्शा', mr: 'रिक्षा' },
    car: { en: 'Car (AC / Closed)', hi: 'कार (एसी/बंद)', mr: 'कार (एसी/बंद)' },
    public_transit: { en: 'Bus / Metro / Train', hi: 'बस / मेट्रो / ट्रेन', mr: 'बस / मेट्रो / लोकल' },
    home: { en: 'Home Type', hi: 'मकान का प्रकार', mr: 'घराचा प्रकार' },
    apartment: { en: 'Apartment (Flat)', hi: 'अपार्टमेंट (फ्लैट)', mr: 'अपार्टमेंट (फ्लॅट)' },
    independent_house: { en: 'Independent House', hi: 'स्वतंत्र मकान', mr: 'स्वतंत्र घर' },
    purifier: { en: 'Do you own an Air Purifier?', hi: 'क्या आपके पास एयर प्यूरीफायर है?', mr: 'एअर प्युरिफायर आहे का?' },
    yes: { en: 'Yes', hi: 'हाँ', mr: 'होय' },
    no: { en: 'No (Low-cost hacks)', hi: 'नहीं (सस्ते नुस्खे)', mr: 'नाही (घरगुती उपाय)' },
    fuel: { en: 'Cooking Fuel', hi: 'रसोई का ईंधन', mr: 'स्वयंपाकाचे इंधन' },
    lpg: { en: 'LPG Cylinder', hi: 'एलपीजी सिलेंडर', mr: 'एलपीजी सिलिंडर' },
    induction: { en: 'Electric / Induction', hi: 'इंडक्शन / बिजली', mr: 'इंडक्शन / वीज' },
    biomass: { en: 'Wood / Chulha / Biomass', hi: 'चूल्हा / लकड़ी', mr: 'चूल / लाकूड' },
    budget: { en: 'Budget Sensitivity', hi: 'बजट प्राथमिकता', mr: 'खर्चाची मर्यादा' },
    low: { en: 'Low (Zero cost / DIY hacks)', hi: 'कम (शून्य खर्च / देसी जुगाड़)', mr: 'कमी (विनामूल्य / घरगुती)' },
    medium: { en: 'Medium (N95 / essentials)', hi: 'मध्यम (N95 आदि जरूरी)', mr: 'मध्यम (मास्क आवश्यक)' },
    high: { en: 'High', hi: 'उच्च', mr: 'जास्त' },
    save: { en: 'Save & Update Plan', hi: 'सेव करें और योजना देखें', mr: 'जतन करा आणि नियोजन पहा' },
    saved: { en: 'Saved locally!', hi: 'सेव हो गया!', mr: 'जतन केले!' },
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">{labels.title[language]}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{labels.sub[language]}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Vulnerable Members */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              <Users className="w-4 h-4 text-sky-600" />
              {labels.members[language]}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['children', 'elderly', 'respiratory', 'pregnant'] as VulnerableMember[]).map((m) => {
                const active = formData.members.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMember(m)}
                    className={`p-2.5 text-xs text-left rounded-xl border font-medium transition flex items-center justify-between ${
                      active
                        ? 'border-sky-500 bg-sky-50 text-sky-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{labels[m][language]}</span>
                    {active && <Check className="w-3.5 h-3.5 text-sky-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Commute Mode */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              <Bike className="w-4 h-4 text-emerald-600" />
              {labels.commute[language]}
            </label>
            <div className="space-y-1.5">
              {(['two_wheeler', 'walk', 'auto', 'car', 'public_transit'] as CommuteMode[]).map((mode) => {
                const active = formData.commuteMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFormData({ ...formData, commuteMode: mode })}
                    className={`w-full p-2.5 text-xs text-left rounded-xl border transition flex items-center justify-between ${
                      active
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{labels[mode][language]}</span>
                    {active && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Home Type */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              <Home className="w-4 h-4 text-indigo-600" />
              {labels.home[language]}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['apartment', 'independent_house'] as HomeType[]).map((ht) => {
                const active = formData.homeType === ht;
                return (
                  <button
                    key={ht}
                    type="button"
                    onClick={() => setFormData({ ...formData, homeType: ht })}
                    className={`p-2.5 text-xs text-center rounded-xl border transition ${
                      active
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {labels[ht][language]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Air Purifier */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              <Wind className="w-4 h-4 text-cyan-600" />
              {labels.purifier[language]}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasPurifier: true })}
                className={`p-2.5 text-xs text-center rounded-xl border transition ${
                  formData.hasPurifier
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-900 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {labels.yes[language]}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasPurifier: false })}
                className={`p-2.5 text-xs text-center rounded-xl border transition ${
                  !formData.hasPurifier
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-900 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {labels.no[language]}
              </button>
            </div>
          </div>

          {/* Cooking Fuel */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              <Flame className="w-4 h-4 text-amber-600" />
              {labels.fuel[language]}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['lpg', 'induction', 'biomass'] as CookingFuel[]).map((fuel) => {
                const active = formData.cookingFuel === fuel;
                return (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => setFormData({ ...formData, cookingFuel: fuel })}
                    className={`p-2 text-xs text-center rounded-xl border transition ${
                      active
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {labels[fuel][language]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Level */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              <Wallet className="w-4 h-4 text-violet-600" />
              {labels.budget[language]}
            </label>
            <div className="space-y-1.5">
              {(['low', 'medium', 'high'] as BudgetLevel[]).map((lvl) => {
                const active = formData.budgetLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, budgetLevel: lvl })}
                    className={`w-full p-2.5 text-xs text-left rounded-xl border transition flex items-center justify-between ${
                      active
                        ? 'border-violet-500 bg-violet-50 text-violet-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{labels[lvl][language]}</span>
                    {active && <Check className="w-3.5 h-3.5 text-violet-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleSave}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm shadow-sm transition flex items-center justify-center gap-2"
          >
            {savedBadge ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{labels.saved[language]}</span>
              </>
            ) : (
              <span>{labels.save[language]}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
