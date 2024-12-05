"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";

export const PreviewNode = memo(({ data }: NodeProps) => {
  return (
    <Card className="p-4 min-w-[200px]">
      <Handle type="target" position={Position.Left} style={{width: 15, height: 15}}/>
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4" />
        <span className="font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Right} style={{width: 15, height: 15}} />
    </Card>
  );
});

PreviewNode.displayName = "PreviewNode";