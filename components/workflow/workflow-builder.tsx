"use client";

import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  Connection,
  ReactFlowProvider
} from "reactflow";
import { useWorkflowStore } from "@/lib/stores/workflow-store";
import { SocialNode } from "./nodes/social-node";
import { AINode } from "./nodes/ai-node";
import { toast } from "sonner";
import "reactflow/dist/style.css";

const nodeTypes = {
  social: SocialNode,
  ai: AINode,
};

export function WorkflowBuilder() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
  } = useWorkflowStore();

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      try {
        setSelectedNode(node);
      } catch (error) {
        console.error("Error selecting node:", error);
        toast.error("Failed to select node");
      }
    },
    [setSelectedNode]
  );

  const handleError = useCallback((error: Error) => {
    console.error("ReactFlow error:", error);
    toast.error("An error occurred in the workflow builder");
  }, []);

  return (
    <ReactFlowProvider>
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          onError={handleError}
          fitView
          className="bg-background"
          snapToGrid
          snapGrid={[20, 20]}
          minZoom={0.5}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}