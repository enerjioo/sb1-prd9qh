export interface BrandConfig {
  name: string;
  logo?: string;
  industry: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  brandVoice: string;
  targetAudience: string[];
  languages: string[];
  values: string[];
  keywords: string[];
  competitors: string[];
  description: string;
  textProvider: 'openai' | 'gemini' | 'claude' | 'palm';
  imageProvider: 'openai' | 'gemini' | 'leonardo' | 'runway';
  apiKeys: {
    openai?: string;
    gemini?: string;
    anthropic?: string;
    leonardo?: string;
    runway?: string;
    palm?: string;
  };
  socialAccounts?: {
    twitter?: {
      username: string;
      apiKey: string;
      apiSecret: string;
      accessToken: string;
      accessTokenSecret: string;
    };
    facebook?: {
      pageId: string;
      accessToken: string;
    };
    instagram?: {
      username: string;
      accessToken: string;
    };
    linkedin?: {
      profileId: string;
      accessToken: string;
    };
  };
}