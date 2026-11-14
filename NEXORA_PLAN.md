# Nexora — Product Roadmap

## 1. Product Overview

Nexora is a full-stack project management and team collaboration platform designed to help software teams organize work, manage projects, collaborate with teammates, and track progress.

The platform provides workspace-based collaboration with task management, role-based access control, comments, activity history, and in-app notifications.

## 2. Current Project Status

**Core collaboration foundation: Completed**

### Completed Features

- [x] Supabase authentication: sign up, sign in, sign out, and password recovery.
- [x] Protected Express API with server-side Supabase token verification.
- [x] Workspace creation, listing, and membership management foundations.
- [x] Workspace roles: OWNER, ADMIN, and MEMBER.
- [x] Project creation and management.
- [x] Task creation, editing, deletion, and status management.
- [x] Task priorities and due dates.
- [x] Board, List, Calendar, and Overview views.
- [x] Task search and filtering.
- [x] Workspace labels with custom colors.
- [x] Task assignment to workspace members.
- [x] Workspace invitations with email delivery and acceptance.
- [x] Invitation listing, resend, and revocation.
- [x] Role-based authorization for workspace operations and invitations.
- [x] Task activity history.
- [x] Task comments with author-based editing and deletion permissions.
- [x] Database-backed in-app notifications.
- [x] Task assignment, comment, and task update notification triggers.
- [x] Notification unread count and read/unread management.
- [x] Notification dropdown integrated into the application header.
- [x] Backend unit and integration tests for implemented functionality.
- [x] Frontend and backend production builds verified.

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (Supabase) |
| Authentication | Supabase Auth |
| ORM | Prisma 7 with PostgreSQL driver adapter |
| Validation | Zod |
| Caching / Performance | Redis |
| Testing | Vitest, Supertest |
| Version Control | Git, GitHub |

## 4. Development Roadmap

### Phase 1 — Core Project Management

**Status: Completed**

- [x] Workspace and project management.
- [x] Task CRUD operations.
- [x] Board, List, Calendar, and Overview views.
- [x] Task search and filters.
- [x] Task labels and assignments.
- [x] Priorities and due dates.
- [x] Persistent application selections.

### Phase 2 — Team Collaboration

**Status: Core features completed**

- [x] Workspace invitations and acceptance.
- [x] Workspace role-based access control.
- [x] Invitation listing, resend, and revocation.
- [x] Task comments.
- [x] Task activity history.
- [x] Database-backed notifications.
- [x] Assignment notifications.
- [x] Comment notifications.
- [x] Task update notifications.
- [x] Notification read/unread management.

Remaining improvements:

- [ ] Dedicated workspace member management screen.
- [ ] Safe role changes for existing members.
- [ ] Member removal with appropriate ownership safeguards.
- [ ] Real-time task, comment, and notification updates.

### Phase 3 — Reliability and Product Quality

**Status: In progress**

- [ ] Improve API error handling and response consistency.
- [ ] Add server-side task sorting and pagination where needed.
- [ ] Improve keyboard navigation and accessibility.
- [ ] Improve mobile and responsive layouts.
- [ ] Fix Day Mode contrast issues across cards, buttons, modals, dropdowns, text, borders, and icons.
- [ ] Improve loading, empty, and error states.
- [ ] Review authorization and edge cases across all modules.
- [ ] Add end-to-end browser tests for important user journeys.

### Phase 4 — Advanced Project Planning

**Status: Planned**

- [ ] Build a Timeline view.
- [ ] Introduce sprint creation and management.
- [ ] Add start and end dates for sprints.
- [ ] Assign tasks to sprints.
- [ ] Display sprint progress and completion metrics.
- [ ] Improve project overview and analytics.

### Phase 5 — Issue Tracking

**Status: Planned**

- [ ] Introduce issues as a separate entity from tasks.
- [ ] Support issue title, description, status, and priority.
- [ ] Support issue labels, reporters, and assignees.
- [ ] Add issue comments and activity history.
- [ ] Link related issues and tasks.

### Phase 6 — Performance and Infrastructure

**Status: Planned**

- [ ] Add Redis-based caching where useful.
- [ ] Implement API rate limiting.
- [ ] Introduce background jobs where asynchronous processing is needed.
- [ ] Add Dockerfiles for frontend and backend.
- [ ] Add Docker Compose for local development.
- [ ] Set up GitHub Actions for automated builds and tests.
- [ ] Improve logging, monitoring, and health checks.
- [ ] Deploy frontend and backend.
- [ ] Document production environment configuration and database migrations.

### Phase 7 — GitHub Integration

**Status: Planned**

- [ ] Connect workspaces or projects to GitHub repositories.
- [ ] Link tasks and issues to pull requests.
- [ ] Display branch, author, review status, and checks.
- [ ] Receive and verify GitHub webhooks.
- [ ] Record relevant GitHub events in activity history.

### Phase 8 — AI-Powered Features

**Status: Future scope**

- [ ] AI-powered task suggestions.
- [ ] Break down large tasks into smaller subtasks.
- [ ] Generate issue descriptions.
- [ ] Summarize project activity.
- [ ] Generate pull request summaries.
- [ ] Assist with release notes and project documentation.

## 5. Engineering Principles

- Every workspace-scoped operation must verify membership and permissions on the backend.
- Never expose Supabase secrets or database credentials to the frontend.
- Use Prisma migrations for database schema changes.
- Keep business logic organized into feature-based backend modules.
- Use database transactions for operations that must succeed or fail together.
- Validate API input using Zod.
- Write automated tests for important service rules and authorization behavior.
- Run backend tests and frontend/backend production builds after significant changes.
- Update documentation whenever functionality or setup instructions change.

## 6. Current Development Priority

The next development focus is **Reliability and Product Quality**, followed by advanced project planning.

The core collaboration foundation is in place. Future work should improve the existing product before adding large integrations or AI features.