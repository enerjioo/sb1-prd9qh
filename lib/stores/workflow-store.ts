import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (node: Node | null) => void;
  getConnectedNodes: (nodeId: string) => Node[];
  updateNodeData: (nodeId: string, data: any) => void;
  getNodeById: (nodeId: string) => Node | undefined;
  propagateData: (sourceNodeId: string, data: any) => void;
  getNodeConnections: (nodeId: string) => {
    sources: Node[];
    targets: Node[];
  };
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  onNodesChange: (changes: NodeChange[]) => {
    try {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    } catch (error) {
      console.error("Error applying node changes:", error);
    }
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    try {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    } catch (error) {
      console.error("Error applying edge changes:", error);
    }
  },
  onConnect: (connection: Connection) => {
    try {
      set({
        edges: addEdge(connection, get().edges),
      });
    } catch (error) {
      console.error("Error connecting nodes:", error);
    }
  },
  addNode: (node: Node) => {
    try {
      const nodes = get().nodes;
      const offset = nodes.length * 20;
      
      const newNode = {
        ...node,
        position: {
          x: 100 + offset,
          y: 100 + offset,
        },
      };

      set({
        nodes: [...nodes, newNode],
      });
    } catch (error) {
      console.error("Error adding node:", error);
    }
  },
  deleteNode: (nodeId: string) => {
    try {
      set((state) => ({
        nodes: state.nodes.filter((node) => node.id !== nodeId),
        edges: state.edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        ),
      }));
    } catch (error) {
      console.error("Error deleting node:", error);
    }
  },
  setSelectedNode: (node: Node | null) => {
    try {
      set({
        selectedNode: node,
      });
    } catch (error) {
      console.error("Error setting selected node:", error);
    }
  },
  getConnectedNodes: (nodeId: string) => {
    const { nodes, edges } = get();
    const connectedEdges = edges.filter(edge => edge.source === nodeId);
    return connectedEdges.map(edge => 
      nodes.find(node => node.id === edge.target)
    ).filter((node): node is Node => node !== undefined);
  },
  updateNodeData: (nodeId: string, data: any) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    }));
  },
  getNodeById: (nodeId: string) => {
    return get().nodes.find(node => node.id === nodeId);
  },
  propagateData: (sourceNodeId: string, data: any) => {
    const { nodes, edges } = get();
    const targetEdges = edges.filter(edge => edge.source === sourceNodeId);
    
    targetEdges.forEach(edge => {
      const targetNode = nodes.find(node => node.id === edge.target);
      if (targetNode) {
        // Update target node with data from source
        get().updateNodeData(targetNode.id, {
          ...targetNode.data,
          inputData: data
        });

        // If target is a social node, update it with both text and image
        if (targetNode.type === 'social' && data.text && data.image) {
          get().updateNodeData(targetNode.id, {
            ...targetNode.data,
            content: data.text,
            image: data.image
          });
        }
      }
    });
  },
  getNodeConnections: (nodeId: string) => {
    const { nodes, edges } = get();
    return {
      sources: edges
        .filter(edge => edge.target === nodeId)
        .map(edge => nodes.find(node => node.id === edge.source))
        .filter((node): node is Node => node !== undefined),
      targets: edges
        .filter(edge => edge.source === nodeId)
        .map(edge => nodes.find(node => node.id === edge.target))
        .filter((node): node is Node => node !== undefined)
    };
  }
}));