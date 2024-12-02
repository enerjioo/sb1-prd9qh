"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BrandSettings } from "@/components/brand-settings";
import { ErrorBoundary } from "@/components/error-boundary";
import { toast } from "sonner";
import { BrandConfig } from "@/types/brand";
import { StorageService } from "@/lib/storage";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<BrandConfig | null>(null);

  useEffect(() => {
    // Load saved settings
    const savedSettings = StorageService.loadSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleSaveSettings = async (config: BrandConfig) => {
    try {
      setLoading(true);
      StorageService.saveSettings(config);
      setSettings(config);
      toast.success("Brand settings saved successfully!");
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSettings = () => {
    try {
      StorageService.clearSettings();
      setSettings(null);
      toast.success("Settings cleared successfully!");
    } catch (error) {
      console.error('Error clearing settings:', error);
      toast.error("Failed to clear settings");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 lg:ml-72">
        <div className="h-full px-4 py-6 lg:px-8">
          <ErrorBoundary>
            <Card className="p-6">
              <BrandSettings 
                initialSettings={settings}
                onSave={handleSaveSettings}
                onClear={handleClearSettings}
                loading={loading}
              />
            </Card>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}