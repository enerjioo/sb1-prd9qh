"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, X, Download } from "lucide-react";
import { useNotificationStore, ProcessResult } from "@/lib/stores/notification-store";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export function WorkflowNotifications() {
  const [open, setOpen] = useState(false);
  const { results, removeResult, clearResults } = useNotificationStore();
  const [newResults, setNewResults] = useState<string[]>([]);

  useEffect(() => {
    // Check for new results and show toast
    const lastResult = results[0];
    if (lastResult && !newResults.includes(lastResult.id)) {
      toast.success("New process result available", {
        action: {
          label: "View",
          onClick: () => setOpen(true),
        },
      });
      setNewResults((prev) => [...prev, lastResult.id]);
    }
  }, [results]);

  const handleRemove = (id: string) => {
    removeResult(id);
    setNewResults((prev) => prev.filter((resultId) => resultId !== id));
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const link = document.createElement('a');
      link.href = `/api/download?url=${encodeURIComponent(imageUrl)}`;
      link.download = 'generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image download started");
    } catch (err: any) {
      console.error('Download error:', err);
      toast.error(err.message || "Failed to download image");
    }
  };

  const renderResult = (result: ProcessResult) => {
    if (result.nodeType === "Text to Text") {
      const [prompt, response] = result.result.split('\n\nResponse: ');
      return (
        <div className="space-y-2">
          <div className="space-y-1">
            <p className="text-sm font-medium">Prompt:</p>
            <p className="text-sm bg-muted p-2 rounded">{prompt.replace('Prompt: ', '')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Response:</p>
            <p className="text-sm bg-primary/10 p-2 rounded">{response}</p>
          </div>
        </div>
      );
    }

    if (result.nodeType === "Text to Image") {
      const [prompt, imageUrl] = result.result.split('\n\nImage URL: ');
      return (
        <div className="space-y-2">
          <p className="text-sm">{prompt.replace('Prompt: ', '')}</p>
          {imageUrl && (
            <div className="space-y-2">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt="Generated image"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleDownload(imageUrl)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Image
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <p className="text-sm whitespace-pre-wrap">{result.result}</p>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
        >
          <Bell className="h-4 w-4" />
          {results.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {results.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Process Results</SheetTitle>
            {results.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearResults();
                  setNewResults([]);
                }}
              >
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          {results.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No results yet
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="relative bg-muted/50 rounded-lg p-4 pr-10"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => handleRemove(result.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{result.nodeType}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(result.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    {renderResult(result)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}