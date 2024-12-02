"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2Icon, SendIcon } from "lucide-react";
import { toast } from "sonner";
import { StorageService } from "@/lib/storage";

interface GeneratedContent {
  content: string;
  image: string;
}

interface BlogGeneratorProps {
  onGenerate: (content: GeneratedContent) => void;
  loading: boolean;
}

export function BlogGenerator({ onGenerate, loading }: BlogGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("en");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const settings = StorageService.loadSettings();
    setHasApiKey(!!settings?.apiKeys?.openai);
    if (settings?.languages?.[0]) {
      setLanguage(settings.languages[0]);
    }
  }, []);

  const languages = [
    { value: "tr", label: "Türkçe" },
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
  ];

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      toast.error("Please enter a blog topic");
      return;
    }

    if (!hasApiKey) {
      toast.error("Please configure OpenAI API key in settings");
      return;
    }

    setIsSubmitting(true);

    try {
      const settings = StorageService.loadSettings();
      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          topic,
          keywords,
          tone,
          language,
          apiKey: settings?.apiKeys?.openai
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.content || !data.image) {
        throw new Error("Invalid response format from API");
      }

      onGenerate(data);
      setTopic("");
      setKeywords("");
      toast.success("Blog generated successfully!");
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to generate blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Please configure your OpenAI API key in settings to use the blog generator.
        </p>
        <Button variant="outline" onClick={() => window.location.href = '/settings'}>
          Go to Settings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic">Blog Topic</Label>
        <Textarea
          id="topic"
          placeholder="Enter your blog topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords (optional)</Label>
        <Input
          id="keywords"
          placeholder="Enter keywords separated by commas..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <SelectItem value="educational">Educational</SelectItem>
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
        disabled={!topic.trim() || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <>
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            Generating Blog...
          </>
        ) : (
          <>
            <SendIcon className="mr-2 h-4 w-4" />
            Generate Blog
          </>
        )}
      </Button>
    </div>
  );
}