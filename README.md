# DevFlow

DevFlow is a full-stack collaboration platform for software teams to organize workspaces, projects, tasks, assignments, labels, invitations, task activity history, and team discussions.

## Current Features

- Supabase email authentication, password recovery, sessions, and sign-out.
- Server-side Supabase bearer-token verification.
- Prisma user synchronization, including display names and `/api/v1/auth/me`.
- Workspace creation and membership management.
- Workspace invitations with expiry, acceptance, resend, and revocation.
- Workspace roles: `OWNER`, `ADMIN`, and `MEMBER`.
- Projects and project-scoped tasks.
- Task status, priority, due dates, labels, and member assignments.
- Task activity history for creation, edits, status changes, labels, assignments, and deletion.
- Frontend task activity timeline.
- Task comments with create, edit, delete, and comment author information.
- Comment ownership enforcement: users can edit and delete their own comments.
- Workspace membership verification for task comment access.
- Responsive light and dark themes.
- Backend RBAC and cross-workspace resource isolation.
- Vitest and Supertest authenticated API integration tests.

## Roles and Permissions

| Role | Permissions |
|---|---|
| `OWNER` | Full workspace administration, member role changes, member removal, and administrator invitations |
| `ADMIN` | Workspace member administration and member invitations; cannot change owner/admin roles or invite administrators |
| `MEMBER` | Access workspace resources and collaborate on projects and tasks; cannot administer membership or invitations |

Authorization is enforced by the backend. Frontend role checks only control visibility and interaction states.

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript, REST API |
| Authentication | Supabase Auth |
| Database | PostgreSQL |
| ORM | Prisma 7 with the PostgreSQL driver adapter |
| Validation | Zod |
| Testing | Vitest and Supertest |

## Repository Structure

```text
frontend/       React application
backend/        Express API, Prisma schema, services, routes, and tests
docs/           Architecture and product documentation
plan.md         Project roadmap
```

## Prerequisites

- Node.js and npm
- A Supabase project with Email authentication enabled
- A PostgreSQL connection for the backend
- A separate local PostgreSQL database named `devflow_test` for integration tests

## Supabase Setup

1. Create a Supabase project.
2. Enable Email authentication.
3. Add `http://localhost:5173/**` to the allowed redirect URLs.
4. Configure the password recovery and invitation redirects:
   - `http://localhost:5173/reset-password`
   - `http://localhost:5173/invite`
5. Obtain the project URL, publishable key, and backend database connection string.

## Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="your-backend-postgresql-connection-string"
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
SUPABASE_SECRET_KEY="your-server-only-supabase-secret-key"
FRONTEND_URL="http://localhost:5173"
PORT=4000
```

Create `backend/.env.test` for the isolated local test database:

```env
TEST_DATABASE_URL="postgresql://postgres:<local-password>@localhost:5432/devflow_test"
```

The test configuration refuses to run unless `TEST_DATABASE_URL` uses `localhost` or `127.0.0.1` and the database name is exactly `devflow_test`.

Never commit either environment file or any Supabase secret.

Create `frontend/.env`:

```env
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
VITE_API_URL="http://localhost:4000"
```

Only publishable values belong in frontend environment variables.

## Run Locally

From the repository root, install dependencies:

```powershell
Set-Location .\backend
npm install

Set-Location ..\frontend
npm install
```

Run the backend:

```powershell
Set-Location .\backend
npm run prisma7:generate
npx prisma7 migrate deploy
npm run dev
```

The API runs at `http://localhost:4000`.

Run the frontend in a second terminal:

```powershell
Set-Location .\frontend
npm run dev
```

The frontend normally runs at `http://localhost:5173`.

## Prisma Commands

Use the existing Prisma 7 configuration for the normal backend database:

```powershell
Set-Location .\backend
npm run prisma7:generate
npx prisma7 migrate deploy
```

Use the guarded test configuration only for the local test database:

```powershell
Set-Location .\backend
npm run prisma7:test:migrate
```

Never use the test migration configuration against the development or production database.

## API Endpoints

Protected endpoints require a valid Supabase bearer token:

```http
Authorization: Bearer <access-token>
```

Authentication and authorization are enforced on the backend.

### Health and Authentication

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/api/v1/health` | Check API health | Public |
| GET | `/api/v1/auth/me` | Get the authenticated user | Authenticated |

### Workspaces, Members, Invitations, and Projects

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/workspaces` | List the signed-in user's workspaces |
| POST | `/api/v1/workspaces` | Create a workspace |
| GET | `/api/v1/workspaces/:workspaceId/members` | List workspace members |
| PATCH | `/api/v1/workspaces/:workspaceId/members/:userId` | Change a member role |
| DELETE | `/api/v1/workspaces/:workspaceId/members/:userId` | Remove a member |
| GET | `/api/v1/workspaces/:workspaceId/invites` | List invitations |
| POST | `/api/v1/workspaces/:workspaceId/invites` | Create an invitation |
| DELETE | `/api/v1/workspaces/:workspaceId/invites/:inviteId` | Revoke an invitation |
| POST | `/api/v1/workspaces/invites/:inviteId/accept` | Accept an invitation |
| GET | `/api/v1/workspaces/:workspaceId/projects` | List workspace projects |
| POST | `/api/v1/workspaces/:workspaceId/projects` | Create a project |

### Tasks and Task Resources

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/projects/:projectId/tasks` | List project tasks |
| POST | `/api/v1/projects/:projectId/tasks` | Create a task |
| PATCH | `/api/v1/tasks/:taskId` | Update task details |
| DELETE | `/api/v1/tasks/:taskId` | Delete a task |
| PUT | `/api/v1/tasks/:taskId/labels` | Replace task labels |
| PUT | `/api/v1/tasks/:taskId/assignees` | Replace task assignees |
| GET | `/api/v1/tasks/:taskId/activity` | Read task activity history |
| GET | `/api/v1/tasks/:taskId/comments` | List task comments |
| POST | `/api/v1/tasks/:taskId/comments` | Create a task comment |
| PATCH | `/api/v1/comments/:commentId` | Update a comment |
| DELETE | `/api/v1/comments/:commentId` | Delete a comment |
| GET | `/api/v1/workspaces/:workspaceId/labels` | List workspace labels |
| POST | `/api/v1/workspaces/:workspaceId/labels` | Create a workspace label |

### Task Activity History

Activity records are persisted through Prisma and include the event type, actor, details, and timestamp.

Supported events include:

- Task creation
- Task updates
- Status changes
- Label changes
- Assignee changes
- Task deletion

The activity endpoint returns up to the 100 most recent records for an authorized task:

```http
GET /api/v1/tasks/:taskId/activity
Authorization: Bearer <access-token>
```

### Task Comments

DevFlow supports task-level discussions through its comment system.

Users can:

- View comments associated with a task.
- Create new comments.
- Edit their own comments.
- Delete their own comments.
- View comment author information and timestamps.

Comment content is trimmed, must not be empty, and has a maximum length of 5,000 characters.

The backend verifies workspace membership before allowing access to task comments. Editing and deleting comments additionally require comment ownership.

Example:

```http
GET /api/v1/tasks/:taskId/comments
Authorization: Bearer <access-token>
```

Create a comment:

```http
POST /api/v1/tasks/:taskId/comments
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "content": "This task is ready for review."
}
```

Update a comment:

```http
PATCH /api/v1/comments/:commentId
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "content": "Updated comment content."
}
```

Delete a comment:

```http
DELETE /api/v1/comments/:commentId
Authorization: Bearer <access-token>
```

## Testing

Integration tests use the exported Express app directly; they never start the production HTTP server.

Supabase token verification is mocked only at `supabase.auth.getUser`. Prisma, services, authorization checks, and routes remain real.

The test database must be isolated and configured in `backend/.env.test`.

Fixtures create owner, admin, member, and non-member users across two workspaces, then clean up generated records after the suite.

Run the tests from `backend`:

```powershell
Set-Location .\backend
npm run test:unit
npm run test:integration
npm test
npm run build
```

The integration tests cover:

- Authentication failures and verified identity.
- Workspace RBAC and invitation role escalation.
- Membership protection.
- Project and task isolation.
- Labels and assignments.
- Task activity history and isolation.
- Task comment creation, retrieval, editing, deletion, and authorization.

The Task Comments integration suite contains nine tests.

## Roadmap

Upcoming development:

1. Notifications system.
2. Real-time collaboration.
3. Advanced search, filtering, and dashboard improvements.
4. Sprint management.
5. GitHub integration and pull request insights.
6. Redis and BullMQ background jobs.
7. Rate limiting and performance improvements.
8. UI polishing and responsive design improvements.
9. Production deployment and final testing.

## Project Status

DevFlow is actively under development. Authentication, workspace management, project and task management, task activity history, and task comments have been implemented.

Notifications are the next planned development milestone.
