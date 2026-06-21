import { User, Workspace, Board, Column, Task, ActivityLog } from "@/types";

const STORAGE_KEY = "task_manager_mock_db";

interface MockDB {
  users: User[];
  workspaces: Workspace[];
  boards: Board[];
  columns: Column[];
  tasks: Task[];
  activities: ActivityLog[];
}

const DEFAULT_USERS: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: "u2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
];

const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: "w1",
    name: "Engineering Team",
    slug: "engineering-team",
    ownerId: "u1",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "w2",
    name: "Marketing Launch",
    slug: "marketing-launch",
    ownerId: "u1",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const DEFAULT_BOARDS: Board[] = [
  {
    id: "b1",
    workspaceId: "w1",
    name: "Product Roadmap",
    isPublic: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "b2",
    workspaceId: "w1",
    name: "Sprint Backlog",
    isPublic: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const DEFAULT_COLUMNS: Column[] = [
  { id: "c1", boardId: "b1", title: "To Do", order: 1 },
  { id: "c2", boardId: "b1", title: "In Progress", order: 2 },
  { id: "c3", boardId: "b1", title: "Done", order: 3 },
];

const DEFAULT_TASKS: Task[] = [
  {
    id: "t1",
    columnId: "c1",
    title: "Design Database Schema",
    description: "Draw ERDs and define initial schema layouts.",
    order: 1,
    assignees: [DEFAULT_USERS[0]],
    priority: "HIGH",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "t2",
    columnId: "c1",
    title: "Setup CI/CD Pipeline",
    description: "Configure GitHub Actions deployment workflows.",
    order: 2,
    assignees: [DEFAULT_USERS[1]],
    priority: "MEDIUM",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "t3",
    columnId: "c2",
    title: "Implement Auth Guard",
    description: "Build client-side routing protection rules.",
    order: 1,
    assignees: [DEFAULT_USERS[0]],
    priority: "HIGH",
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
];

const DEFAULT_ACTIVITIES: ActivityLog[] = [
  {
    id: "a1",
    workspaceId: "w1",
    userId: "u1",
    user: DEFAULT_USERS[0],
    action: "CREATE",
    entityType: "BOARD",
    entityName: "Product Roadmap",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

export function getMockDB(): MockDB {
  if (typeof window === "undefined") {
    return {
      users: DEFAULT_USERS,
      workspaces: DEFAULT_WORKSPACES,
      boards: DEFAULT_BOARDS,
      columns: DEFAULT_COLUMNS,
      tasks: DEFAULT_TASKS,
      activities: DEFAULT_ACTIVITIES,
    };
  }

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initialDb: MockDB = {
      users: DEFAULT_USERS,
      workspaces: DEFAULT_WORKSPACES,
      boards: DEFAULT_BOARDS,
      columns: DEFAULT_COLUMNS,
      tasks: DEFAULT_TASKS,
      activities: DEFAULT_ACTIVITIES,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDb));
    return initialDb;
  }
  return JSON.parse(data);
}

export function saveMockDB(db: MockDB) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
}

/**
 * Utility helper to trigger simulated activity logging when workspace items change.
 */
export function logMockActivity(
  workspaceId: string,
  userId: string,
  action: ActivityLog["action"],
  entityType: ActivityLog["entityType"],
  entityName: string
) {
  const db = getMockDB();
  const user = db.users.find((u) => u.id === userId) || DEFAULT_USERS[0];
  const newLog: ActivityLog = {
    id: Math.random().toString(36).substring(2, 9),
    workspaceId,
    userId,
    user,
    action,
    entityType,
    entityName,
    createdAt: new Date().toISOString(),
  };

  db.activities = [newLog, ...db.activities];
  saveMockDB(db);

  // Dispatch custom client-side event so activity components can sync state without reloading
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mock-activity-logged", { detail: newLog }));
  }
}
