export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
}

export interface Board {
  id: string;
  workspaceId: string;
  name: string;
  isPublic: boolean;
  createdAt: string;
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  order: number;
}

export interface Task {
  id: string;
  columnId: string;
  boardId?: string;
  title: string;
  description?: string;
  order: number;
  assignees: User[];
  dueDate?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  updatedAt?: string;
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  userId: string;
  user: User;
  action: "CREATE" | "UPDATE" | "DELETE" | "MOVE";
  entityType: "BOARD" | "COLUMN" | "TASK";
  entityName: string;
  createdAt: string;
}
