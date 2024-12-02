"use client";

import { Node } from "reactflow";
import { Card } from "@/components/ui/card";
import { PlatformPreview } from "@/components/platform-preview";
import { useEffect, useState } from "react";
import { StorageService } from "@/lib/storage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NodePreviewProps {
  node: Node | null;
}

export function NodePreview({ node }: NodePreviewProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string>();
  const [language, setLanguage] = useState("en");
  const [includeEmojis, setIncludeEmojis] = useState(false);
  const [includeHashtags, setIncludeHashtags] = useState(false);
  const [hashtagCount, setHashtagCount] = useState(3);
  const [aiModel, setAiModel] = useState("gpt-4");

  useEffect(() => {
    const settings = StorageService.loadSettings();
    if (settings?.languages?.[0]) {
      setLanguage(settings.languages[0]);
    }
  }, []);

  if (!node) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a node to preview
      </div>
    );
  }

  if (node.type === "social") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">Social Media Node Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Enter image URL..."
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="includeEmojis">Include Emojis</Label>
            <Switch
              id="includeEmojis"
              checked={includeEmojis}
              onCheckedChange={setIncludeEmojis}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="includeHashtags">Include Hashtags</Label>
              <Switch
                id="includeHashtags"
                checked={includeHashtags}
                onCheckedChange={setIncludeHashtags}
              />
            </div>
            {includeHashtags && (
              <Input
                type="number"
                min="1"
                max="10"
                value={hashtagCount}
                onChange={(e) => setHashtagCount(parseInt(e.target.value, 10))}
                className="w-20"
              />
            )}
          </div>
        </div>

        <Card className="p-4">
          <PlatformPreview
            platform={node.data.platform || "twitter"}
            content={content || "Preview content will appear here"}
            image={image}
            language={language}
          />
        </Card>
      </div>
    );
  }

  if (node.type === "ai") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">AI Node Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>AI Model</Label>
            <Select value={aiModel} onValueChange={setAiModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                <SelectItem value="claude-3">Claude 3</SelectItem>
                <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                <SelectItem value="stable-video">Stable Video</SelectItem>
                <SelectItem value="whisper">Whisper</SelectItem>
                <SelectItem value="musicgen">MusicGen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Input</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Enter ${node.data.aiType} prompt...`}
              className="min-h-[100px]"
            />
          </div>

          {node.data.aiType === "image-to-video" && (
            <div className="space-y-2">
              <Label>Input Image URL</Label>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter image URL..."
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Node Settings</h3>
      <p className="text-muted-foreground">
        Configure settings for {node.data.label}
      </p>
    </div>
  );
}