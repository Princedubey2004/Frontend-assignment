"use client";

import React from "react";
import { BoardCanvas } from "@/features/boards/components/board-canvas";
import { useBoard } from "@/features/boards/api/use-boards";
import Link from "next/link";

interface PublicBoardClientProps {
  boardId: string;
}

export function PublicBoardClient({ boardId }: PublicBoardClientProps) {
  const { data: board, isLoading, isError } = useBoard(boardId);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">Loading guest board view...</p>
        </div>
      </div>
    );
  }

  if (isError || !board || !board.isPublic) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-950 text-slate-100 px-6 text-center gap-4">
        <h2 className="text-lg font-semibold text-rose-400">Board Unavailable</h2>
        <p className="text-sm text-slate-500 max-w-xs">
          The requested board does not exist or the owner has restricted public sharing.
        </p>
        <Link href="/login" className="text-xs font-semibold text-blue-500 hover:underline">
          Return to login screen &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <header className="flex h-16 items-center justify-between border-b border-slate-800 px-8 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-tight text-blue-400">TaskBoard</span>
          <span className="rounded bg-slate-800/80 border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
            Guest View (Read Only)
          </span>
        </div>
        <Link
          href="/login"
          className="text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800 rounded px-3 py-1.5"
        >
          Sign In
        </Link>
      </header>

      <div className="flex-1">
        <BoardCanvas boardId={boardId} workspaceId={board.workspaceId} isReadOnly={true} />
      </div>
    </div>
  );
}
