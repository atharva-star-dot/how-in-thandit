'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Wind,
  Search,
  MapPin,
  SlidersHorizontal,
  MessageCircle,
  Users,
  Sparkles,
  RefreshCw,
  Loader2,
  Info,
} from 'lucide-react';
import { AirQualitySnapshot, HouseholdProfile, DailyPlanResponse, SupportedLanguage, CommunityCardData } from '@/types';
import { loadProfile, loadSettings, saveSettings, DEFAULT_PROFILE, DEFAULT_SETTINGS } from '@/lib/storage';
import { searchCities, fetchAirQuality, GeocodedCity } from '@/lib/open-meteo';
import { getCpcbCategory } from '@/lib/aqi';
import { AirSnapshotCard } from '@/components/AirSnapshotCard';
import { ProfileDrawer } from '@/components/ProfileDrawer';
import { DailyPlanSection } from '@/components/DailyPlanSection';
import { ChatDrawer } from '@/components/ChatDrawer';
import { CommunityCard } from '@/components/CommunityCard';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';

export default function HomePage() {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [profile, setProfile] = useState<HouseholdProfile>(DEFAULT_PROFILE);
  const [snapshot, setSnapshot] = useState<AirQualitySnapshot | null>(null);
  const [plan, setPlan] = useState<DailyPlanResponse | null>(null);
  const [communityData, setCommunityData] = useState<CommunityCardData | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodedCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<GeocodedCity | null>(null);

  const [isLoadingAqi, setIsLoadingAqi] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const savedProfile = loadProfile();
    const savedSettings = loadSettings();
    setProfile(savedProfile);
    setLanguage(savedSettings.language || 'en');
    if (savedSettings.savedCity) {
      const city: GeocodedCity = {
        id: 0,
        name: savedSettings.savedCity.name,
        latitude: savedSettings.savedCity.latitude,
        longitude: savedSettings.savedCity.longitude,
        country: 'IN',
        admin1: savedSettings.savedCity.state,
      };
      setSelectedCity(city);
      setSearchQuery(savedSettings.savedCity.name);
      loadAqi(city, savedSettings.language || 'en');
    }
  }, []);

  const loadAqi = useCallback(async (city: GeocodedCity, lang: SupportedLanguage) => {
    setIsLoadingAqi(true);
    setPlan(null);
    try {
      const aqiSnapshot = await fetchAirQuality(city.latitude, city.longitude, city.name, lang);
      setSnapshot(aqiSnapshot);
    } catch (err) {
      console.error('Failed to fetch AQI:', err);
    } finally {
      setIsLoadingAqi(false);
    }
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    const settings = loadSettings();
    saveSettings({ ...settings, language: lang });
  };

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const results = await searchCities(q);
    setSuggestions(results);
  };

  const handleCitySelect = async (city: GeocodedCity) => {
    setSelectedCity(city);
    setSearchQuery(`${city.name}${city.admin1 ? `, ${city.admin1}` : ''}`);
    setSuggestions([]);
    setPlan(null);
    const settings = loadSettings();
    saveSettings({
      ...settings,
      savedCity: { name: city.name, latitude: city.latitude, longitude: city.longitude, state: city.admin1 },
    });
    await loadAqi(city, language);
  };

  const handleGeoLocate = () => {
    if (typeof navigator.geolocation === 'undefined') return;
    setIsLoadingAqi(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const detectedCity: GeocodedCity = {
          id: -1,
          name: 'Current Location',
          latitude: lat,
          longitude: lon,
          country: 'IN',
        };
        setSelectedCity(detectedCity);
        setSearchQuery('Current Location (GPS)');
        await loadAqi(detectedCity, language);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setIsLoadingAqi(false);
      }
    );
  };

  const generatePlan = async () => {
    if (!snapshot || !selectedCity) return;
    setIsGeneratingPlan(true);
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: snapshot.city,
          aqi: snapshot.aqi,
          pm25: snapshot.pm25,
          category: snapshot.category,
          language,
          profile,
        }),
      });

      const data: DailyPlanResponse = await res.json();
      setPlan(data);

      // Build community card data
      const communityActions = [
        ...(data.sections.sustainableAlternatives.map((i) => i.title).slice(0, 2)),
        ...(data.sections.indoorHacks.map((i) => i.title).slice(0, 1)),
      ];

      const shareText = [
        language === 'hi'
          ? `🌫️ ${snapshot.city} — AQI: ${snapshot.aqi} (${snapshot.category})`
          : language === 'mr'
          ? `🌫️ ${snapshot.city} — AQI: ${snapshot.aqi} (${snapshot.category})`
          : `🌫️ ${snapshot.city} Air Quality Alert — AQI: ${snapshot.aqi} (${snapshot.category})`,
        '',
        language === 'hi' ? 'आज के शीर्ष 3 उपाय:' : language === 'mr' ? 'आजचे ३ उपाय:' : 'Top 3 Community Actions:',
        ...communityActions.map((a, i) => `${i + 1}. ${a}`),
        '',
        'How In थंडीत | Indian Family Winter Smog Protection',
      ].join('\n');

      setCommunityData({
        city: snapshot.city,
        date: new Date().toISOString().split('T')[0],
        aqi: snapshot.aqi,
        category: snapshot.category,
        topActions: communityActions,
        shareTextPayload: shareText,
      });
    } catch (err) {
      console.error('Failed to generate plan:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const headerLabels = {
    tagline: {
      en: 'Winter Smog & Air Pollution Family Guide',
      hi: 'सर्दियों की धुंध से परिवार की सुरक्षा',
      mr: 'हिवाळ्यातील धूरकट हवेपासून कुटुंबाचे संरक्षण',
    },
    searchPh: {
      en: 'Enter city (e.g. Pune, Delhi, Lucknow)',
      hi: 'शहर का नाम डालें (जैसे पुणे, दिल्ली)',
      mr: 'शहराचे नाव टाका (उदा. पुणे, मुंबई)',
    },
    gps: { en: 'Use GPS', hi: 'GPS', mr: 'GPS' },
    profile: { en: 'Profile', hi: 'प्रोफ़ाइल', mr: 'प्रोफाइल' },
    chat: { en: 'Ask', hi: 'सवाल', mr: 'सल्ला' },
    community: { en: 'Community', hi: 'सोसायटी', mr: 'सोसायटी' },
    generatePlan: { en: 'Generate Personalized Plan', hi: 'योजना बनाएं', mr: 'नियोजन करा' },
    generatingPlan: { en: 'Generating Plan...', hi: 'योजना बन रही है...', mr: 'नियोजन होत आहे...' },
    refreshAqi: { en: 'Refresh AQI', hi: 'AQI रिफ्रेश', mr: 'AQI रिफ्रेश करा' },
    noCity: {
      en: 'Search for your city or use GPS to get started.',
      hi: 'शुरू करने के लिए अपना शहर खोजें या GPS उपयोग करें।',
      mr: 'सुरू करण्यासाठी शहर शोधा किंवा GPS वापरा.',
    },
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Wind className="w-5 h-5 text-sky-600" />
            <span className="font-black text-sm text-slate-900 tracking-tight">How In थंडीत</span>
          </div>
          <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto w-full px-4 py-5 space-y-5 flex-1 pb-28">
        {/* Sub-heading */}
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            {headerLabels.tagline[language]}
          </h1>
        </div>

        {/* Search & GPS Bar */}
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={headerLabels.searchPh[language]}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 shadow-xs"
              />
            </div>
            <button
              onClick={handleGeoLocate}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-sky-500 hover:text-sky-700 transition text-xs font-medium flex items-center gap-1.5 shadow-xs"
              title={headerLabels.gps[language]}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">{headerLabels.gps[language]}</span>
            </button>
          </div>

          {/* City Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden max-h-52 overflow-y-auto">
              {suggestions.map((city) => (
                <li key={city.id}>
                  <button
                    type="button"
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-800 flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div>
                      <span className="font-medium">{city.name}</span>
                      {city.admin1 && <span className="text-slate-400">, {city.admin1}</span>}
                      <span className="text-slate-400 text-xs"> {city.country}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Loading AQI */}
        {isLoadingAqi && (
          <div className="flex items-center justify-center gap-2 py-10 text-slate-400 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
            <span>Fetching live air quality data...</span>
          </div>
        )}

        {/* AQI Snapshot Card */}
        {!isLoadingAqi && snapshot && <AirSnapshotCard snapshot={snapshot} language={language} />}

        {/* No city selected */}
        {!isLoadingAqi && !snapshot && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
            <Wind className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">{headerLabels.noCity[language]}</p>
          </div>
        )}

        {/* Quick Action Buttons (Plan, Refresh, Profile, Chat, Community) */}
        {snapshot && (
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={generatePlan}
              disabled={isGeneratingPlan}
              className="flex-1 min-w-[180px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition disabled:opacity-60"
            >
              {isGeneratingPlan ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{headerLabels.generatingPlan[language]}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{headerLabels.generatePlan[language]}</span>
                </>
              )}
            </button>

            <button
              onClick={() => loadAqi(selectedCity!, language)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-400 transition shadow-xs"
              title={headerLabels.refreshAqi[language]}
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-slate-400 text-xs font-medium transition shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{headerLabels.profile[language]}</span>
            </button>

            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-slate-400 text-xs font-medium transition shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{headerLabels.chat[language]}</span>
            </button>

            {communityData && (
              <button
                onClick={() => setIsCommunityOpen(true)}
                className="flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-slate-400 text-xs font-medium transition shadow-xs"
              >
                <Users className="w-4 h-4" />
                <span>{headerLabels.community[language]}</span>
              </button>
            )}
          </div>
        )}

        {/* Medical Disclaimer */}
        {snapshot && <MedicalDisclaimer language={language} />}

        {/* AI Daily Plan */}
        {plan && <DailyPlanSection plan={plan} language={language} />}

        {/* Footer spacing */}
        <div className="h-4" />
      </div>

      {/* Drawers & Modals */}
      {snapshot && (
        <>
          <ProfileDrawer
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            profile={profile}
            onProfileUpdated={(p) => setProfile(p)}
            language={language}
          />

          <ChatDrawer
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            city={snapshot.city}
            aqi={snapshot.aqi}
            category={snapshot.category}
            profile={profile}
            language={language}
          />

          {communityData && (
            <CommunityCard
              isOpen={isCommunityOpen}
              onClose={() => setIsCommunityOpen(false)}
              cardData={communityData}
              language={language}
            />
          )}
        </>
      )}
    </main>
  );
}
