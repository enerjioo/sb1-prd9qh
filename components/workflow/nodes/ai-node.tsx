"use client";

import React, { memo, useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card } from "@/components/ui/card";
import { 
  MessageSquare,
  Mic,
  Image as ImageIcon,
  Video,
  Music,
  FileAudio,
  BrainCircuit,
  X,
  Eraser,
  Scissors,
} from "lucide-react";
import { AINodeForm } from "../forms/ai-node-form";
import { useWorkflowStore } from "@/lib/stores/workflow-store";
import { Button } from "@/components/ui/button";

const aiTypeIcons = {
  "text-to-text": MessageSquare,
  "text-to-speech": Mic,
  "text-to-image": ImageIcon,
  "text-to-video": Video,
  "image-to-video": BrainCircuit,
  "speech-to-text": FileAudio,
  "text-to-music": Music,
  "audio-cleaner": Eraser,
  "background-remover": Scissors,
};

export const AINode = memo(({ data, id }: NodeProps) => {
  const [showForm, setShowForm] = useState(false);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const Icon = data.aiType ? aiTypeIcons[data.aiType as keyof typeof aiTypeIcons] : MessageSquare;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };

  return (
    <div className="group relative">
      <Card 
        className={`p-4 min-w-[200px] ${showForm ? 'bg-primary/5' : ''}`}
        onClick={() => setShowForm(true)}
      >
        <Handle type="target" position={Position.Left} style={{width: 14, height: 15}} />
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
        <Handle type="source" position={Position.Right} style={{width: 15, height: 15}} />
      </Card>

      {showForm && (
        <div className="absolute left-0 top-full mt-2 w-[400px] bg-background border rounded-lg shadow-lg p-4 z-50">
          <AINodeForm
            type={data.aiType}
            nodeId={id}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
});

AINode.displayName = "AINode";