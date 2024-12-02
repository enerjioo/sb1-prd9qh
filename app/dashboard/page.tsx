"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ContentGenerator } from "@/components/content-generator";
import { ContentDisplay } from "@/components/content-display";
import { ErrorBoundary } from "@/components/error-boundary";
import { toast } from "sonner";
import { formatPlatformContent } from "@/lib/utils";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [generatedImage, setGeneratedImage] = useState<string>();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [lastPrompt, setLastPrompt] = useState<{
    prompt: string;
    tone: string;
    language: string;
  } | null>(null);

  const handleGenerate = async (data: { content: string; image: string }) => {
    try {
      setLoading(true);
      const contentByPlatform = formatPlatformContent(data.content);
      
      setGeneratedContent(contentByPlatform);
      setGeneratedImage(data.image);
      
      if (lastPrompt) {
        setLastPrompt({
          ...lastPrompt,
          language: selectedLanguage
        });
      }

      toast.success("Content generated successfully!");
    } catch (error) {
      console.error('Error processing content:', error);
      toast.error("Failed to process content");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!lastPrompt) {
      toast.error("No previous content to refresh");
      return;
    }

    try {
      setLoading(true);
      const settings = StorageService.loadSettings();
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: lastPrompt.prompt,
          tone: lastPrompt.tone,
          language: lastPrompt.language,
          brandConfig: settings
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to refresh content');
      }

      const data = await response.json();
      const contentByPlatform = formatPlatformContent(data.content);
      
      setGeneratedContent(contentByPlatform);
      setGeneratedImage(data.image);
      toast.success("Content refreshed successfully!");
    } catch (error) {
      console.error('Error refreshing content:', error);
      toast.error(error instanceof Error ? error.message : "Failed to refresh content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 lg:ml-72">
        <div className="h-full px-4 py-6 lg:px-8">
          <ErrorBoundary>
            <div className="grid gap-4">
              <Card className="p-6">
                <ContentGenerator 
                  onGenerate={handleGenerate}
                  loading={loading}
                />
              </Card>

              {Object.keys(generatedContent).length > 0 && (
                <ContentDisplay 
                  content={generatedContent}
                  image={generatedImage}
                  onRefresh={lastPrompt ? handleRefresh : undefined}
                  isRefreshing={loading}
                  language={selectedLanguage}
                />
              )}
            </div>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}