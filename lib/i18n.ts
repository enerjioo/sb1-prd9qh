interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translations = {
  tr: {
    // Common
    "brandName": "Social AI",
    "loading": "Yükleniyor...",
    "save": "Kaydet",
    "download": "İndir",
    "copy": "Kopyala",
    "refresh": "Yenile",
    "open": "Aç",
    "close": "Kapat",
    "minimize": "Küçült",
    "maximize": "Büyüt",
    
    // Navigation
    "socialMedia": "Sosyal Medya",
    "blogWriter": "Blog Yazarı",
    "imageGenerator": "Görsel Oluşturucu",
    "dataAnalytics": "Veri Analizi",
    "textToSpeech": "Metinden Sese",
    "settings": "Ayarlar",
    
    // Content Generation
    "contentIdea": "İçerik Fikri",
    "enterContentIdea": "İçerik fikrinizi girin...",
    "tone": "Ton",
    "professional": "Profesyonel",
    "casual": "Günlük",
    "humorous": "Esprili",
    "formal": "Resmi",
    "generating": "Oluşturuluyor...",
    "generateContent": "İçerik Oluştur",
    
    // Image Generation
    "imageDescription": "Görsel Açıklaması",
    "enterImageDescription": "Oluşturmak istediğiniz görseli açıklayın...",
    "size": "Boyut",
    "style": "Stil",
    "vivid": "Canlı",
    "natural": "Doğal",
    "generateImage": "Görsel Oluştur",
    
    // Settings
    "brandSettings": "Marka Ayarları",
    "configureSettings": "İçerik oluşturmayı kişiselleştirmek için marka ayarlarınızı yapılandırın",
    "brandName": "Marka Adı",
    "industry": "Sektör",
    "colorScheme": "Renk Şeması",
    "brandVoice": "Marka Sesi",
    "primaryLanguage": "Ana Dil",
    "targetAudience": "Hedef Kitle",
    "brandValues": "Marka Değerleri",
    "brandKeywords": "Marka Anahtar Kelimeleri",
    "competitors": "Rakipler",
    "brandDescription": "Marka Açıklaması"
  },
  en: {
    // Common
    "brandName": "Social AI",
    "loading": "Loading...",
    "save": "Save",
    "download": "Download",
    "copy": "Copy",
    "refresh": "Refresh",
    "open": "Open",
    "close": "Close",
    "minimize": "Minimize",
    "maximize": "Maximize",
    
    // Navigation
    "socialMedia": "Social Media",
    "blogWriter": "Blog Writer",
    "imageGenerator": "Image Generator",
    "dataAnalytics": "Data Analytics",
    "textToSpeech": "Text to Speech",
    "settings": "Settings",
    
    // Content Generation
    "contentIdea": "Content Idea",
    "enterContentIdea": "Enter your content idea...",
    "tone": "Tone",
    "professional": "Professional",
    "casual": "Casual",
    "humorous": "Humorous",
    "formal": "Formal",
    "generating": "Generating...",
    "generateContent": "Generate Content",
    
    // Image Generation
    "imageDescription": "Image Description",
    "enterImageDescription": "Describe the image you want to generate...",
    "size": "Size",
    "style": "Style",
    "vivid": "Vivid",
    "natural": "Natural",
    "generateImage": "Generate Image",
    
    // Settings
    "brandSettings": "Brand Settings",
    "configureSettings": "Configure your brand settings to personalize content generation",
    "brandName": "Brand Name",
    "industry": "Industry",
    "colorScheme": "Color Scheme",
    "brandVoice": "Brand Voice",
    "primaryLanguage": "Primary Language",
    "targetAudience": "Target Audience",
    "brandValues": "Brand Values",
    "brandKeywords": "Brand Keywords",
    "competitors": "Competitors",
    "brandDescription": "Brand Description"
  }
};

export function useTranslation(language: string = 'en') {
  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return { t };
}