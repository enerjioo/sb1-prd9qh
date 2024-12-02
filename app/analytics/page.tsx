"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DataUploader } from "@/components/data-uploader";
import { DataVisualizer } from "@/components/data-visualizer";
import { ErrorBoundary } from "@/components/error-boundary";
import { toast } from "sonner";

export interface DataSet {
  headers: string[];
  data: any[][];
  insights: string[];
}

export default function AnalyticsPage() {
  const [dataset, setDataset] = useState<DataSet | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDataUpload = async (data: DataSet) => {
    try {
      setLoading(true);
      setDataset(data);
      toast.success("Data processed successfully!");
    } catch (error) {
      console.error('Error processing data:', error);
      toast.error("Failed to process data");
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
                <DataUploader 
                  onUpload={handleDataUpload}
                  loading={loading}
                />
              </Card>

              {dataset && (
                <DataVisualizer 
                  dataset={dataset}
                />
              )}
            </div>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}