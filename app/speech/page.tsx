"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TextToSpeech } from "@/components/text-to-speech";
import { ErrorBoundary } from "@/components/error-boundary";

export default function SpeechPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 lg:ml-72">
        <div className="h-full px-4 py-6 lg:px-8">
          <ErrorBoundary>
            <div className="grid gap-4">
              <Card className="p-6">
                <TextToSpeech 
                  loading={loading}
                  setLoading={setLoading}
                />
              </Card>
            </div>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}