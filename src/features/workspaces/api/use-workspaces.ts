import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { Workspace } from "@/types";

/**
 * Hook to retrieve all workspaces for the authenticated user.
 */
export const useWorkspaces = () => {
  return useQuery<Workspace[], Error>({
    queryKey: queryKeys.workspaces.list(),
    queryFn: () => apiClient.get<Workspace[]>("/workspaces"),
  });
};

/**
 * Hook to retrieve a single workspace by ID.
 */
export const useWorkspace = (workspaceId: string) => {
  return useQuery<Workspace, Error>({
    queryKey: queryKeys.workspaces.detail(workspaceId),
    queryFn: () => apiClient.get<Workspace>(`/workspaces/${workspaceId}`),
    enabled: !!workspaceId,
  });
};

/**
 * Hook to trigger workspace creation.
 */
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string }) =>
      apiClient.post<Workspace>("/workspaces", payload),
    onSuccess: () => {
      // Refresh workspaces listings in sidebar
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.list() });
    },
  });
};
