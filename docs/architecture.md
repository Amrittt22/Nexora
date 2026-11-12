# Nexora Architecture

Nexora follows a full-stack architecture with a React frontend and an Express backend connected to PostgreSQL through Prisma.

Frontend files live in `frontend/` and API/database files live in `backend/`.

## Frontend

The frontend is built using React, TypeScript, Vite, and Tailwind CSS.

### Directory Structure

- `src/app/` — application shell, routing, global providers, and application types.
- `src/components/` — reusable interface components.
- `src/components/modals/` — workspace, project, task, and invitation modals.
- `src/components/tasks/` — task-related UI components, including activity history and comments.
- `src/components/workspaces/` — workspace-related interface components.
- `src/features/` — screens and logic grouped by product feature, including authentication.
- `src/hooks/` — shared React hooks for managing application data and interactions.
- `src/services/` — API clients and request functions.
- `src/lib/` — shared libraries and integrations, including Supabase and the authenticated API request helper.
- `src/types/` — shared frontend types.
- `src/utils/` — small reusable helpers.

### Frontend Data Flow

The frontend uses React components and custom hooks to manage application state and communicate with backend services.

Typical request flow:

`React Component → Custom Hook → Service Function → API Client → Express API`

The API client retrieves the current Supabase access token and attaches it to protected backend requests.

### Task Collaboration Components

The task interface currently includes:

- `TaskActivityTimeline.tsx` — displays task activity history.
- `TaskComments.tsx` — displays, creates, edits, and deletes task comments.
- `TaskModals.tsx` — integrates task details, activity history, and comments into the task editing interface.

## Backend

The backend is built using Node.js, Express, TypeScript, Prisma 7, and PostgreSQL.

### Directory Structure

- `src/modules/` — feature modules containing business logic, schemas, and services.
- `src/modules/tasks/` — task-related functionality, including comment validation and comment services.
- `src/routes/` — API route registration.
- `src/middleware/` — authentication, authorization, and error handling.
- `src/config/` — environment and service configuration.
- `src/test/` — unit and integration tests.
- `src/test/integration/` — authenticated API integration tests.
- `prisma/` — Prisma schema and database migrations.

### Backend Data Flow

Keep API request flow understandable:

`Request → Route → Middleware → Controller/Service → Prisma → PostgreSQL`

Authentication middleware verifies Supabase bearer tokens before protected routes execute.

Services handle business logic and authorization checks. Prisma manages database operations.

### Task Collaboration Modules

The backend currently supports:

**Task Activity History**
- Records task creation, updates, status changes, label changes, assignment changes, and deletion.
- Provides an API to retrieve task activity history.

**Task Comments**
- Provides comment creation, retrieval, editing, and deletion.
- Validates comment content.
- Checks workspace membership before granting access.
- Restricts comment editing and deletion to the comment author.

## Database and Authentication

### Database

- PostgreSQL is the primary database.
- Prisma 7 is used as the ORM.
- Database models and relationships are defined in `prisma/schema.prisma`.
- Schema changes are tracked through Prisma migrations.

### Authentication

Supabase Auth handles user authentication.

The Express backend verifies Supabase access tokens and synchronizes authenticated users with the PostgreSQL database through Prisma.

### Authorization

Authorization is enforced by the backend.

Workspace roles:

- `OWNER`
- `ADMIN`
- `MEMBER`

Workspace membership and resource ownership are checked before protected operations are allowed.

## Testing Architecture

Nexora uses Vitest and Supertest.

- Unit tests validate isolated business logic.
- Integration tests exercise the Express application.
- Supabase token verification is mocked at the authentication boundary.
- Prisma, services, routes, and authorization logic remain real during integration testing.
- Integration tests use an isolated local PostgreSQL database named `devflow_test`.

## Current Architecture Scope

Implemented architectural areas:

- Authentication and user synchronization.
- Workspace and membership management.
- Role-based authorization.
- Project and task management.
- Task activity history.
- Task comments.
- PostgreSQL persistence through Prisma.
- Backend unit and integration testing.

Upcoming architectural additions:

- Notification services and persistence.
- Real-time collaboration.
- Advanced search and filtering.
- Sprint management.
- GitHub integration.
- Redis and BullMQ background processing.
