"use client";

import React from "react";
import { useWorkspaces } from "@/features/workspaces/api/use-workspaces";
import { useRouter } from "next/navigation";

interface WorkspaceSelectorProps {
  workspaceId: string;
}

export function WorkspaceSelector({ workspaceId }: WorkspaceSelectorProps) {
  const router = useRouter();
  const { data: workspaces, isLoading } = useWorkspaces();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextWorkspaceId = e.target.value;
    if (nextWorkspaceId) {
      router.push(`/w/${nextWorkspaceId}`);
    }
  };

  if (isLoading) {
    return <div className="h-9 animate-pulse rounded bg-slate-800" />;
  }

  return (
    <div className="p-4 border-b border-slate-800">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        Active Workspace
      </label>
      <select
        value={workspaceId || ""}
        onChange={handleChange}
        className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-200 outline-none focus:border-blue-500"
      >
        <option value="" disabled>
          Select Workspace...
        </option>
        {workspaces?.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
    </div>
  );
}
