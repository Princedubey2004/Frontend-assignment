"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBoards } from "@/features/boards/api/use-boards";

export function BoardNavigation() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  const boardId = params?.boardId as string;

  const { data: boards, isLoading } = useBoards(workspaceId);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          <span>Boards</span>
          {workspaceId && (
            <Link
              href={`/w/${workspaceId}?createBoard=true`}
              className="text-blue-400 hover:text-blue-300 normal-case font-medium"
            >
              + Add
            </Link>
          )}
        </div>

        {!workspaceId ? (
          <p className="text-xs text-slate-500 italic">Select a workspace to view boards</p>
        ) : isLoading ? (
          <div className="space-y-2">
            <div className="h-7 animate-pulse rounded bg-slate-800" />
            <div className="h-7 animate-pulse rounded bg-slate-800" />
          </div>
        ) : boards?.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No boards created yet</p>
        ) : (
          <ul className="space-y-1">
            {boards?.map((b) => {
              const isActive = b.id === boardId;
              return (
                <li key={b.id}>
                  <Link
                    href={`/w/${workspaceId}/b/${b.id}`}
                    className={`block rounded px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-blue-600 font-medium text-white"
                        : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                    }`}
                  >
                    {b.name}
                    {b.isPublic && (
                      <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                        Public
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
