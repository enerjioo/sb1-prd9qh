"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow, Locale } from 'date-fns';
import { StorageService } from "@/lib/storage";
import { useEffect, useState } from "react";

interface InstagramPreviewProps {
  content: string;
  image?: string;
  locale: Locale;
}

export function InstagramPreview({ content, image, locale }: InstagramPreviewProps) {
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
    <Card className="max-w-[470px]">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={brandLogo || "https://api.dicebear.com/7.x/avataaars/svg?seed=social-ai"} alt="Profile" />
            </Avatar>
            <span className="font-semibold">{brandName.toLowerCase().replace(/\s+/g, '')}</span>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
      {image && (
        <div className="aspect-square">
          <img src={image} alt="Post image" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:text-red-500">
              <Heart className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-blue-500">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-blue-500">
              <Send className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <p className="mb-2 whitespace-pre-wrap">
          <span className="font-semibold mr-2">{brandName.toLowerCase().replace(/\s+/g, '')}</span>
          {content}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDistanceToNow(now, { addSuffix: true, locale })}
        </p>
      </div>
    </Card>
  );
}