'use client';

import { HouseholdProfile, UserSettings, SupportedLanguage } from '@/types';

const PROFILE_KEY = 'how_in_thandit_profile_v1';
const SETTINGS_KEY = 'how_in_thandit_settings_v1';

export const DEFAULT_PROFILE: HouseholdProfile = {
  members: ['children'],
  commuteMode: 'two_wheeler',
  homeType: 'apartment',
  hasPurifier: false,
  cookingFuel: 'lpg',
  budgetLevel: 'low',
  lastUpdated: new Date().toISOString(),
};

export const DEFAULT_SETTINGS: UserSettings = {
  language: 'en',
  savedCity: {
    name: 'Pune',
    latitude: 18.5204,
    longitude: 73.8567,
    state: 'Maharashtra',
  },
};

export function loadProfile(): HouseholdProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch (err) {
    console.error('Failed to load profile from localStorage:', err);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: HouseholdProfile): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = { ...profile, lastUpdated: new Date().toISOString() };
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save profile to localStorage:', err);
  }
}

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (err) {
    console.error('Failed to load settings from localStorage:', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
  }
}
