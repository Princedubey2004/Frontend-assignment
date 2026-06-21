import { create } from "zustand";

interface BoardUIState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priorityFilter: "ALL" | "LOW" | "MEDIUM" | "HIGH";
  setPriorityFilter: (filter: "ALL" | "LOW" | "MEDIUM" | "HIGH") => void;
  collapsedColumns: Record<string, boolean>; // Map of colId -> collapsed (boolean)
  toggleColumnCollapse: (columnId: string) => void;
  resetFilters: () => void;
}

/**
 * Zustand store to govern Kanban board client UI state (filtering, search, collapsible columns).
 * Note: Board zoom state has been removed to simplify layout constraints.
 */
export const useBoardStore = create<BoardUIState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  priorityFilter: "ALL",
  setPriorityFilter: (filter) => set({ priorityFilter: filter }),

  collapsedColumns: {},
  toggleColumnCollapse: (columnId) =>
    set((state) => ({
      collapsedColumns: {
        ...state.collapsedColumns,
        [columnId]: !state.collapsedColumns[columnId],
      },
    })),

  resetFilters: () => set({ searchQuery: "", priorityFilter: "ALL" }),
}));
