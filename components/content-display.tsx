"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Download, Copy, CheckCircle2, Loader2, ExternalLink, RefreshCw, Share2 } from "lucide-react";
import { toast } from "sonner";
import { PlatformPreview } from "./platform-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StorageService } from "@/lib/storage";

interface ContentDisplayProps {
  content: Record<string, string>;
  image?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  language?: string;
}

export function ContentDisplay({ content, image, onRefresh, isRefreshing, language = 'en' }: ContentDisplayProps) {
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("twitter");

  const platforms = [
    { id: "twitter", name: "Twitter" },
    { id: "instagram", name: "Instagram" },
    { id: "facebook", name: "Facebook" },
    { id: "linkedin", name: "LinkedIn" }
  ];

  const handleCopy = async (platform: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPlatform(platform);
      toast.success(`${platform} content copied to clipboard`);
      setTimeout(() => setCopiedPlatform(null), 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const handleDownload = async () => {
    if (!image) return;

    try {
      setDownloading(true);
      const link = document.createElement('a');
      link.href = `/api/download?url=${encodeURIComponent(image)}`;
      link.download = 'social-media-image.png';
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

  const handleOpenInNewTab = () => {
    if (image) {
      window.open(image, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = async (platform: string) => {
    try {
      setSharing(prev => ({ ...prev, [platform]: true }));
      const settings = StorageService.loadSettings();
      
      if (!settings?.socialAccounts?.[platform.toLowerCase()]) {
        toast.error(`Please configure ${platform} credentials in settings`);
        return;
      }

      const response = await fetch('/api/social/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content[platform],
          image,
          platform: platform.toLowerCase(),
          credentials: {
            [platform.toLowerCase()]: settings.socialAccounts[platform.toLowerCase()]
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Successfully shared to ${platform}`);
      } else {
        toast.error(data.error || `Failed to share to ${platform}`);
      }
    } catch (error: any) {
      console.error(`${platform} sharing error:`, error);
      // Show complete error message
      toast.error(error.toString());
      // Log full error details
      console.log('Full error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error
      });
    } finally {
      setSharing(prev => ({ ...prev, [platform]: false }));
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated Content</CardTitle>
            {onRefresh && (
              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              {platforms.map(platform => (
                <TabsTrigger key={platform.id} value={platform.id}>
                  {platform.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {platforms.map(platform => (
              <TabsContent key={platform.id} value={platform.id} className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handleShare(platform.id)}
                    disabled={sharing[platform.id] || !content[platform.id]}
                  >
                    {sharing[platform.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handleCopy(platform.id, content[platform.id])}
                  >
                    {copiedPlatform === platform.id ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <PlatformPreview
                  platform={platform.id}
                  content={content[platform.id] || ""}
                  image={image}
                  language={language}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated Image</CardTitle>
            <div className="flex gap-2">
              {onRefresh && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              )}
              {image && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenInNewTab}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
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
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            {image ? (
              <img
                src={image}
                alt="Generated image"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}