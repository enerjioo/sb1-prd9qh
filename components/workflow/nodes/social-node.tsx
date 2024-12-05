"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card } from "@/components/ui/card";
import { Twitter, Instagram, Facebook, Linkedin, X } from "lucide-react";
import { PlatformPreview } from "@/components/platform-preview";
import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "@/lib/stores/workflow-store";
import { useState } from "react";

const platformIcons = {
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
};

export const SocialNode = memo(({ data, id }: NodeProps) => {
  const Icon = data.platform ? platformIcons[data.platform as keyof typeof platformIcons] : Twitter;
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const previewContent = "This is a preview of how your content will look on " + 
    (data.platform?.charAt(0).toUpperCase() + data.platform?.slice(1) || "social media");
  const previewImage = "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=800&auto=format&fit=crop";
  const [showPreview, setShowPreview] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };

  const handlePreviewClose = () => {
    setShowPreview(false);
  };

  return (
    <div className="group relative" onMouseEnter={() => setShowPreview(true)} onMouseLeave={() => setShowPreview(false)}>
      <Card className="p-4 min-w-[200px]">
        <Handle type="target" position={Position.Left} 
          className="w-8 h-8 bg-blue-500/10 border-blue-500/20 rounded-full"
          style={{width: 15, height: 15}} /> 
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span className="font-medium">{data.label}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Handle type="source" position={Position.Right} 
          className="w-8 h-8 bg-blue-500/10 border-blue-500/20 rounded-full"
          style={{width: 15, height: 15}} />
      </Card>
      
      {/* Preview on hover */}
      {showPreview && (
      <div className="absolute left-full top-0 ml-2 z-50">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handlePreviewClose}>
          <X className="h-4 w-4" />
        </Button>

        <div className="bg-background border rounded-lg shadow-lg p-4 w-[350px]">
          <PlatformPreview
            platform={data.platform || "twitter"}
            content={previewContent}
            image={previewImage}
            language="en"
          />
        </div>
      </div>
      )}
    </div>
  );
});

SocialNode.displayName = "SocialNode";