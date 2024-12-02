import { create } from "zustand";

export interface ProcessResult {
  id: string;
  nodeId: string;
  nodeType: string;
  result: string;
  timestamp: number;
}

interface NotificationState {
  results: ProcessResult[];
  addResult: (result: Omit<ProcessResult, "id" | "timestamp">) => void;
  removeResult: (id: string) => void;
  clearResults: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  results: [],
  addResult: (result) => set((state) => ({
    results: [
      {
        ...result,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
      },
      ...state.results,
    ].slice(0, 10), // Keep only last 10 results
  })),
  removeResult: (id) => set((state) => ({
    results: state.results.filter((result) => result.id !== id),
  })),
  clearResults: () => set({ results: [] }),
}));