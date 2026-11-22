import { CpcbCategory, SupportedLanguage } from '@/types';

export interface CpcbBandInfo {
  category: CpcbCategory;
  color: string;
  textColor: string;
  badgeBg: string;
  minAqi: number;
  maxAqi: number;
}

export const CPCB_BANDS: Record<CpcbCategory, CpcbBandInfo> = {
  Good: {
    category: 'Good',
    color: '#16a34a',
    textColor: 'text-green-800',
    badgeBg: 'bg-green-100',
    minAqi: 0,
    maxAqi: 50,
  },
  Satisfactory: {
    category: 'Satisfactory',
    color: '#65a30d',
    textColor: 'text-lime-800',
    badgeBg: 'bg-lime-100',
    minAqi: 51,
    maxAqi: 100,
  },
  Moderate: {
    category: 'Moderate',
    color: '#ca8a04',
    textColor: 'text-yellow-800',
    badgeBg: 'bg-yellow-100',
    minAqi: 101,
    maxAqi: 200,
  },
  Poor: {
    category: 'Poor',
    color: '#ea580c',
    textColor: 'text-orange-800',
    badgeBg: 'bg-orange-100',
    minAqi: 201,
    maxAqi: 300,
  },
  'Very Poor': {
    category: 'Very Poor',
    color: '#dc2626',
    textColor: 'text-red-800',
    badgeBg: 'bg-red-100',
    minAqi: 301,
    maxAqi: 400,
  },
  Severe: {
    category: 'Severe',
    color: '#7f1d1d',
    textColor: 'text-red-950',
    badgeBg: 'bg-red-200',
    minAqi: 401,
    maxAqi: 500,
  },
};

/**
 * Calculates Indian CPCB sub-index for PM2.5 (µg/m³)
 */
export function calculateCpcbPm25Aqi(pm25: number): number {
  if (pm25 <= 0) return 0;
  if (pm25 <= 30) return Math.round((50 / 30) * pm25);
  if (pm25 <= 60) return Math.round(50 + ((100 - 50) / (60 - 30)) * (pm25 - 30));
  if (pm25 <= 90) return Math.round(100 + ((200 - 100) / (90 - 60)) * (pm25 - 60));
  if (pm25 <= 120) return Math.round(200 + ((300 - 200) / (120 - 90)) * (pm25 - 90));
  if (pm25 <= 250) return Math.round(300 + ((400 - 300) / (250 - 120)) * (pm25 - 120));
  // > 250 is Severe (401 - 500+)
  const severeAqi = 400 + ((500 - 400) / (380 - 250)) * (pm25 - 250);
  return Math.min(500, Math.round(severeAqi));
}

/**
 * Resolves CPCB category from AQI numeric value
 */
export function getCpcbCategory(aqi: number): CpcbCategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

/**
 * Returns plain-language interpretation based on CPCB band and language
 */
export function getPlainLanguageMeaning(category: CpcbCategory, lang: SupportedLanguage): string {
  const meanings: Record<CpcbCategory, Record<SupportedLanguage, string>> = {
    Good: {
      en: 'Clean, fresh air. Enjoy outdoor activities with minimal risk.',
      hi: 'हवा पूरी तरह साफ है। बाहर खेलने और घूमने के लिए उत्तम समय है।',
      mr: 'हवा स्वच्छ आणि ताजी आहे. बाहेरील कामांसाठी आणि खेळासाठी सुरक्षित दिवस.',
    },
    Satisfactory: {
      en: 'Acceptable air quality. Highly sensitive individuals may notice mild irritation.',
      hi: 'हवा सामान्य है। बहुत संवेदनशील लोगों को हल्की परेशानी महसूस हो सकती है।',
      mr: 'हवेचा दर्जा समाधानकारक आहे. अतिसंवेदनशील व्यक्तींना हलका त्रास जाणवू शकतो.',
    },
    Moderate: {
      en: 'Noticeable haze. People with asthma or breathing issues should limit heavy exertion.',
      hi: 'हवा में हल्का प्रदूषण है। सांस के मरीज और बुजुर्ग भारी मेहनत वाले काम बाहर न करें।',
      mr: 'हवेत थोडा धूरकटपणा आहे. दमा असलेल्या व्यक्तींनी व वृद्धांनी बाहेर जास्त फिरणे टाळावे.',
    },
    Poor: {
      en: 'Unhealthy air. Prolonged exposure causes breathing discomfort; wear a mask outside.',
      hi: 'हवा खराब है। ज्यादा देर बाहर रहने से खांसी या जलन हो सकती है; बाहर मास्क जरूर लगाएं।',
      mr: 'हवेचा दर्जा खालावला आहे. बाहेर पडताना मास्क वापरा; लहान मुले व वृद्धांची काळजी घ्या.',
    },
    'Very Poor': {
      en: 'Dense winter smog. Serious risk of respiratory irritation; shift morning activities indoors.',
      hi: 'गंभीर धुंध और प्रदूषण। सुबह की सैर घर के अंदर करें; बच्चे और बुजुर्ग विशेष सावधानी बरतें।',
      mr: 'धुकट आणि विषारी हवा. सकाळचा व्यायाम घरातच करा; खिडक्या-दारे बंद ठेवा आणि मास्क वापरा.',
    },
    Severe: {
      en: 'Hazardous pollution emergency. Healthy people also affected; keep doors closed, avoid outdoor trips.',
      hi: 'अत्यंत गंभीर आपातकालीन स्थिति। सभी लोग घर के अंदर रहें; बाहर निकलना टालें और दरवाजे बंद रखें।',
      mr: 'धोकादायक हवेची स्थिती. निरोगी व्यक्तींनाही त्रास होऊ शकतो; शक्यतो घराबाहेर पडणे पूर्णपणे टाळा.',
    },
  };

  return meanings[category]?.[lang] || meanings[category].en;
}
