# Nexora — Development Roadmap

## Project Overview

Nexora is a full-stack collaboration and project management platform designed to help modern teams manage workspaces, projects, tasks, assignments, discussions, and team collaboration.

The goal is to build a production-quality application with strong backend architecture, proper authorization, scalable services, and a polished user experience.

---

# 1. Completed Features

The following features have been implemented.

## 1.1 Authentication and User Management

- Supabase email authentication.
- User registration and login.
- Password recovery and reset.
- Session management.
- Sign-out functionality.
- Server-side Supabase bearer-token verification.
- Prisma user synchronization.
- Authenticated user endpoint (`/api/v1/auth/me`).
- User display name integration.

## 1.2 Workspace Management

- Create workspaces.
- Fetch user workspaces.
- Workspace membership management.
- Workspace roles:
  - OWNER
  - ADMIN
  - MEMBER
- Role-based access control.
- Cross-workspace resource isolation.

## 1.3 Workspace Invitations

- Invite users through email.
- Invitation expiry.
- Accept invitations.
- Resend invitations.
- Revoke invitations.
- Invitation status management.
- Role-based invitation restrictions.

## 1.4 Project Management

- Create projects.
- Fetch workspace projects.
- Project-scoped task management.

## 1.5 Task Management

- Create tasks.
- Update task details.
- Delete tasks.
- Task status management:
  - TODO
  - IN_PROGRESS
  - DONE
- Priority management:
  - LOW
  - MEDIUM
  - HIGH
- Due dates.
- Task labels.
- Task assignments.
- Workspace member assignment.

## 1.6 Task Activity History

- Persistent task activity records.
- Task creation events.
- Task update events.
- Status change events.
- Label change events.
- Assignee change events.
- Task deletion events.
- Activity timeline in the frontend.
- Activity history API.
- Workspace authorization for activity access.

## 1.7 Task Comments

**Status: COMPLETED**

Backend:
- Comment database model.
- Prisma migration.
- Fetch task comments.
- Create comments.
- Update comments.
- Delete comments.
- Comment ownership verification.
- Workspace membership authorization.
- Input validation.
- Nine integration tests.

Frontend:
- Task Comments component.
- Display comment author and timestamps.
- Add comments.
- Edit own comments.
- Delete own comments.
- Loading, error, and empty states.
- Comments tab integrated into the Edit Task modal.

Verification:
- Backend integration tests passed.
- Frontend production build passed.
- Browser functionality verified.
- Changes committed and pushed to GitHub.

---

# 2. Current Development Milestone

## 2.1 Notifications System

**Status: NEXT TO IMPLEMENT**

The notification system will help workspace members stay informed about relevant activity.

Planned functionality:

### Backend

- Design notification database model.
- Create notification Prisma migration.
- Implement notification service.
- Create notification APIs.
- Fetch user notifications.
- Mark individual notifications as read.
- Mark all notifications as read.
- Track unread notification count.
- Enforce user-level notification access.

### Notification Triggers

Generate notifications for relevant events:

- Task assignment.
- Being mentioned in a comment.
- Relevant task updates.
- Other important collaboration events.

### Frontend

- Notification bell icon.
- Unread notification badge.
- Notification dropdown.
- Notification list.
- Read/unread indicators.
- Mark as read functionality.
- Mark all as read.
- Navigate to the relevant task when a notification is selected.

---

# 3. Upcoming Features

## 3.1 Real-Time Collaboration

- Real-time task updates.
- Live workspace changes.
- Real-time comment updates.
- Synchronization between multiple users.
- Live notification updates.

## 3.2 Advanced Search and Filtering

- Search tasks.
- Filter by status.
- Filter by priority.
- Filter by assignee.
- Filter by labels.
- Filter by due date.
- Combine multiple filters.
- Improve task discovery.

## 3.3 Dashboard Improvements

- Workspace overview.
- Total task statistics.
- Completed and pending tasks.
- Task distribution by status.
- Priority distribution.
- Overdue task tracking.
- Personal task overview.

## 3.4 Sprint Management

- Create sprints.
- Set sprint start and end dates.
- Add tasks to sprints.
- Remove tasks from sprints.
- Track sprint progress.
- Sprint completion statistics.
- Basic sprint planning workflow.

## 3.5 GitHub Integration

Integrate GitHub to connect software development activity with Nexora.

Planned functionality:

- GitHub OAuth integration.
- Connect GitHub repositories.
- Associate repositories with Nexora projects.
- Display linked repositories.
- Pull request information.
- Pull request status tracking.
- Associate pull requests with tasks.
- Display relevant GitHub activity.

## 3.6 Backend Infrastructure Improvements

### Redis

- Introduce Redis.
- Configure Redis connection.
- Implement caching where useful.
- Cache frequently accessed data.
- Manage cache invalidation.

### BullMQ

- Configure BullMQ.
- Implement background job processing.
- Process asynchronous tasks.
- Handle retries and failed jobs.
- Manage job execution.

### Performance and Security

- API rate limiting.
- Request validation improvements.
- Error handling improvements.
- Database query optimization.
- Performance monitoring.
- Security hardening.

---

# 4. UI/UX Improvements

- Improve overall application consistency.
- Refine workspace navigation.
- Improve task modal design.
- Polish task cards and board layouts.
- Improve notification interface.
- Responsive layouts for different screen sizes.
- Consistent loading and error states.
- Empty-state improvements.
- Accessibility improvements.
- Final light and dark theme polishing.

---

# 5. Testing and Quality Assurance

Continue improving application reliability throughout development.

- Unit testing.
- API integration testing.
- Authentication testing.
- RBAC testing.
- Cross-workspace isolation testing.
- Comment authorization testing.
- Notification testing.
- Error handling tests.
- Frontend build verification.
- Regression testing.

All integration tests must use the isolated local PostgreSQL database named `devflow_test`.

Never run test migrations against the production or development database.

---

# 6. Deployment and Production Readiness

- Finalize environment configurations.
- Prepare production database.
- Configure production Supabase settings.
- Deploy backend API.
- Deploy frontend application.
- Configure frontend and backend URLs.
- Configure CORS.
- Verify authentication redirects.
- Verify database migrations.
- Test production APIs.
- Perform end-to-end testing.
- Finalize documentation.

Docker and deployment infrastructure decisions will be made during the production preparation phase.

---

# 7. Development Priority

The planned implementation order is:

| Priority | Feature | Status |
|---|---|---|
| 1 | Authentication and User Management | COMPLETED |
| 2 | Workspace Management and RBAC | COMPLETED |
| 3 | Workspace Invitations | COMPLETED |
| 4 | Project and Task Management | COMPLETED |
| 5 | Task Activity History | COMPLETED |
| 6 | Task Comments | COMPLETED |
| 7 | Notifications | NEXT |
| 8 | Real-Time Collaboration | PLANNED |
| 9 | Advanced Search and Dashboard | PLANNED |
| 10 | Sprint Management | PLANNED |
| 11 | GitHub Integration | PLANNED |
| 12 | Redis and BullMQ | PLANNED |
| 13 | Performance and Security Improvements | PLANNED |
| 14 | UI/UX Polish | PLANNED |
| 15 | Testing and Production Deployment | PLANNED |

---

# 8. Development Guidelines

The following principles will guide implementation:

1. Build backend functionality before integrating its frontend.
2. Implement one feature at a time.
3. Use TypeScript throughout the application.
4. Keep business logic inside service layers.
5. Validate incoming API requests using Zod.
6. Enforce authorization on the backend.
7. Write unit and integration tests for important functionality.
8. Maintain workspace-level data isolation.
9. Avoid exposing secrets in frontend code.
10. Verify builds and tests before committing changes.
11. Update documentation whenever major features are completed.
12. Keep commits focused and descriptive.

---

# 9. Project Scope

Nexora is focused on full-stack project management, collaboration, backend engineering, and software development workflow integration.

AI-powered functionality is intentionally outside the current Nexora scope and is reserved for a separate future project.

---

# 10. Current Project Status

**Completed:** Authentication, workspace management, RBAC, invitations, projects, tasks, activity history, and comments.

**Next milestone:** Notifications System.

**Remaining focus:** Real-time collaboration, advanced project management, GitHub integration, backend infrastructure, UI refinement, and production deployment.

The objective is to deliver a reliable, polished, production-ready collaboration platform rather than simply maximize the number of features.
