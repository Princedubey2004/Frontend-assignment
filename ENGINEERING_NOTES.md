Engineering Notes

Project Overview

TaskBoard is a Kanban-style task management platform built with Next.js 15, React 19, TypeScript, Zustand, and TanStack Query.

The application allows users to create workspaces, manage boards, organize tasks using drag-and-drop interactions, and share boards publicly through read-only links.

⸻

Architecture

The application follows a feature-based architecture where business domains are separated into independent modules.

Main modules:

* Authentication
* Workspaces
* Boards
* Tasks
* Activity Feed

This structure keeps the codebase scalable and easy to maintain as features grow.

⸻

State Management

The project uses two different state management layers.

TanStack Query

Used for:

* API communication
* Server state caching
* Mutations
* Optimistic updates

Zustand

Used for:

* Search filters
* UI preferences
* Local board state

Separating server state from UI state keeps components simpler and reduces unnecessary re-renders.

⸻

Authentication

Protected routes are handled through an AuthGuard component.

Features:

* Session validation
* Automatic logout on session expiry
* Login redirection
* Route protection

Expired sessions are detected before protected content is rendered.

⸻

Board Management

Each workspace can contain multiple boards.

Features include:

* Board creation
* Public/private visibility
* Board navigation
* Workspace-specific board organization

Public boards generate shareable links that can be accessed without authentication.

⸻

Public Board Sharing

Public boards are available through:

/public/board/[boardId]

Guest users can:

* View columns
* View tasks
* View board structure

Guest users cannot:

* Create tasks
* Move tasks
* Modify board settings

This ensures safe public sharing while preserving data integrity.

⸻

Drag and Drop

Task movement is implemented using:

* @hello-pangea/dnd

Users can drag tasks between columns and reorder them within a column.

Changes are persisted through task mutation handlers.

⸻

Activity Feed

The activity feed records important actions such as:

* Board creation
* Task creation
* Board updates

This provides visibility into workspace activity.

⸻

Technical Decisions

Why Next.js 15?

* App Router support
* Server Components
* Better routing architecture
* Improved performance

Why TanStack Query?

* Automatic caching
* Background synchronization
* Mutation handling
* Better API state management

Why Zustand?

* Lightweight
* Minimal boilerplate
* Fast performance

Why Feature-Based Structure?

Keeps business logic organized and makes future development easier.

⸻

Challenge Encountered

Public Board Route Resolution

During development, public board routes were failing because dynamic route parameters in Next.js 15 were being resolved asynchronously.

This caused boardId to become undefined, resulting in failed board lookups.

Solution:

* Added runtime-safe parameter resolution
* Ensured boardId is resolved before rendering the public board client component

After the fix, public boards load correctly while private boards remain protected.

⸻

Future Improvements

Potential enhancements:

* Real-time collaboration using WebSockets
* User invitations and team management
* Role-based permissions
* Notifications
* Advanced filtering
* Mobile-first optimizations

⸻

Deployment

The project is deployed on Vercel.

Build Verification:

* ESLint: Passed
* TypeScript: Passed
* Production Build: Passed

The application is production-ready and supports public board sharing, workspace management, authentication, and drag-and-drop task management.
