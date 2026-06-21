TaskBoard

A modern SaaS-inspired task management platform built as a frontend engineering assignment using Next.js 15, React 19, TypeScript, Zustand, and TanStack Query.

The application enables users to create workspaces, manage Kanban boards, organize tasks with drag-and-drop interactions, monitor workspace activity, and share boards publicly through read-only links.

⸻

Live Demo

Application:
https://frontend-assignment-two-roan.vercel.app/login

GitHub Repository:
https://github.com/Princedubey2004/Frontend-assignment

⸻

Features

Authentication & Session Management

* Login-based workspace access
* Protected dashboard routes
* Session expiration detection
* Automatic redirect for unauthorized users

Workspace Management

* Multiple workspace support
* Workspace switching from sidebar
* Workspace-scoped boards and activity feeds

Kanban Board System

* Create and manage boards
* Drag-and-drop task movement between columns
* Optimistic UI updates
* Public and private board visibility

Task Management

* Create tasks inside board columns
* Priority levels (Low, Medium, High)
* Task filtering by priority
* Search-based task discovery

Activity Feed

* Workspace-level event tracking
* Board creation events
* Task creation events
* Board update logs

Public Board Sharing

* Generate shareable board links
* Read-only guest access
* Private board protection
* No authentication required for public viewers

⸻

Tech Stack

Frontend

* Next.js 15 (App Router)
* React 19
* TypeScript

State Management

* TanStack Query (Server State)
* Zustand (Client State)

Styling

* Tailwind CSS

Drag & Drop

* @hello-pangea/dnd

Data Layer

* Axios
* Local Storage Mock Database

⸻

Architecture

The project follows a feature-based architecture to keep business logic modular and maintainable.

src/
├── app/
│   ├── (auth)
│   ├── (dashboard)
│   └── public
│
├── features/
│   ├── auth
│   ├── workspaces
│   ├── boards
│   ├── tasks
│   └── activity-feed
│
├── lib/
│   ├── auth
│   ├── mock-db
│   └── api
│
└── types/

Architecture Decisions

* Feature-based separation improves maintainability.
* React Query manages server-like state and caching.
* Zustand handles lightweight UI state.
* Mock APIs simulate realistic asynchronous operations.
* Local storage acts as a persistent browser-side database.

⸻

Public Board Sharing

Users can make a board public from the board settings panel.

Once enabled, a public URL is generated:

/public/board/[boardId]

Public visitors can:

* View tasks
* View board columns
* View task priorities

Public visitors cannot:

* Create tasks
* Move tasks
* Modify boards
* Access workspace data

⸻

Setup Instructions

Clone Repository

git clone https://github.com/Princedubey2004/Frontend-assignment.git
cd Frontend-assignment

Install Dependencies

npm install

Run Development Server

npm run dev

Open:

http://localhost:3000

⸻

Test Credentials

Use any email address with the password below:

Email: test@example.com
Password: password

Example:

Email: prince@example.com
Password: password

On first login, the application seeds default workspace and board data automatically.

⸻

Deployment

The project is deployed on Vercel and requires no external services or environment variables.

Production URL

https://frontend-assignment-two-roan.vercel.app/login

Deployment Steps

git push origin main

Then:

1. Import repository into Vercel.
2. Select Next.js framework preset.
3. Deploy.

No database setup is required.

⸻

Future Improvements

* Real backend integration
* Multi-user collaboration
* Real-time updates using WebSockets
* User invitations and role management
* File attachments
* Task comments
* Due dates and reminders
* Analytics dashboard

⸻

Engineering Notes

Detailed technical decisions, tradeoffs, architecture rationale, and implementation notes can be found in:

ENGINEERING_NOTES.md

⸻

Author

Prince Dubey

B.Tech, Electronics & Communication Engineering
IIIT Bhopal

GitHub:
https://github.com/Princedubey2004
