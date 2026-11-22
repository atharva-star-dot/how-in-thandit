import { AirQualitySnapshot, SupportedLanguage } from '@/types';
import { calculateCpcbPm25Aqi, getCpcbCategory, getPlainLanguageMeaning, CPCB_BANDS } from './aqi';

export interface GeocodedCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State / Region
}

/**
 * Searches Indian and global cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<GeocodedCity[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmed
    )}&count=5&language=en&format=json`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding failed with status ${res.status}`);

    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((r: any) => ({
      id: r.id,
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      country: r.country,
      admin1: r.admin1,
    }));
  } catch (err) {
    console.error('Error fetching geocoded city:', err);
    return [];
  }
}

/**
 * Fetches real-time PM2.5, PM10, and hourly forecasts from Open-Meteo Air Quality API
 */
export async function fetchAirQuality(
  lat: number,
  lon: number,
  cityName: string,
  lang: SupportedLanguage = 'en'
): Promise<AirQualitySnapshot> {
  const nowIso = new Date().toISOString();

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,us_aqi&hourly=pm2_5,pm10,us_aqi&forecast_days=1&timezone=Asia%2FKolkata`;

    const res = await fetch(url, { next: { revalidate: 300 } }); // Cache 5 min
    if (!res.ok) throw new Error(`Air Quality API error ${res.status}`);

    const data = await res.json();
    const pm25 = data.current?.pm2_5 ?? 135;
    const pm10 = data.current?.pm10 ?? 210;

    const aqi = calculateCpcbPm25Aqi(pm25);
    const category = getCpcbCategory(aqi);
    const band = CPCB_BANDS[category];

    // Format hourly items
    const hourlyTimes: string[] = data.hourly?.time || [];
    const hourlyPm25: number[] = data.hourly?.pm2_5 || [];
    const hourlyForecast = hourlyTimes.slice(0, 12).map((t, i) => {
      const p = hourlyPm25[i] ?? pm25;
      return {
        time: t.includes('T') ? t.split('T')[1].slice(0, 5) : t,
        pm25: Math.round(p),
        aqi: calculateCpcbPm25Aqi(p),
      };
    });

    return {
      city: cityName,
      latitude: lat,
      longitude: lon,
      aqi,
      pm25: Math.round(pm25 * 10) / 10,
      pm10: Math.round(pm10 * 10) / 10,
      category,
      severityColor: band.color,
      plainMeaning: getPlainLanguageMeaning(category, lang),
      hourlyForecast,
      isLive: true,
      fetchedAt: nowIso,
    };
  } catch (err) {
    console.warn('Falling back to seasonal baseline due to API outage:', err);

    // Fallback: seasonal baseline (Principle II: Honesty About Data - explicitly marked as isLive: false)
    const fallbackPm25 = 145;
    const fallbackAqi = calculateCpcbPm25Aqi(fallbackPm25);
    const fallbackCategory = getCpcbCategory(fallbackAqi);

    return {
      city: cityName,
      latitude: lat,
      longitude: lon,
      aqi: fallbackAqi,
      pm25: fallbackPm25,
      pm10: 220,
      category: fallbackCategory,
      severityColor: CPCB_BANDS[fallbackCategory].color,
      plainMeaning: getPlainLanguageMeaning(fallbackCategory, lang),
      hourlyForecast: [],
      isLive: false,
      fetchedAt: nowIso,
    };
  }
}
