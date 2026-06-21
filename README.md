# TaskBoard

A lightweight SaaS task management platform built as a senior frontend engineering take-home assignment.

It features authentication, workspaces, dynamic Kanban boards with drag-and-drop support, search/priority filtering, and read-only public board sharing.

## Tech Stack

* **Core**: Next.js 15 (App Router), React 19, TypeScript
* **State Management**: 
  * Server Cache: TanStack Query (React Query)
  * Local UI State: Zustand
* **Drag-and-Drop**: `@hello-pangea/dnd`
* **Styling**: Tailwind CSS
* **API Client**: Axios (wrapping mock client adapters)

---

## Folder Structure & Architecture

The project follows a feature-based organization to ensure scalability:

```text
src/
├── app/                  # Next.js App Router Pages and Layouts
│   ├── (auth)/           # Authentication layout and login view
│   ├── (dashboard)/      # Workspace dashboard shell and pages
│   └── public/           # Shared read-only public board views
├── features/             # Feature domains encapsulating hooks, components, and state
│   ├── auth/             # Session verification and login forms
│   ├── workspaces/       # Workspace actions and api queries
│   ├── boards/           # Board canvas and column states
│   └── tasks/            # Task mutations and dnd handlers
├── lib/                  # Centralized utilities (mock database, HTTP client, auth helpers)
└── types/                # Unified TypeScript interfaces
```

### Technical Tradeoffs & Design Decisions

1. **Client-Side Mock Database (`localStorage`)**
   * **Why**: To keep the assignment zero-dependency and deployment-friendly, a mock database resides in the browser's client storage.
   * **Tradeoff**: Collaborative updates won't sync across separate client devices/browsers, but it allows fully stateful CRUD operations, dynamic page re-renders, and instant mock latency simulation.
2. **TanStack Query + Zustand Separation**
   * Server-managed data (workspaces, boards, tasks) is stored in the React Query cache, allowing easy cache invalidation and mutation overrides.
   * Client-only state (active search term, current priority filters) is handled in a lightweight Zustand store.
3. **Dynamic Parameter Resolution (Next.js 15)**
   * Page routing parameters are Promise-based in Next.js 15. The server pages resolve parameter queries asynchronously before passing parameters to client components, preventing hydration mismatches.

---

## Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the application.

* **Test Credentials**: You can log in using any email address and the default password: `password` (e.g., `test@example.com` / `password`). Successful login seeds a default workspace and board structure automatically.

---

## Vercel Deployment

This project builds out-of-the-box on Vercel without requiring external environment variables, database connections, or API configurations.

### Deploy Steps:
1. Push this workspace code to a remote GitHub repository.
2. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
3. Select your repository and select the **Next.js** framework preset.
4. Click **Deploy**. Vercel will build and host the static and dynamic App Router routes automatically.
