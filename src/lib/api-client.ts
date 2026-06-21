import { getMockDB, saveMockDB } from "./mock-db";
import { Workspace, Board, Task } from "@/types";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    await delay();
    const db = getMockDB();

    if (url === "/auth/me") {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      if (!token) {
        throw new Error("No token provided");
      }
      const user = db.users.find((u) => u.id === token);
      if (!user) {
        throw new Error("User not found");
      }
      return user as unknown as T;
    }

    if (url === "/workspaces") {
      return db.workspaces as unknown as T;
    }

    if (url.startsWith("/workspaces/") && url.endsWith("/boards")) {
      const workspaceId = url.split("/")[2];
      const boards = db.boards.filter((b) => b.workspaceId === workspaceId);
      return boards as unknown as T;
    }

    if (url.startsWith("/workspaces/") && url.endsWith("/activities")) {
      const workspaceId = url.split("/")[2];
      const activities = db.activities.filter((a) => a.workspaceId === workspaceId);
      return activities as unknown as T;
    }

    if (url.startsWith("/workspaces/")) {
      const id = url.split("/")[2];
      const workspace = db.workspaces.find((w) => w.id === id);
      if (!workspace) {
        throw new Error("Workspace not found");
      }
      return workspace as unknown as T;
    }

    if (url.startsWith("/boards?workspaceId=")) {
      const workspaceId = url.split("=")[1];
      const boards = db.boards.filter((b) => b.workspaceId === workspaceId);
      return boards as unknown as T;
    }

    if (url.startsWith("/boards/")) {
      const id = url.split("/")[2];
      const board = db.boards.find((b) => b.id === id);
      if (!board) {
        throw new Error("Board not found");
      }
      const columns = db.columns.filter((c) => c.boardId === board.id);
      const tasks = db.tasks.filter((t) => t.boardId === board.id);
      return {
        ...board,
        columns,
        tasks,
      } as unknown as T;
    }

    throw new Error(`Mock GET route not found for: ${url}`);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: async <T>(url: string, body: any): Promise<T> => {
    await delay();
    const db = getMockDB();
    const currentUserId = typeof window !== "undefined" ? localStorage.getItem("auth_token") || "u1" : "u1";

    if (url === "/auth/login") {
      const { email, password } = body;
      if (password !== "password") {
        throw new Error("Invalid email or password.");
      }
      
      let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        const newUserId = "u_" + Math.random().toString(36).substring(2, 9);
        const namePart = email.split("@")[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        user = {
          id: newUserId,
          name: formattedName,
          email: email,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${namePart}`,
        };
        db.users.push(user);

        const workspaceId = "w_" + Math.random().toString(36).substring(2, 9);
        const newWorkspace = {
          id: workspaceId,
          name: `${formattedName}'s Workspace`,
          slug: `${namePart}-workspace`,
          ownerId: newUserId,
          createdAt: new Date().toISOString(),
        };
        db.workspaces.push(newWorkspace);

        const boardId = "b_" + Math.random().toString(36).substring(2, 9);
        const newBoard = {
          id: boardId,
          workspaceId,
          name: "Project Board",
          isPublic: true,
          createdAt: new Date().toISOString(),
        };
        db.boards.push(newBoard);

        const defaultColumns = [
          { id: "col_todo_" + boardId, boardId, title: "To Do", order: 1 },
          { id: "col_progress_" + boardId, boardId, title: "In Progress", order: 2 },
          { id: "col_done_" + boardId, boardId, title: "Done", order: 3 },
        ];
        db.columns.push(...defaultColumns);

        saveMockDB(db);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", user.id);
        localStorage.setItem("auth_issued_at", Date.now().toString());
        localStorage.removeItem("session_expired");
      }
      return user as unknown as T;
    }

    if (url === "/workspaces") {
      const newWorkspace: Workspace = {
        id: "w_" + Math.random().toString(36).substring(2, 9),
        name: body.name,
        slug: body.name.toLowerCase().replace(/ /g, "-"),
        ownerId: currentUserId,
        createdAt: new Date().toISOString(),
      };
      db.workspaces.push(newWorkspace);
      saveMockDB(db);
      return newWorkspace as unknown as T;
    }

    if (url === "/boards") {
      const newBoard: Board = {
        id: "b_" + Math.random().toString(36).substring(2, 9),
        workspaceId: body.workspaceId,
        name: body.name,
        isPublic: body.isPublic || false,
        createdAt: new Date().toISOString(),
      };
      db.boards.push(newBoard);

      const defaultColumns = [
        { id: "col_todo_" + newBoard.id, boardId: newBoard.id, title: "To Do", order: 1 },
        { id: "col_progress_" + newBoard.id, boardId: newBoard.id, title: "In Progress", order: 2 },
        { id: "col_done_" + newBoard.id, boardId: newBoard.id, title: "Done", order: 3 },
      ];
      db.columns.push(...defaultColumns);

      saveMockDB(db);
      return newBoard as unknown as T;
    }

    if (url === "/tasks") {
      const newOrder = db.tasks.filter((t) => t.columnId === body.columnId).length + 1;
      const newTask: Task = {
        id: "t_" + Math.random().toString(36).substring(2, 9),
        boardId: body.boardId,
        columnId: body.columnId,
        title: body.title,
        description: body.description || "",
        assignees: [],
        priority: body.priority || "MEDIUM",
        order: newOrder,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.tasks.push(newTask);
      saveMockDB(db);
      return newTask as unknown as T;
    }

    throw new Error(`Mock POST route not found for: ${url}`);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: async <T>(url: string, body: any): Promise<T> => {
    await delay();
    const db = getMockDB();

    if (url.startsWith("/boards/")) {
      const id = url.split("/")[2];
      const index = db.boards.findIndex((b) => b.id === id);
      if (index === -1) {
        throw new Error("Board not found");
      }
      db.boards[index] = { ...db.boards[index], ...body };
      saveMockDB(db);
      return db.boards[index] as unknown as T;
    }

    throw new Error(`Mock PUT route not found for: ${url}`);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch: async <T>(url: string, body: any): Promise<T> => {
    await delay();
    const db = getMockDB();

    if (url.startsWith("/tasks/")) {
      const taskId = url.split("/")[2];
      const taskIndex = db.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) {
        throw new Error("Task not found");
      }

      const task = db.tasks[taskIndex];
      const destinationColumnId = body.columnId || task.columnId;
      const newOrder = body.order || task.order;

      if (task.columnId !== destinationColumnId) {
        const sourceTasks = db.tasks
          .filter((t) => t.columnId === task.columnId && t.id !== task.id)
          .sort((a, b) => a.order - b.order);
        sourceTasks.forEach((t, idx) => {
          t.order = idx + 1;
        });

        const destTasks = db.tasks
          .filter((t) => t.columnId === destinationColumnId)
          .sort((a, b) => a.order - b.order);
        
        destTasks.splice(newOrder - 1, 0, task);
        destTasks.forEach((t, idx) => {
          t.order = idx + 1;
        });

        task.columnId = destinationColumnId;
      } else {
        const colTasks = db.tasks
          .filter((t) => t.columnId === task.columnId && t.id !== task.id)
          .sort((a, b) => a.order - b.order);

        colTasks.splice(newOrder - 1, 0, task);
        colTasks.forEach((t, idx) => {
          t.order = idx + 1;
        });
      }

      task.updatedAt = new Date().toISOString();
      saveMockDB(db);
      return task as unknown as T;
    }

    throw new Error(`Mock PATCH route not found for: ${url}`);
  },

  delete: async <T>(url: string): Promise<T> => {
    await delay();
    const db = getMockDB();

    if (url.startsWith("/tasks/")) {
      const id = url.split("/")[2];
      const task = db.tasks.find((t) => t.id === id);
      if (!task) {
        throw new Error("Task not found");
      }
      db.tasks = db.tasks.filter((t) => t.id !== id);

      const colTasks = db.tasks
        .filter((t) => t.columnId === task.columnId)
        .sort((a, b) => a.order - b.order);
      colTasks.forEach((t, idx) => {
        t.order = idx + 1;
      });

      saveMockDB(db);
      return { success: true } as unknown as T;
    }

    throw new Error(`Mock DELETE route not found for: ${url}`);
  },
};
