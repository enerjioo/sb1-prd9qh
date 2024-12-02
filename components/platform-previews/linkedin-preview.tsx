"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, Repeat2, Send, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow, Locale } from 'date-fns';
import { StorageService } from "@/lib/storage";
import { useEffect, useState } from "react";

interface LinkedInPreviewProps {
  content: string;
  image?: string;
  locale: Locale;
}

export function LinkedInPreview({ content, image, locale }: LinkedInPreviewProps) {
  const now = new Date();
  const [brandLogo, setBrandLogo] = useState<string | undefined>();
  const [brandName, setBrandName] = useState("Social AI");
  
  useEffect(() => {
    const settings = StorageService.loadSettings();
    if (settings?.logo) {
      setBrandLogo(settings.logo);
    }
    if (settings?.name) {
      setBrandName(settings.name);
    }
  }, []);
  
  return (
    <Card className="max-w-[552px]">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={brandLogo || "https://api.dicebear.com/7.x/avataaars/svg?seed=social-ai"} alt="Profile" />
            </Avatar>
            <div>
              <p className="font-semibold">{brandName}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(now, { addSuffix: true, locale })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
        <p className="mb-4 whitespace-pre-wrap">{content}</p>
        {image && (
          <div className="rounded-lg overflow-hidden mb-4">
            <img src={image} alt="Post image" className="w-full" />
          </div>
        )}
        <div className="flex items-center justify-between text-muted-foreground border-t pt-3">
          <Button variant="ghost" size="sm" className="hover:text-blue-600">
            <ThumbsUp className="h-5 w-5 mr-2" />
            <span>Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="hover:text-blue-600">
            <MessageCircle className="h-5 w-5 mr-2" />
            <span>Comment</span>
          </Button>
          <Button variant="ghost" size="sm" className="hover:text-blue-600">
            <Repeat2 className="h-5 w-5 mr-2" />
            <span>Repost</span>
          </Button>
          <Button variant="ghost" size="sm" className="hover:text-blue-600">
            <Send className="h-5 w-5 mr-2" />
            <span>Send</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}