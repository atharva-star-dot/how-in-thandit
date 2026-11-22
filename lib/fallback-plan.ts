import { DailyPlanResponse, HouseholdProfile, CpcbCategory, SupportedLanguage } from '@/types';

/**
 * Deterministic, clinically safe, low-cost Indian rule-based fallback plan.
 * Used when Gemini API is throttled, offline, or returns invalid schema.
 * Enforces Constitution Principles I (Safety), II (Data Honesty), III (Impact Transparency), and IV (Low-Cost).
 */
export function generateFallbackPlan(
  city: string,
  aqi: number,
  category: CpcbCategory,
  profile: HouseholdProfile,
  language: SupportedLanguage = 'en'
): DailyPlanResponse {
  const isSevereOrVeryPoor = category === 'Severe' || category === 'Very Poor';
  const hasKids = profile.members.includes('children');
  const hasRespiratory = profile.members.includes('respiratory');
  const hasElderly = profile.members.includes('elderly');
  const onTwoWheeler = profile.commuteMode === 'two_wheeler' || profile.commuteMode === 'walk';

  const todayStr = new Date().toISOString().split('T')[0];

  if (language === 'hi') {
    return {
      date: todayStr,
      city,
      aqi,
      category,
      language: 'hi',
      sections: {
        morningRoutine: [
          {
            id: 'fb-mr-1',
            title: onTwoWheeler ? 'N95 मास्क पहनें और यात्रा का समय बदलें' : 'सुबह की खिड़कियां बंद रखें',
            action: onTwoWheeler
              ? 'सुबह 8:30 बजे से पहले धुंध जमीन के पास घनी होती है। यात्रा करते समय नाक और मुंह पर अच्छी तरह से सटा हुआ N95/FFP2 मास्क पहनें।'
              : 'सुबह की ठंडी और प्रदूषित हवा को घर में आने से रोकने के लिए सुबह बालकनी व खिड़कियां बंद रखें।',
            whoBenefits: onTwoWheeler ? 'सड़क पर चलने वाले और दमा के मरीज' : 'समस्त परिवार',
            impactLevel: 'High',
            whyItHelps: 'N95 मास्क फेफड़ों में जाने वाले महीन PM2.5 कणों को काफी हद तक रोकने में मदद करता है।',
          },
        ],
        indoorHacks: [
          {
            id: 'fb-ih-1',
            title: 'गीले कपड़े से दरवाजे-खिड़कियों के कोने सील करें',
            action: 'बालकनी के दरवाजों और खिड़कियों की दरारों पर निचोड़ा हुआ गीला कपड़ा या तौलिया लपेटकर रखें। झाड़ू की जगह गीला पोछा लगाएं।',
            whoBenefits: 'घर के सभी सदस्य, विशेषकर फर्श पर खेलने वाले बच्चे',
            impactLevel: 'Medium',
            whyItHelps: 'गीला कपड़ा बाहर से आने वाली धूल और धुएं के कणों को सोख लेता है और कमरे में धूल उड़ने से रोकता है।',
          },
        ],
        kidsEldersCare: [
          {
            id: 'fb-kc-1',
            title: isSevereOrVeryPoor ? 'सुबह की सैर और खेल घर के अंदर रखें' : 'दोपहर के समय ही बाहर निकलें',
            action: isSevereOrVeryPoor
              ? 'बुजुर्गों की सुबह की सैर घर के बरामदे या कमरे में ही कराएं। बच्चों को दोपहर की धूप निकलने के बाद ही बाहर खेलने दें।'
              : 'हल्की धूप खिलने के बाद जब प्रदूषण थोड़ा ऊपर उठता है, तभी जरूरी काम से बाहर निकलें।',
            whoBenefits: hasRespiratory || hasKids || hasElderly ? 'बच्चे, बुजुर्ग और सांस के रोगी' : 'पूरा परिवार',
            impactLevel: 'High',
            whyItHelps: 'सुबह के समय तापमान कम होने से प्रदूषण जमीन के पास ठहरा रहता है। इस समय गहरी सांस लेने से फेफड़ों पर दबाव पड़ता है।',
          },
        ],
        sustainableAlternatives: [
          {
            id: 'fb-sa-1',
            title: 'अगरबत्ती, धूप और सूखा कचरा जलाने से बचें',
            action: 'कमरों के अंदर अगरबत्ती या मच्छर भगाने वाली कॉइल न जलाएं। सोसायटी में सूखी पत्तियों या कचरे को जलाने से रोकें।',
            whoBenefits: 'घर और मोहल्ले की समग्र वायु गुणवत्ता',
            impactLevel: 'High',
            whyItHelps: 'अगरबत्ती और अलाव का धुआं घर के अंदर PM2.5 के स्तर को खतरनाक रूप से बढ़ा देता है।',
          },
        ],
      },
      medicalDisclaimer:
        'महत्वपूर्ण: यह योजना सामान्य पर्यावरण बचाव के लिए है, चिकित्सीय परामर्श नहीं। सांस फूलने, तेज खांसी या सीने में दर्द की स्थिति में तुरंत योग्य डॉक्टर से संपर्क करें।',
      isFallback: true,
    };
  }

  if (language === 'mr') {
    return {
      date: todayStr,
      city,
      aqi,
      category,
      language: 'mr',
      sections: {
        morningRoutine: [
          {
            id: 'fb-mr-1',
            title: onTwoWheeler ? 'N95 मास्क वापरा आणि प्रवासाची वेळ बदला' : 'सकाळच्या वेळी खिडक्या बंद ठेवा',
            action: onTwoWheeler
              ? 'सकाळी ८:३० पूर्वी धूरकट हवा जमिनीलगत जास्त दाट असते. दुचाकीवरून जाताना नाका-तोंडावर व्यवस्थित बसणारा N95 मास्क नक्की वापरा.'
              : 'बाहेरील विषारी धूरकट हवा घरात येऊ नये म्हणून सकाळच्या वेळेस गॅलरी व खिडक्या बंद ठेवा.',
            whoBenefits: onTwoWheeler ? 'दुचाकी चालक आणि दम्याचे रुग्ण' : 'घरातील सर्व व्यक्ती',
            impactLevel: 'High',
            whyItHelps: 'योग्य मापाचा N95 मास्क हवेतील अतिसूक्ष्म PM2.5 कण श्वसनमार्गात जाण्यापासून रोखण्यास मदत करतो.',
          },
        ],
        indoorHacks: [
          {
            id: 'fb-ih-1',
            title: 'ओल्या फडक्याने दारे व खिडक्यांच्या फटी बंद करा',
            action: 'खिडक्यांच्या फटीत ओले टॉवेल किंवा सुती फडकी ठेवा. कोरडा झाडू मारण्याऐवजी घरात ओल्या फडक्याने लादी पुसा.',
            whoBenefits: 'घरातील लहान मुले व वृद्ध',
            impactLevel: 'Medium',
            whyItHelps: 'ओले कापड हवेतील धुलिकण खेचून घेते आणि घरातील हवेत धूळ उडण्यापासून रोखण्यास मदत करते.',
          },
        ],
        kidsEldersCare: [
          {
            id: 'fb-kc-1',
            title: isSevereOrVeryPoor ? 'सकाळचा व्यायाम आणि फिरणे घरातच ठेवा' : 'दुपारच्या कोवळ्या उन्हात बाहेर पडा',
            action: isSevereOrVeryPoor
              ? 'ज्येष्ठ नागरिकांची सकाळची फेरी घरातच करा. लहान मुलांना दुपारचे ऊन पडल्यानंतरच हलक्या खेळांसाठी पाठवा.'
              : 'दुपारी ऊन पडल्यावर प्रदूषणाची पातळी थोडी कमी होते, तेव्हाच आवश्यक कामांसाठी बाहेर पडा.',
            whoBenefits: hasKids || hasElderly || hasRespiratory ? 'मुले, ज्येष्ठ नागरिक आणि दम्याचे रुग्ण' : 'सर्व कुटुंब',
            impactLevel: 'High',
            whyItHelps: 'सकाळच्या थंडीत जमिनीलगत प्रदूषण साचून राहते; या वेळी धावणे किंवा वेगाने चालल्याने फुफ्फुसांवर ताण येतो.',
          },
        ],
        sustainableAlternatives: [
          {
            id: 'fb-sa-1',
            title: 'अगरबत्ती, धूप आणि कचरा जाळणे टाळा',
            action: 'घरामध्ये अगरबत्ती, कापूर किंवा डासांची कॉईल लावणे टाळा. सोसायटीच्या आवारात पालापाचोळा जाळण्यास सक्त मनाई करा.',
            whoBenefits: 'घरातील व परिसरातील सर्व नागरिक',
            impactLevel: 'High',
            whyItHelps: 'अगरबत्तीचा धूर घरात सोडल्याने घरातील सूक्ष्म धुलिकणांची पातळी दुपटीने वाढू शकते.',
          },
        ],
      },
      medicalDisclaimer:
        'महत्त्वाची सूचना: हे नियोजन केवळ प्रदूषणापासून बचावासाठी आहे, कोणताही वैद्यकीय सल्ला नाही. दम लागल्यास किंवा तब्येत खालावल्यास डॉक्टरांचा सल्ला घ्या.',
      isFallback: true,
    };
  }

  // English fallback
  return {
    date: todayStr,
    city,
    aqi,
    category,
    language: 'en',
    sections: {
      morningRoutine: [
        {
          id: 'fb-mr-1',
          title: onTwoWheeler ? 'Wear Snug N95 & Shift Peak Commute' : 'Keep Morning Windows Closed',
          action: onTwoWheeler
            ? 'Avoid unmasked two-wheeler or walking commutes before 8:30 AM when ground-level temperature inversions trap heavy particulate matter. Wear a well-fitted N95/FFP2 mask.'
            : 'Keep external balcony doors and windows firmly closed during early morning hours to block cool trapped smog drafts.',
          whoBenefits: onTwoWheeler ? 'Commuters & family members with respiratory sensitivity' : 'Entire household',
          impactLevel: 'High',
          whyItHelps: 'A certified N95 mask filters out a substantial portion of fine PM2.5 particulates before they penetrate deep into airways.',
        },
      ],
      indoorHacks: [
        {
          id: 'fb-ih-1',
          title: 'Damp Cloth Window Sealing & Wet Mopping',
          action: 'Roll damp cloth towels along bottom window/door crevices. Replace dry broom sweeping with damp mopping to avoid kicking settled dust into the air.',
          whoBenefits: 'All household members, especially toddlers on the floor',
          impactLevel: 'Medium',
          whyItHelps: 'Damp fabric physically catches coarse settling dust and noticeably reduces outdoor smog infiltration into living areas.',
        },
      ],
      kidsEldersCare: [
        {
          id: 'fb-kc-1',
          title: isSevereOrVeryPoor ? 'Move Exercise & Play Indoors' : 'Plan Outdoor Chores in Afternoon',
          action: isSevereOrVeryPoor
            ? 'Shift elders’ morning garden walks and children’s morning coaching indoors. Limit physical exertion during peak morning pollution.'
            : 'Plan essential errands between 12:00 PM and 3:30 PM when surface warming lifts the ground smog layer.',
          whoBenefits: hasKids || hasElderly || hasRespiratory ? 'Children, seniors, and asthmatic family members' : 'All family members',
          impactLevel: 'High',
          whyItHelps: 'Airway resistance increases during strenuous morning exercise in smoggy air; avoiding heavy breathing preserves respiratory comfort.',
        },
      ],
      sustainableAlternatives: [
        {
          id: 'fb-sa-1',
          title: 'Eliminate Indoor Incense & Local Biomass Burning',
          action: 'Pause burning agarbatti, dhoop, and mosquito coils inside rooms. In your residential society, ensure gardeners do not burn dry leaves or trash.',
          whoBenefits: 'Indoor and neighborhood air quality',
          impactLevel: 'High',
          whyItHelps: 'Incense and biomass combustion generate heavy indoor fine particulate spikes that can double existing indoor PM2.5 concentrations.',
        },
      ],
    },
    medicalDisclaimer:
      'Important Notice: This plan is for environmental harm-reduction and is not medical advice. For asthma attacks, severe wheezing, or distress in infants/seniors, consult a certified physician immediately.',
    isFallback: true,
  };
}
