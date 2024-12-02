"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2Icon, ImageIcon } from "lucide-react";
import { toast } from "sonner";

type AspectRatio = "square" | "landscape" | "portrait";

interface ImageGeneratorProps {
  onGenerate: (image: string, aspectRatio: AspectRatio, promptData: {
    prompt: string;
    size: string;
    style: string;
    language: string;
  }) => void;
  loading: boolean;
}

interface SizeOption {
  value: string;
  label: string;
  aspectRatio: AspectRatio;
  dimensions: string;
  platform?: string;
}

export function ImageGenerator({ onGenerate, loading }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [style, setStyle] = useState("vivid");
  const [language, setLanguage] = useState("tr");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const languages = [
    { value: "tr", label: "Türkçe" },
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
  ];

  const sizes: SizeOption[] = [
    // Instagram
    { value: "1024x1024", label: "Instagram Post", aspectRatio: "square", dimensions: "1:1", platform: "Instagram" },
    { value: "1024x1792", label: "Instagram Story/Reels", aspectRatio: "portrait", dimensions: "9:16", platform: "Instagram" },
    { value: "1792x1024", label: "Instagram Carousel", aspectRatio: "landscape", dimensions: "16:9", platform: "Instagram" },
    
    // Facebook
    { value: "1792x1024", label: "Facebook Post", aspectRatio: "landscape", dimensions: "16:9", platform: "Facebook" },
    { value: "1024x1024", label: "Facebook Profile", aspectRatio: "square", dimensions: "1:1", platform: "Facebook" },
    { value: "1024x1792", label: "Facebook Story", aspectRatio: "portrait", dimensions: "9:16", platform: "Facebook" },
    
    // Twitter/X
    { value: "1792x1024", label: "Twitter Post", aspectRatio: "landscape", dimensions: "16:9", platform: "Twitter" },
    { value: "1024x1024", label: "Twitter Profile", aspectRatio: "square", dimensions: "1:1", platform: "Twitter" },
    
    // LinkedIn
    { value: "1792x1024", label: "LinkedIn Post", aspectRatio: "landscape", dimensions: "16:9", platform: "LinkedIn" },
    { value: "1024x1024", label: "LinkedIn Profile", aspectRatio: "square", dimensions: "1:1", platform: "LinkedIn" },
    
    // YouTube
    { value: "1792x1024", label: "YouTube Thumbnail", aspectRatio: "landscape", dimensions: "16:9", platform: "YouTube" },
    { value: "1024x1792", label: "YouTube Shorts", aspectRatio: "portrait", dimensions: "9:16", platform: "YouTube" },
    
    // TikTok
    { value: "1024x1792", label: "TikTok Video", aspectRatio: "portrait", dimensions: "9:16", platform: "TikTok" },
    
    // Generic
    { value: "1024x1024", label: "Square (1:1)", aspectRatio: "square", dimensions: "1:1" },
    { value: "1792x1024", label: "Landscape (16:9)", aspectRatio: "landscape", dimensions: "16:9" },
    { value: "1024x1792", label: "Portrait (9:16)", aspectRatio: "portrait", dimensions: "9:16" },
  ];

  const styles = [
    { value: "vivid", label: "Vivid - Daha canlı ve parlak" },
    { value: "natural", label: "Natural - Daha doğal ve gerçekçi" },
  ];

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Lütfen görsel açıklaması girin");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/generate-images", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt,
          size,
          style,
          language
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const selectedSize = sizes.find(s => s.value === size);
      onGenerate(data.image, selectedSize?.aspectRatio || "square", {
        prompt,
        size,
        style,
        language
      });
      setPrompt("");
      toast.success("Görsel başarıyla oluşturuldu!");
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : "Görsel oluşturulamadı");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Platform bazlı boyutları grupla
  const groupedSizes = sizes.reduce((acc, size) => {
    const group = size.platform || "Genel";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(size);
    return acc;
  }, {} as Record<string, SizeOption[]>);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="prompt">Görsel Açıklaması</Label>
        <Textarea
          id="prompt"
          placeholder="Oluşturmak istediğiniz görseli detaylı bir şekilde açıklayın..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="size">Boyut</Label>
          <Select 
            value={size} 
            onValueChange={setSize}
            disabled={isSubmitting}
          >
            <SelectTrigger id="size">
              <SelectValue placeholder="Boyut seçin" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(groupedSizes).map(([group, options]) => (
                <div key={group}>
                  <Label className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {group}
                  </Label>
                  {options.map((s) => (
                    <SelectItem key={s.label} value={s.value}>
                      {s.label} ({s.dimensions})
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="style">Stil</Label>
          <Select 
            value={style} 
            onValueChange={setStyle}
            disabled={isSubmitting}
          >
            <SelectTrigger id="style">
              <SelectValue placeholder="Stil seçin" />
            </SelectTrigger>
            <SelectContent>
              {styles.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Dil</Label>
          <Select 
            value={language} 
            onValueChange={setLanguage}
            disabled={isSubmitting}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Dil seçin" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button 
        className="w-full" 
        disabled={!prompt.trim() || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <>
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            Görsel Oluşturuluyor...
          </>
        ) : (
          <>
            <ImageIcon className="mr-2 h-4 w-4" />
            Görsel Oluştur
          </>
        )}
      </Button>
    </div>
  );
}