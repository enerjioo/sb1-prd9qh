"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Twitter, 
  Instagram, 
  Facebook, 
  Linkedin, 
  MessageSquare,
  Mic,
  Image as ImageIcon,
  Video,
  Music,
  FileAudio,
  BrainCircuit,
  Eraser,
  Scissors,
  ImageIcon as ImageResizeIcon
} from "lucide-react";
import { useWorkflowStore } from "@/lib/stores/workflow-store";
import { cn } from "@/lib/utils";
import { WorkflowNotifications } from "./workflow-notifications";

// Tüm node'lar için sabit değerler
const NODE_CONFIG = {
  HANDLE_SIZE: 8, // Bağlantı noktası boyutu
  NODE_PADDING: 16, // Node içi padding
  ICON_SIZE: 16, // İkon boyutu
} as const;

// Node stili
const nodeStyle = {
  width: `${NODE_CONFIG.ICON_SIZE + (NODE_CONFIG.NODE_PADDING * 2)}px`,
  height: `${NODE_CONFIG.ICON_SIZE + (NODE_CONFIG.NODE_PADDING * 2)}px`,
  position: "relative" as const,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
} as const;

// İkon container stili
const iconContainerStyle = {
  width: `${NODE_CONFIG.ICON_SIZE}px`,
  height: `${NODE_CONFIG.ICON_SIZE}px`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative" as const,
} as const;

// Bağlantı noktası temel stili
const handleBaseStyle = {
  position: "absolute" as const,
  width: `${NODE_CONFIG.HANDLE_SIZE}px`,
  height: `${NODE_CONFIG.HANDLE_SIZE}px`,
  backgroundColor: "#fff",
  border: "2px solid #94a3b8",
  borderRadius: "50%",
  zIndex: 5,
} as const;

// Bağlantı noktası pozisyonları
const getHandleStyles = () => ({
  top: {
    ...handleBaseStyle,
    top: -NODE_CONFIG.HANDLE_SIZE / 2,
    left: "50%",
    transform: "translateX(-50%)",
  },
  right: {
    ...handleBaseStyle,
    top: "50%",
    right: -NODE_CONFIG.HANDLE_SIZE / 2,
    transform: "translateY(-50%)",
  },
  bottom: {
    ...handleBaseStyle,
    bottom: -NODE_CONFIG.HANDLE_SIZE / 2,
    left: "50%",
    transform: "translateX(-50%)",
  },
  left: {
    ...handleBaseStyle,
    top: "50%",
    left: -NODE_CONFIG.HANDLE_SIZE / 2,
    transform: "translateY(-50%)",
  },
});

interface WorkflowControlsProps {
  className?: string;
}

export function WorkflowControls({ className }: WorkflowControlsProps) {
  const addNode = useWorkflowStore((state) => state.addNode);

  const handleAddNode = (type: string, aiType?: string, platform?: string) => {
    const node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 100, y: 100 },
      data: { 
        label: platform || aiType || type.charAt(0).toUpperCase() + type.slice(1),
        platform,
        aiType,
        styles: {
          node: nodeStyle,
          icon: iconContainerStyle,
          handles: getHandleStyles(),
        },
        config: NODE_CONFIG,
      },
    };
    addNode(node);
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Node
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Social Media</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleAddNode("social", undefined, "twitter")}>
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("social", undefined, "instagram")}>
              <Instagram className="h-4 w-4 mr-2" />
              Instagram
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("social", undefined, "facebook")}>
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("social", undefined, "linkedin")}>
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>AI Tools</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleAddNode("ai", "text-to-text")}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Text to Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("ai", "text-to-speech")}>
              <Mic className="h-4 w-4 mr-2" />
              Text to Speech
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("ai", "text-to-image")}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Text to Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("ai", "text-to-video")}>
              <Video className="h-4 w-4 mr-2" />
              Text to Video
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("ai", "image-to-video")}>
              <BrainCircuit className="h-4 w-4 mr-2" />
              Image to Video
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("ai", "speech-to-text")}>
              <FileAudio className="h-4 w-4 mr-2" />
              Speech to Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("ai", "text-to-music")}>
              <Music className="h-4 w-4 mr-2" />
              Text to Music
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>Media Processing</DropdownMenuLabel> 
            <DropdownMenuItem onClick={() => handleAddNode("ai", "audio-cleaner")}>
              <Eraser className="h-4 w-4 mr-2" />
              Audio Cleaner 
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("ai", "background-remover")}>
              <Scissors className="h-4 w-4 mr-2" />
              Background Remover
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("ai", "image-resizer")}>
              <ImageResizeIcon className="h-4 w-4 mr-2" />
              Image Resizer
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <WorkflowNotifications />
    </div>
  );
}