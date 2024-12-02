"use client";

import { WorkflowBuilder } from "@/components/workflow/workflow-builder";
import { WorkflowControls } from "@/components/workflow/workflow-controls";
import { useWorkflowStore } from "@/lib/stores/workflow-store";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "sonner";

export default function WorkflowPage() {
  const selectedNode = useWorkflowStore((state) => state.selectedNode);

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 lg:ml-72">
        <ErrorBoundary>
          <div className="h-[calc(100vh-4rem)]">
            <div className="relative h-full">
              <WorkflowControls className="absolute top-4 left-4 z-10" />
              <WorkflowBuilder />
            </div>
          </div>
          <Toaster />
        </ErrorBoundary>
      </main>
    </div>
  );
}