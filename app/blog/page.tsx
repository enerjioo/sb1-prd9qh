"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BlogGenerator } from "@/components/blog-generator";
import { BlogDisplay } from "@/components/blog-display";
import { ErrorBoundary } from "@/components/error-boundary";

export default function BlogPage() {
  const [loading, setLoading] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string>("");

  const handleGenerate = async (data: { content: string; image: string }) => {
    try {
      setLoading(true);
      setGeneratedBlog(data.content);
      setGeneratedImage(data.image);
    } catch (error) {
      console.error('Error processing blog:', error);
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
                <BlogGenerator 
                  onGenerate={handleGenerate}
                  loading={loading}
                />
              </Card>

              <BlogDisplay 
                content={generatedBlog}
                image={generatedImage}
              />
            </div>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}