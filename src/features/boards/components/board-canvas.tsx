"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useBoard, useUpdateBoard } from "../api/use-boards";
import { useMoveTask, useCreateTask } from "@/features/tasks/api/use-tasks";
import { useBoardStore } from "../store/use-board-store";
import { ActivityFeedList } from "@/features/activity-feed/components/activity-feed-list";

interface BoardCanvasProps {
  boardId: string;
  workspaceId: string;
  isReadOnly?: boolean;
}

export function BoardCanvas({ boardId, workspaceId, isReadOnly = false }: BoardCanvasProps) {
  const { data: board, isLoading, isError } = useBoard(boardId);
  const updateBoard = useUpdateBoard(boardId);
  const moveTask = useMoveTask(boardId);
  const createTask = useCreateTask(boardId);

  const { searchQuery, priorityFilter } = useBoardStore();
  const [draftTaskTitles, setDraftTaskTitles] = useState<Record<string, string>>({});
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShareUrl(`${window.location.origin}/public/board/${boardId}`);
    }
  }, [boardId]);

  const handleDragEnd = (result: DropResult) => {
    if (isReadOnly) return;
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    moveTask.mutate({
      taskId: draggableId,
      columnId: destination.droppableId,
      order: destination.index + 1,
    });
  };

  const handleAddTaskSubmit = (columnId: string) => {
    const title = draftTaskTitles[columnId];
    if (!title || !title.trim()) return;

    createTask.mutate(
      { columnId, title, priority: "MEDIUM" },
      {
        onSuccess: () => {
          setDraftTaskTitles((prev) => ({ ...prev, [columnId]: "" }));
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center bg-slate-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (isError || !board) {
    return (
      <div className="p-8 text-center bg-slate-950 text-rose-400">
        <p className="font-semibold">Failed to fetch board details.</p>
      </div>
    );
  }

  const filteredTasks = board.tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="flex h-full bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)]">
      <div className="flex-1 flex flex-col p-6 min-w-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold">{board.name}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Drag task cards between column sections to track project progress.
            </p>
          </div>

          {!isReadOnly && (
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={board.isPublic}
                  onChange={(e) => updateBoard.mutate({ isPublic: e.target.checked })}
                  className="rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-slate-400">Make Board Public</span>
              </label>

              {board.isPublic && shareUrl && (
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
                  <span className="text-slate-500">Share Link:</span>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline text-xs truncate max-w-[250px]"
                  >
                    {shareUrl}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start select-none">
            {board.columns.map((column) => {
              const columnTasks = filteredTasks
                .filter((t) => t.columnId === column.id)
                .sort((a, b) => a.order - b.order);

              return (
                <div
                  key={column.id}
                  className="flex flex-col w-72 flex-shrink-0 bg-slate-900/60 border border-slate-800 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-sm text-slate-200">{column.title}</h3>
                    <span className="text-2xs rounded-full bg-slate-800 px-2 py-0.5 text-slate-400">
                      {columnTasks.length}
                    </span>
                  </div>

                  <Droppable droppableId={column.id} type="TASK" isDropDisabled={isReadOnly}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 min-h-[150px] space-y-2 rounded transition-colors ${
                          snapshot.isDraggingOver ? "bg-slate-850/40" : ""
                        }`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                            isDragDisabled={isReadOnly}
                          >
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                className={`rounded border border-slate-800 bg-slate-950 p-3 shadow hover:border-slate-700 transition-all ${
                                  dragSnapshot.isDragging ? "border-blue-600 scale-[1.02]" : ""
                                }`}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <h4 className="text-xs font-semibold text-slate-200">{task.title}</h4>
                                  <span
                                    className={`text-[9px] font-semibold px-1 rounded uppercase ${
                                      task.priority === "HIGH"
                                        ? "bg-rose-950/40 text-rose-400"
                                        : task.priority === "MEDIUM"
                                        ? "bg-amber-950/40 text-amber-400"
                                        : "bg-slate-800 text-slate-400"
                                    }`}
                                  >
                                    {task.priority}
                                  </span>
                                </div>
                                {task.description && (
                                  <p className="text-[10px] text-slate-500 mt-1 truncate">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {!isReadOnly && (
                    <div className="mt-3 border-t border-slate-800/60 pt-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Task title..."
                          value={draftTaskTitles[column.id] || ""}
                          onChange={(e) =>
                            setDraftTaskTitles((prev) => ({ ...prev, [column.id]: e.target.value }))
                          }
                          className="flex-1 rounded border border-slate-800 bg-slate-950 px-2 py-1 text-xs outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleAddTaskSubmit(column.id)}
                          className="rounded bg-blue-600 hover:bg-blue-500 text-white text-xs px-2.5 py-1 font-semibold"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {!isReadOnly && (
        <aside className="w-80 flex-shrink-0">
          <ActivityFeedList workspaceId={workspaceId} />
        </aside>
      )}
    </div>
  );
}
