import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { isSessionExpired, clearSession } from "@/lib/auth";

/**
 * Hook to retrieve the current user context.
 * Performs session validation using centralized auth helpers.
 */
export const useCurrentUser = () => {
  return useQuery<User, Error>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      if (typeof window !== "undefined") {
        const expired = isSessionExpired();
        if (expired) {
          const token = localStorage.getItem("auth_token");
          const issuedAt = localStorage.getItem("auth_issued_at");
          const hasSession = !!token && !!issuedAt;

          clearSession();
          if (hasSession) {
            localStorage.setItem("session_expired", "true");
          }
          throw new Error("SESSION_EXPIRED");
        }
      }
      return apiClient.get<User>("/auth/me");
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("auth_token"),
    retry: false,
  });
};

/**
 * Mutation hook for logging in.
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.post<User>("/auth/login", credentials),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.me(), user);
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.list() });
      router.push("/");
    },
  });
};

/**
 * Hook to log out.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = () => {
    clearSession();
    queryClient.clear();
    router.push("/login");
  };

  return logout;
};
