"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ImageGenerator } from "@/components/image-generator";
import { ImageGallery } from "@/components/image-gallery";
import { ErrorBoundary } from "@/components/error-boundary";
import { toast } from "sonner";

type AspectRatio = "square" | "landscape" | "portrait";

export default function ImagesPage() {
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>();
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("square");
  const [lastPrompt, setLastPrompt] = useState<{
    prompt: string;
    size: string;
    style: string;
    language: string;
  } | null>(null);

  const handleGenerate = async (image: string, newAspectRatio: AspectRatio, promptData: {
    prompt: string;
    size: string;
    style: string;
    language: string;
  }) => {
    try {
      setLoading(true);
      setGeneratedImage(image);
      setAspectRatio(newAspectRatio);
      setLastPrompt(promptData);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error("Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!lastPrompt) {
      toast.error("No previous image to refresh");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/generate-images", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lastPrompt),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh image');
      }

      const data = await response.json();
      setGeneratedImage(data.image);
      toast.success("Image refreshed successfully!");
    } catch (error) {
      console.error('Error refreshing image:', error);
      toast.error("Failed to refresh image");
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
                <ImageGenerator 
                  onGenerate={handleGenerate}
                  loading={loading}
                />
              </Card>

              <ImageGallery 
                image={generatedImage} 
                aspectRatio={aspectRatio}
                onRefresh={lastPrompt ? handleRefresh : undefined}
                isRefreshing={loading}
              />
            </div>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}