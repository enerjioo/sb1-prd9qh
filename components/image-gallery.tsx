"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type AspectRatio = "square" | "landscape" | "portrait";

interface ImageGalleryProps {
  image?: string;
  aspectRatio?: AspectRatio;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function ImageGallery({ image, aspectRatio = "square", onRefresh, isRefreshing }: ImageGalleryProps) {
  const [downloading, setDownloading] = useState(false);

  const aspectRatioClasses = {
    square: "aspect-square",
    landscape: "aspect-[16/9]",
    portrait: "aspect-[9/16]"
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      setDownloading(true);
      const link = document.createElement('a');
      link.href = `/api/download?url=${encodeURIComponent(imageUrl)}`;
      link.download = "generated-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image download started");
    } catch (err: any) {
      console.error('Download error:', err);
      toast.error(err.message || "Failed to download image");
    } finally {
      setDownloading(false);
    }
  };

  const handleOpenInNewTab = (imageUrl: string) => {
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  if (!image) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className={`relative ${aspectRatioClasses[aspectRatio]} rounded-lg overflow-hidden mb-4`}>
          <img
            src={image}
            alt="Generated image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-2 justify-end">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenInNewTab(image)}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(image)}
            className="flex items-center gap-2"
            disabled={downloading}
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}