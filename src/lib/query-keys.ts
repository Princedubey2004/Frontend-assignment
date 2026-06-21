export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  workspaces: {
    list: () => ["workspaces"] as const,
    detail: (id: string) => ["workspace", id] as const,
  },
  boards: {
    list: (workspaceId: string) => ["boards", workspaceId] as const,
    detail: (boardId: string) => ["board", boardId] as const,
  },
  activities: {
    list: (workspaceId: string) => ["activities", workspaceId] as const,
  },
};
