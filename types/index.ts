// Canonical domain types matching data-model.md

export type VulnerableMember = 'children' | 'elderly' | 'respiratory' | 'pregnant';

export type CommuteMode = 'walk' | 'two_wheeler' | 'auto' | 'car' | 'public_transit';

export type HomeType = 'apartment' | 'independent_house';

export type CookingFuel = 'lpg' | 'induction' | 'biomass';

export type BudgetLevel = 'low' | 'medium' | 'high';

export interface HouseholdProfile {
  members: VulnerableMember[];
  commuteMode: CommuteMode;
  homeType: HomeType;
  hasPurifier: boolean;
  cookingFuel: CookingFuel;
  budgetLevel: BudgetLevel;
  lastUpdated: string; // ISO 8601
}

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface UserSettings {
  language: SupportedLanguage;
  savedCity?: {
    name: string;
    latitude: number;
    longitude: number;
    state?: string;
  };
}

export type CpcbCategory = 
  | 'Good' 
  | 'Satisfactory' 
  | 'Moderate' 
  | 'Poor' 
  | 'Very Poor' 
  | 'Severe';

export interface HourlyForecastItem {
  time: string;
  pm25: number;
  aqi: number;
}

export interface AirQualitySnapshot {
  city: string;
  latitude: number;
  longitude: number;
  aqi: number;
  pm25: number;
  pm10: number;
  category: CpcbCategory;
  severityColor: string;
  plainMeaning: string;
  hourlyForecast: HourlyForecastItem[];
  isLive: boolean;
  fetchedAt: string;
}

export type ImpactLevel = 'Low' | 'Medium' | 'High';

export interface ActionItem {
  id: string;
  title: string;
  action: string;
  whoBenefits: string;
  impactLevel: ImpactLevel;
  whyItHelps: string;
}

export interface DailyPlanResponse {
  date: string;
  city: string;
  aqi: number;
  category: CpcbCategory;
  language: SupportedLanguage;
  sections: {
    morningRoutine: ActionItem[];
    indoorHacks: ActionItem[];
    kidsEldersCare: ActionItem[];
    sustainableAlternatives: ActionItem[];
  };
  medicalDisclaimer: string;
  isFallback: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface CommunityCardData {
  city: string;
  date: string;
  aqi: number;
  category: CpcbCategory;
  topActions: string[];
  shareTextPayload: string;
}
