import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { apiClient } from "@/lib/api-client";
import { ActivityLog } from "@/types";

/**
 * Hook to retrieve workspace activity logs.
 * Registers a client-side listener for "mock-activity-logged" custom events
 * so that any mutations immediately prepend to the React Query cache.
 */
export const useActivityFeed = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<ActivityLog[], Error>({
    queryKey: queryKeys.activities.list(workspaceId),
    queryFn: () => apiClient.get<ActivityLog[]>(`/workspaces/${workspaceId}/activities`),
    enabled: !!workspaceId,
  });

  useEffect(() => {
    if (typeof window === "undefined" || !workspaceId) return;

    const handleNewActivityLogged = (event: Event) => {
      const customEvent = event as CustomEvent<ActivityLog>;
      const newLog = customEvent.detail;

      if (newLog.workspaceId === workspaceId) {
        // Optimistically update feed cache
        queryClient.setQueryData<ActivityLog[]>(
          queryKeys.activities.list(workspaceId),
          (oldLogs) => {
            if (!oldLogs) return [newLog];
            if (oldLogs.some((item) => item.id === newLog.id)) return oldLogs;
            return [newLog, ...oldLogs];
          }
        );
      }
    };

    window.addEventListener("mock-activity-logged", handleNewActivityLogged);
    return () => {
      window.removeEventListener("mock-activity-logged", handleNewActivityLogged);
    };
  }, [workspaceId, queryClient]);

  return query;
};
