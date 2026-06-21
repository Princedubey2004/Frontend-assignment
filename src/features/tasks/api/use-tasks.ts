import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { Task } from "@/types";
import { BoardDetails } from "@/features/boards/api/use-boards";

/**
 * Hook to create a task in a column.
 */
export const useCreateTask = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      columnId: string;
      title: string;
      description?: string;
      priority?: Task["priority"];
      assigneeIds?: string[];
    }) => apiClient.post<Task>("/tasks", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(boardId) });
    },
  });
};

/**
 * Hook to update task parameters (title, description, assignees, priorities).
 */
export const useUpdateTask = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      ...payload
    }: {
      taskId: string;
      title?: string;
      description?: string;
      priority?: Task["priority"];
      assigneeIds?: string[];
    }) => apiClient.patch<Task>(`/tasks/${taskId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(boardId) });
    },
  });
};

/**
 * Hook to delete a task.
 */
export const useDeleteTask = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => apiClient.delete(`/tasks/${taskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(boardId) });
    },
  });
};

/**
 * Hook to handle card dragging.
 * Employs optimistic updates to visually re-arrange task cards instantly in the browser cache,
 * with automatic fallback logic to the prior snapshot if the mock API fails.
 */
export const useMoveTask = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      columnId,
      order,
    }: {
      taskId: string;
      columnId: string;
      order: number;
    }) => apiClient.patch<Task>(`/tasks/${taskId}/move`, { columnId, order }),

    onMutate: async (newMove) => {
      // Cancel outgoing fetches to avoid overwriting our optimistic state
      await queryClient.cancelQueries({ queryKey: queryKeys.boards.detail(boardId) });

      // Save previous state as snapshot
      const previousBoard = queryClient.getQueryData<BoardDetails>(queryKeys.boards.detail(boardId));

      if (previousBoard) {
        const updatedTasks = [...previousBoard.tasks];
        const taskIndex = updatedTasks.findIndex((t) => t.id === newMove.taskId);

        if (taskIndex !== -1) {
          const task = { ...updatedTasks[taskIndex] };
          const oldColumnId = task.columnId;

          // Remove the moved task from the tasks array temporarily
          updatedTasks.splice(taskIndex, 1);

          // Update task's column
          task.columnId = newMove.columnId;

          // Re-sort current task items under old and new columns
          const sourceTasks = updatedTasks.filter((t) => t.columnId === oldColumnId);
          sourceTasks.sort((a, b) => a.order - b.order).forEach((t, index) => {
            t.order = index + 1;
          });

          const destTasks = updatedTasks.filter((t) => t.columnId === newMove.columnId);
          destTasks.sort((a, b) => a.order - b.order);
          // Insert task at requested index (1-based index converted to 0-based index)
          destTasks.splice(newMove.order - 1, 0, task);
          destTasks.forEach((t, index) => {
            t.order = index + 1;
          });

          // Re-merge all tasks
          const finalTasks = [
            ...updatedTasks.filter((t) => t.columnId !== oldColumnId && t.columnId !== newMove.columnId),
            ...sourceTasks,
            ...destTasks,
          ];

          // Optimistically update the UI cache
          queryClient.setQueryData<BoardDetails>(queryKeys.boards.detail(boardId), {
            ...previousBoard,
            tasks: finalTasks,
          });
        }
      }

      // Return context containing previous state to trigger rollbacks if needed
      return { previousBoard };
    },

    onError: (err, newMove, context) => {
      // Rollback to snapshot on error
      if (context?.previousBoard) {
        queryClient.setQueryData(queryKeys.boards.detail(boardId), context.previousBoard);
      }
    },

    onSettled: () => {
      // Re-fetch to synchronize with backend database
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(boardId) });
    },
  });
};
