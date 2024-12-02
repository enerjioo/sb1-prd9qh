"use client";

import { TwitterPreview } from "./platform-previews/twitter-preview";
import { InstagramPreview } from "./platform-previews/instagram-preview";
import { FacebookPreview } from "./platform-previews/facebook-preview";
import { LinkedInPreview } from "./platform-previews/linkedin-preview";
import { tr, enUS, es, fr, de, Locale } from 'date-fns/locale';

const locales: Record<string, Locale> = {
  tr,
  en: enUS,
  es,
  fr,
  de
};

interface PlatformPreviewProps {
  platform: string;
  content: string;
  image?: string;
  language?: string;
}

export function PlatformPreview({ platform, content, image, language = 'en' }: PlatformPreviewProps) {
  const locale = locales[language] || locales.en;

  switch (platform.toLowerCase()) {
    case 'twitter':
      return <TwitterPreview content={content} image={image} />;
    case 'instagram':
      return <InstagramPreview content={content} image={image} locale={locale} />;
    case 'facebook':
      return <FacebookPreview content={content} image={image} locale={locale} />;
    case 'linkedin':
      return <LinkedInPreview content={content} image={image} locale={locale} />;
    default:
      return null;
  }
}