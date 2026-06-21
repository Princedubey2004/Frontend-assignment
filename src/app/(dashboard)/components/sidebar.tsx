"use client";

import React from "react";
import { useParams } from "next/navigation";
import { WorkspaceSelector } from "./workspace-selector";
import { BoardNavigation } from "./board-navigation";
import { UserFooter } from "./user-footer";

export function Sidebar() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;

  return (
    <aside className="flex w-64 flex-col border-r border-slate-800 bg-slate-900/50">
      {/* LOGO */}
      <div className="flex h-16 items-center px-6 border-b border-slate-800 font-bold text-lg tracking-tight text-blue-400">
        TaskBoard
      </div>

      {/* WORKSPACE SELECTION */}
      <WorkspaceSelector workspaceId={workspaceId} />

      {/* NAVIGATION LINKS */}
      <BoardNavigation />

      {/* USER FOOTER PANEL */}
      <UserFooter />
    </aside>
  );
}
