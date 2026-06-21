"use client";

import { useParams } from "next/navigation";
import { BoardCanvas } from "@/features/boards/components/board-canvas";

/**
 * Workspace Board page route.
 * Pulls parameters and mounts the interactive Kanban Board canvas.
 */
export default function BoardDetailPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const boardId = params.boardId as string;

  return <BoardCanvas boardId={boardId} workspaceId={workspaceId} />;
}
