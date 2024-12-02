"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from "lucide-react";
import { StorageService } from "@/lib/storage";
import { useEffect, useState } from "react";

interface TwitterPreviewProps {
  content: string;
  image?: string;
}

export function TwitterPreview({ content, image }: TwitterPreviewProps) {
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
    <Card className="p-4 max-w-[598px]">
      <div className="flex items-start space-x-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={brandLogo || "https://api.dicebear.com/7.x/avataaars/svg?seed=social-ai"} alt="Profile" />
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{brandName}</p>
              <p className="text-sm text-muted-foreground">@{brandName.toLowerCase().replace(/\s+/g, '')}</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          <p className="mt-2 text-[15px] whitespace-pre-wrap">{content}</p>
          {image && (
            <div className="mt-3 rounded-xl overflow-hidden">
              <img src={image} alt="Post image" className="w-full" />
            </div>
          )}
          <div className="mt-3 flex items-center justify-between text-muted-foreground">
            <Button variant="ghost" size="sm" className="hover:text-blue-500">
              <MessageCircle className="h-5 w-5 mr-2" />
              <span className="text-sm">0</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-green-500">
              <Repeat2 className="h-5 w-5 mr-2" />
              <span className="text-sm">0</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-red-500">
              <Heart className="h-5 w-5 mr-2" />
              <span className="text-sm">0</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-blue-500">
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}