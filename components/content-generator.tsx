"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2Icon, SendIcon } from "lucide-react";
import { toast } from "sonner";
import { StorageService } from "@/lib/storage";

interface PlatformConfig {
  platform: string;
  limit: number;
  label: string;
  enabled: boolean;
}

const DEFAULT_PLATFORMS: PlatformConfig[] = [
  { platform: "twitter", limit: 280, label: "Twitter", enabled: true },
  { platform: "instagram", limit: 2200, label: "Instagram", enabled: true },
  { platform: "facebook", limit: 63206, label: "Facebook", enabled: true },
  { platform: "linkedin", limit: 3000, label: "LinkedIn", enabled: true }
];

interface ContentGeneratorProps {
  onGenerate: (content: { content: string; image: string }) => void;
  loading: boolean;
}

export function ContentGenerator({ onGenerate, loading }: ContentGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [platforms, setPlatforms] = useState<PlatformConfig[]>(DEFAULT_PLATFORMS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandConfig, setBrandConfig] = useState<any>(null);
  const [language, setLanguage] = useState("en");
  const [generateImage, setGenerateImage] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(false);
  const [includeHashtags, setIncludeHashtags] = useState(false);
  const [hashtagCount, setHashtagCount] = useState(3);

  useEffect(() => {
    const savedSettings = StorageService.loadSettings();
    if (savedSettings) {
      setBrandConfig(savedSettings);
      setLanguage(savedSettings.languages[0] || 'en');
    }
  }, []);

  const handleLimitChange = (platform: string, newLimit: string) => {
    const numericLimit = parseInt(newLimit, 10);
    if (!isNaN(numericLimit) && numericLimit > 0) {
      setPlatforms(prevPlatforms =>
        prevPlatforms.map(p =>
          p.platform === platform ? { ...p, limit: numericLimit } : p
        )
      );
    }
  };

  const handleTogglePlatform = (platform: string) => {
    setPlatforms(prevPlatforms =>
      prevPlatforms.map(p =>
        p.platform === platform ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a content idea");
      return;
    }

    const enabledPlatforms = platforms.filter(p => p.enabled);
    if (enabledPlatforms.length === 0) {
      toast.error("Please enable at least one platform");
      return;
    }

    setIsSubmitting(true);

    try {
      const settings = StorageService.loadSettings();
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt,
          platforms: enabledPlatforms.map(p => p.platform),
          characterLimits: Object.fromEntries(enabledPlatforms.map(p => [p.platform, p.limit])),
          tone,
          language,
          brandConfig,
          generateImage,
          includeEmojis,
          includeHashtags,
          hashtagCount: includeHashtags ? hashtagCount : 0
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.content) {
        throw new Error("Invalid response format from API");
      }

      onGenerate({
        content: data.content,
        image: data.image || ''
      });
      
      setPrompt("");
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to generate content");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="prompt">Content Idea</Label>
        <Textarea
          id="prompt"
          placeholder="Enter your content idea..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid gap-4">
        <Label>Platforms & Character Limits</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((platform) => (
            <div key={platform.platform} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label htmlFor={platform.platform} className="text-sm font-medium">
                  {platform.label}
                </Label>
                <Switch
                  id={`${platform.platform}-toggle`}
                  checked={platform.enabled}
                  onCheckedChange={() => handleTogglePlatform(platform.platform)}
                  disabled={isSubmitting}
                />
              </div>
              <Input
                id={platform.platform}
                type="number"
                min="1"
                value={platform.limit}
                onChange={(e) => handleLimitChange(platform.platform, e.target.value)}
                disabled={!platform.enabled || isSubmitting}
                className="mt-2"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select 
            value={tone} 
            onValueChange={setTone}
            disabled={isSubmitting}
          >
            <SelectTrigger id="tone">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="humorous">Humorous</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select 
            value={language} 
            onValueChange={setLanguage}
            disabled={isSubmitting}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tr">Türkçe</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="generateImage">Generate Image</Label>
          <div className="flex items-center space-x-2 h-10">
            <Switch
              id="generateImage"
              checked={generateImage}
              onCheckedChange={setGenerateImage}
              disabled={isSubmitting}
            />
            <Label htmlFor="generateImage" className="text-sm text-muted-foreground">
              {generateImage ? "Enabled" : "Disabled"}
            </Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="includeEmojis">Include Emojis</Label>
            <Switch
              id="includeEmojis"
              checked={includeEmojis}
              onCheckedChange={setIncludeEmojis}
              disabled={isSubmitting}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Add relevant emojis to the generated content
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="includeHashtags">Include Hashtags</Label>
            <Switch
              id="includeHashtags"
              checked={includeHashtags}
              onCheckedChange={setIncludeHashtags}
              disabled={isSubmitting}
            />
          </div>
          {includeHashtags && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max="10"
                value={hashtagCount}
                onChange={(e) => setHashtagCount(parseInt(e.target.value, 10))}
                disabled={isSubmitting}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">hashtags per post</span>
            </div>
          )}
        </div>
      </div>

      <Button 
        className="w-full" 
        disabled={!prompt.trim() || isSubmitting || platforms.every(p => !p.enabled)}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <>
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            Generating Content...
          </>
        ) : (
          <>
            <SendIcon className="mr-2 h-4 w-4" />
            Generate Content
          </>
        )}
      </Button>
    </div>
  );
}