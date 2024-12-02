"use client";

import { MainNav } from "@/components/main-nav";
import { ReactFlowProvider } from "reactflow";

export default function WorkflowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactFlowProvider>
      <MainNav />
      {children}
    </ReactFlowProvider>
  );
}