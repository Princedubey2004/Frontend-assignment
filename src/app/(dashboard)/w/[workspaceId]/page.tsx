"use client";

import { useParams } from "next/navigation";
import { useWorkspace } from "@/features/workspaces/api/use-workspaces";
import { useBoards, useCreateBoard } from "@/features/boards/api/use-boards";
import { useState } from "react";
import Link from "next/link";

/**
 * Workspace Detail View page.
 * Lists boards, exposes filters, and allows appending new board layouts.
 */
export default function WorkspaceDetailPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const { data: workspace, isLoading: isLoadingWorkspace } = useWorkspace(workspaceId);
  const { data: boards, isLoading: isLoadingBoards } = useBoards(workspaceId);
  const createBoard = useCreateBoard(workspaceId);

  const [newBoardName, setNewBoardName] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleCreateBoardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    createBoard.mutate(
      { name: newBoardName, isPublic },
      {
        onSuccess: () => {
          setNewBoardName("");
          setIsPublic(false);
        },
      }
    );
  };

  if (isLoadingWorkspace || isLoadingBoards) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8 bg-slate-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-rose-400">Workspace not found</h2>
        <p className="text-sm text-slate-400 mt-2">
          Verify the ID or select another workspace from the sidebar menu.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 bg-slate-950 text-slate-100 min-h-full">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">{workspace.name}</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your task board timelines, columns, and priorities.
        </p>
      </div>

      {/* BOARDS CONTAINER */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200">Boards List</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* RENDER ACTIVE BOARDS */}
          {boards?.map((board) => (
            <Link
              key={board.id}
              href={`/w/${workspaceId}/b/${board.id}`}
              className="flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-5 transition-all hover:border-slate-700 hover:bg-slate-900/60"
            >
              <div>
                <h4 className="font-semibold text-slate-200">{board.name}</h4>
                <p className="text-xs text-slate-500 mt-2">
                  Created: {new Date(board.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span
                  className={`rounded px-1.5 py-0.5 font-semibold ${
                    board.isPublic
                      ? "bg-emerald-950/40 text-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {board.isPublic ? "Public Shareable" : "Private"}
                </span>
                <span className="text-blue-400 font-semibold group-hover:underline">Open &rarr;</span>
              </div>
            </Link>
          ))}

          {/* ADD BOARD CONTAINER CARD */}
          <form
            onSubmit={handleCreateBoardSubmit}
            className="flex flex-col justify-between rounded-lg border border-dashed border-slate-800 bg-slate-900/10 p-5 space-y-4"
          >
            <div>
              <h4 className="font-semibold text-slate-400 text-sm">Add New Board</h4>
              <input
                type="text"
                placeholder="Board title..."
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="mt-2.5 w-full rounded border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500"
              />
              <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-xs text-slate-400">Make board publicly viewable</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={createBoard.isPending}
              className="w-full rounded bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              {createBoard.isPending ? "Creating..." : "Create Board"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
