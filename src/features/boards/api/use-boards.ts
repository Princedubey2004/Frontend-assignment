import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { Board, Column, Task } from "@/types";

export interface BoardDetails extends Board {
  columns: Column[];
  tasks: Task[];
}

/**
 * Hook to retrieve all boards under a specific workspace.
 */
export const useBoards = (workspaceId: string) => {
  return useQuery<Board[], Error>({
    queryKey: queryKeys.boards.list(workspaceId),
    queryFn: () => apiClient.get<Board[]>(`/workspaces/${workspaceId}/boards`),
    enabled: !!workspaceId,
  });
};

/**
 * Hook to retrieve a detailed board view (metadata, columns, tasks).
 * Used by both workspace board canvas and public read-only views.
 */
export const useBoard = (boardId: string) => {
  return useQuery<BoardDetails, Error>({
    queryKey: queryKeys.boards.detail(boardId),
    queryFn: () => apiClient.get<BoardDetails>(`/boards/${boardId}`),
    enabled: !!boardId,
  });
};

/**
 * Hook to create a board.
 */
export const useCreateBoard = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; isPublic?: boolean }) =>
      apiClient.post<Board>("/boards", { ...payload, workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.list(workspaceId) });
    },
  });
};

/**
 * Hook to update board settings (name, visibility).
 */
export const useUpdateBoard = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name?: string; isPublic?: boolean }) =>
      apiClient.patch<Board>(`/boards/${boardId}`, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(boardId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.list(data.workspaceId) });
    },
  });
};

/**
 * Hook to delete a board.
 */
export const useDeleteBoard = (boardId: string, workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.delete(`/boards/${boardId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.list(workspaceId) });
    },
  });
};
