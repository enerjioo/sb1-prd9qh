"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { BrandConfig } from "@/types/brand";
import { useTranslation } from "@/lib/i18n";
import { COLOR_SCHEMES, INDUSTRIES, LANGUAGES } from "@/lib/constants";
import { TwitterSettings } from "@/components/social-accounts/twitter-settings";

interface BrandSettingsProps {
  initialSettings: BrandConfig | null;
  onSave: (settings: BrandConfig) => void;
  onClear: () => void;
  loading: boolean;
}

export function BrandSettings({ initialSettings, onSave, onClear, loading }: BrandSettingsProps) {
  const [settings, setSettings] = useState<BrandConfig>({
    name: "",
    industry: "",
    logo: "",
    primaryColor: COLOR_SCHEMES[0].primary,
    secondaryColor: COLOR_SCHEMES[0].secondary,
    accentColor: COLOR_SCHEMES[0].accent,
    brandVoice: "",
    targetAudience: [],
    languages: [],
    values: [],
    keywords: [],
    competitors: [],
    description: "",
    textProvider: 'openai',
    imageProvider: 'openai',
    apiKeys: {
      openai: '',
      gemini: '',
      anthropic: '',
      leonardo: '',
      runway: '',
      palm: '',
    },
    socialAccounts: {
      twitter: {
        username: '',
        clientId: '',
        clientSecret: '',
      }
    },
    ...initialSettings
  });

  const { t } = useTranslation(settings.languages[0] || 'en');

  const handleChange = (field: keyof BrandConfig, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleColorSchemeSelect = (scheme: typeof COLOR_SCHEMES[0]) => {
    setSettings(prev => ({
      ...prev,
      primaryColor: scheme.primary,
      secondaryColor: scheme.secondary,
      accentColor: scheme.accent
    }));
  };

  const handleColorChange = (field: "primaryColor" | "secondaryColor" | "accentColor", e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    handleChange(field, color);
  };

  const handleArrayChange = (field: keyof BrandConfig, value: string) => {
    if (Array.isArray(settings[field])) {
      handleChange(field, value.split(',').map(item => item.trim()));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate required fields: API keys for selected providers
    const requiredFields = [];
    if (settings.textProvider === 'openai' || settings.imageProvider === 'openai') {
      if (!settings.apiKeys.openai) {
        requiredFields.push('OpenAI API Key');
      }
    }
    if (settings.textProvider === 'gemini' || settings.imageProvider === 'gemini') {
      if (!settings.apiKeys.gemini) {
        requiredFields.push('Google Gemini API Key');
      }
    }
    if (settings.textProvider === 'claude') {
      if (!settings.apiKeys.anthropic) {
        requiredFields.push('Anthropic API Key');
      }
    }
    if (settings.imageProvider === 'leonardo') {
      if (!settings.apiKeys.leonardo) {
        requiredFields.push('Leonardo API Key');
      }
    }
    if (settings.imageProvider === 'runway') {
      if (!settings.apiKeys.runway) {
        requiredFields.push('Runway API Key');
      }
    }
    if (settings.textProvider === 'palm') {
      if (!settings.apiKeys.palm) {
        requiredFields.push('PaLM API Key');
      }
    }

    if (requiredFields.length > 0) {
      toast.error(`Please provide: ${requiredFields.join(', ')}`);
      return;
    }

    try {
      onSave(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Brand Settings</h2>
        <p className="text-muted-foreground">
          Configure your brand settings to personalize content generation
        </p>
      </div>

      <Tabs defaultValue="brand" className="space-y-4">
        <TabsList>
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="brand" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={settings.logo}
                  onChange={(e) => handleChange("logo", e.target.value)}
                  placeholder="https://example.com/logo.png"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <select
                  id="industry"
                  value={settings.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={loading}
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Color Scheme</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COLOR_SCHEMES.map((scheme, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    className={`h-20 ${scheme.preview} relative overflow-hidden`}
                    onClick={() => handleColorSchemeSelect(scheme)}
                  >
                    <span className="absolute inset-0 bg-background/80 hover:bg-background/70 transition-colors flex items-center justify-center">
                      {scheme.name}
                    </span>
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleColorChange("primaryColor", e)}
                    className="w-full h-10"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => handleColorChange("secondaryColor", e)}
                    className="w-full h-10"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <Input
                    id="accentColor"
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => handleColorChange("accentColor", e)}
                    className="w-full h-10"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandVoice">Brand Voice</Label>
              <select
                id="brandVoice"
                value={settings.brandVoice}
                onChange={(e) => handleChange("brandVoice", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={loading}
              >
                <option value="">Select brand voice</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="humorous">Humorous</option>
                <option value="formal">Formal</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Primary Language</Label>
              <select
                value={settings.languages[0] || ""}
                onChange={(e) => handleChange("languages", [e.target.value])}
                className="w-full px-3 py-2 border rounded-md"
                disabled={loading}
              >
                <option value="">Select language</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={settings.targetAudience.join(", ")}
                onChange={(e) => handleArrayChange("targetAudience", e.target.value)}
                placeholder="Enter target audiences separated by commas"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="values">Brand Values</Label>
              <Input
                id="values"
                value={settings.values.join(", ")}
                onChange={(e) => handleArrayChange("values", e.target.value)}
                placeholder="Enter brand values separated by commas"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Brand Keywords</Label>
              <Input
                id="keywords"
                value={settings.keywords.join(", ")}
                onChange={(e) => handleArrayChange("keywords", e.target.value)}
                placeholder="Enter keywords separated by commas"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitors">Competitors</Label>
              <Input
                id="competitors"
                value={settings.competitors.join(", ")}
                onChange={(e) => handleArrayChange("competitors", e.target.value)}
                placeholder="Enter competitors separated by commas"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brand Description</Label>
              <Input
                id="description"
                value={settings.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter a brief description of your brand"
                disabled={loading}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="textProvider">Default Text Provider</Label>
              <select
                id="textProvider"
                value={settings.textProvider}
                onChange={(e) => handleChange("textProvider", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={loading}
              >
                <option value="openai">OpenAI GPT</option>
                <option value="gemini">Google Gemini</option>
                <option value="claude">Anthropic Claude</option>
                <option value="palm">Google PaLM</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageProvider">Default Image Provider</Label>
              <select
                id="imageProvider"
                value={settings.imageProvider}
                onChange={(e) => handleChange("imageProvider", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={loading}
              >
                <option value="openai">DALL-E</option>
                <option value="gemini">Google Gemini</option>
                <option value="leonardo">Leonardo.AI</option>
                <option value="runway">Runway</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="openaiKey">OpenAI API Key</Label>
              <Input
                id="openaiKey"
                type="password"
                value={settings.apiKeys.openai}
                onChange={(e) => handleChange("apiKeys", { ...settings.apiKeys, openai: e.target.value })}
                placeholder="sk-..."
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="geminiKey">Google Gemini API Key</Label>
              <Input
                id="geminiKey"
                type="password"
                value={settings.apiKeys.gemini}
                onChange={(e) => handleChange("apiKeys", { ...settings.apiKeys, gemini: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anthropicKey">Anthropic API Key</Label>
              <Input
                id="anthropicKey"
                type="password"
                value={settings.apiKeys.anthropic}
                onChange={(e) => handleChange("apiKeys", { ...settings.apiKeys, anthropic: e.target.value })}
                placeholder="sk-ant-..."
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leonardoKey">Leonardo.AI API Key</Label>
              <Input
                id="leonardoKey"
                type="password"
                value={settings.apiKeys.leonardo}
                onChange={(e) => handleChange("apiKeys", { ...settings.apiKeys, leonardo: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="runwayKey">Runway API Key</Label>
              <Input
                id="runwayKey"
                type="password"
                value={settings.apiKeys.runway}
                onChange={(e) => handleChange("apiKeys", { ...settings.apiKeys, runway: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="palmKey">Google PaLM API Key</Label>
              <Input
                id="palmKey"
                type="password"
                value={settings.apiKeys.palm}
                onChange={(e) => handleChange("apiKeys", { ...settings.apiKeys, palm: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <TwitterSettings
            credentials={settings.socialAccounts?.twitter}
            onChange={(twitterSettings) => handleChange("socialAccounts", {
              ...settings.socialAccounts,
              twitter: twitterSettings
            })}
            disabled={loading}
          />
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button 
          type="submit" 
          disabled={loading} 
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('loading')}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t('save')}
            </>
          )}
        </Button>

        <Button 
          type="button"
          variant="destructive"
          onClick={onClear}
          disabled={loading}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Settings
        </Button>
      </div>
    </form>
  );
}