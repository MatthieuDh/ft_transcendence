# Transcendence

Transcendence is a full-stack web application built as a monorepo with a React frontend, a NestJS backend, a PostgreSQL database and an NGINX reverse proxy. The application focuses on project collaboration: users can register, log in, create projects, manage members, create tasks, assign users, comment on tasks, receive notifications and view dashboard/export data.

## Table of contents

- [Project overview](#project-overview)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Main features](#main-features)
- [Database models](#database-models)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [How to run](#how-to-run)
- [Useful URLs](#useful-urls)
- [API overview](#api-overview)
- [Security and permissions](#security-and-permissions)
- [Development notes](#development-notes)

## Project overview

The application is split into three main services:

1. **Frontend**: React + Vite application served on port `5173` inside Docker.
2. **Backend**: NestJS API served on port `3000` inside Docker.
3. **Database**: PostgreSQL database used through Prisma ORM.
4. **NGINX**: reverse proxy exposing the app through HTTP/HTTPS.

NGINX receives the browser request and sends it to the correct service:

- `/` goes to the frontend.
- `/api/` goes to the backend API.
- `/socket.io/` goes to the backend WebSocket gateway.

## Tech stack

### Frontend

- React
- TypeScript
- Vite
- Chakra UI
- Axios
- React Router
- Shared TypeScript types through `@transcendence/shared`

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Google OAuth strategy
- WebSocket notifications with Socket.IO
- Swagger API documentation
- Class validator / class transformer

### Infrastructure

- Docker Compose
- NGINX
- Self-signed SSL certificate
- PostgreSQL persistent volume

## Architecture

```txt
Browser
  |
  | HTTPS :443
  v
NGINX
  |-- /             -> frontend:5173
  |-- /api/         -> backend:3000
  |-- /socket.io/   -> backend:3000/socket.io/

Backend
  |
  | Prisma
  v
PostgreSQL
```

The frontend never talks directly to the database. It calls the backend API. The backend validates the request, checks permissions, uses Prisma to read/write data and returns JSON to the frontend.

## Main features

### Authentication

- User registration
- User login
- JWT-based protected routes
- Google OAuth strategy present in the backend
- Role-based authorization for admin-only routes

### Users

- Create users
- Update users
- Retrieve user data
- Avatar/profile support

### Projects

- Create projects
- Add members to projects
- Assign project roles:
  - `GUEST`
  - `MEMBER`
  - `PROJECT_LEADER`
- Update projects
- Delete projects
- Store project messages
- Real-time project message notification through WebSocket gateway

### Tasks

- Create tasks inside projects
- Assign users to tasks
- Update task status
- Track task status history
- Delete tasks
- Notify users when they are assigned to a task
- Notify project leaders when a task is pending evaluation

Task statuses:

- `TODO`
- `IN_PROGRESS`
- `PENDING_EVALUATION`
- `DONE`

### Comments

- Add comments to tasks
- Support attachments
- Support replies through parent/child comments

### Friends

- Send friend requests
- Accept/reject friend requests
- Track friendship status:
  - `PENDING`
  - `ACCEPTED`
  - `REJECTED`

### Notifications

- Store notifications in the database
- Mark/read notification flow
- Real-time delivery through WebSocket gateway

### Dashboard and export

- Dashboard module for overview/statistics
- Export module for exporting project/task-related data

## Database models

The Prisma schema contains these main models:

### `User`

Represents an application user.

Important fields:

- `id`
- `username`
- `email`
- `password`
- `googleId`
- `globalRole`
- `avatar`
- project memberships
- assigned tasks
- notifications
- messages
- comments

### `Project`

Represents a collaboration project.

Important fields:

- `id`
- `name`
- `description`
- `deadline`
- `status`
- `members`
- `tasks`
- `messages`

### `ProjectMember`

Join table between users and projects.

Important fields:

- `userId`
- `projectId`
- `role`

This model controls project-level permissions.

### `Task`

Represents a task inside a project.

Important fields:

- `title`
- `description`
- `status`
- `deadline`
- `projectId`
- `assignees`
- `comments`
- `statusHistory`

### `TaskStatusHistory`

Stores every status change of a task.

Important fields:

- `taskId`
- `status`
- `changedAt`
- `changedBy`

### `Notification`

Stores notifications for users.

Important fields:

- `userId`
- `type`
- `message`
- `isRead`
- `createdAt`

### `Friendship`

Stores friend request relations between users.

Important fields:

- `requesterId`
- `addresseeId`
- `status`

### `Comment`

Stores comments and replies on tasks.

Important fields:

- `content`
- `attachments`
- `userId`
- `taskId`
- `parentId`

### `Message`

Stores project chat messages.

Important fields:

- `content`
- `Time`
- `userId`
- `projectId`

## Project structure

```txt
.
├── docker-compose.yml
├── Makefile
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
├── shared/
│   └── srcs/types/
├── srcs/
│   ├── backend/
│   │   ├── Dockerfile
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── src/
│   │       ├── auth/
│   │       ├── comments/
│   │       ├── dashboard/
│   │       ├── export/
│   │       ├── friends/
│   │       ├── notifications/
│   │       ├── prisma/
│   │       ├── projects/
│   │       ├── tasks/
│   │       ├── users/
│   │       ├── app.module.ts
│   │       └── main.ts
│   └── frontend/
│       ├── Dockerfile
│       └── src/
│           ├── api/
│           ├── components/
│           ├── hooks/
│           └── pages/
```

## Environment variables

Create a `.env` file at the project root.

Example:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=transcendence

DATABASE_URL=postgresql://postgres:postgres@postgres:5432/transcendence

JWT_SECRET=change_this_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://localhost/api/auth/google/callback

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

For local development without Google OAuth or SMTP, the application may still start, but routes that depend on those services will not work correctly unless valid values are provided.

## How to run

### 1. Build and start all containers

```bash
docker compose up --build
```

This starts:

- PostgreSQL
- Backend
- Frontend
- NGINX

### 2. Run in detached mode

```bash
docker compose up --build -d
```

### 3. Stop containers

```bash
docker compose down
```

### 4. Stop and remove database volume

Use this only when you want to delete all database data.

```bash
docker compose down -v
```

### 5. View logs

```bash
docker compose logs -f
```

Backend only:

```bash
docker compose logs -f backend
```

Database only:

```bash
docker compose logs -f postgres
```

## Useful URLs

When running through Docker Compose:

- Frontend: `https://localhost`
- Backend through NGINX: `https://localhost/api/`
- Swagger API docs: `https://localhost/api/api`
- WebSocket route: `https://localhost/socket.io/`

Because the NGINX container uses a self-signed certificate, the browser will show a security warning. For local development, this is expected.

## API overview

The backend is organized by NestJS modules.

### Auth module

Responsible for registration, login, JWT generation and OAuth strategy.

Common routes:

```txt
POST /auth/register
POST /auth/login
GET  /auth/google
GET  /auth/google/callback
```

### Users module

Responsible for user profile and user management.

```txt
GET    /users
GET    /users/:id
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

### Projects module

Responsible for project creation, members, project messages and project management.

```txt
POST   /projects
GET    /projects
GET    /projects/:id
PATCH  /projects/:id
DELETE /projects/:id
POST   /projects/:id/members
POST   /projects/:id/messages
GET    /projects/:id/messages
```

### Tasks module

Responsible for task creation, assignment, updates and task history.

```txt
POST   /tasks
GET    /tasks/me
GET    /tasks/all
GET    /tasks/:id
PATCH  /tasks/:id
DELETE /tasks/:id
```

### Friends module

Responsible for friend requests and friendship state.

```txt
POST  /friends/request
PATCH /friends/:id/accept
PATCH /friends/:id/reject
GET   /friends
```

### Comments module

Responsible for task comments, replies and attachments.

```txt
POST /comments
GET  /comments/task/:taskId
```

### Notifications module

Responsible for stored notifications and read/unread state.

```txt
GET   /notifications
PATCH /notifications/:id/read
```

### Dashboard module

Responsible for dashboard data and filtering.

```txt
GET /dashboard
```

## Security and permissions

### JWT authentication

Protected routes use `JwtAuthGuard`. The frontend sends a JWT token in the Authorization header:

```txt
Authorization: Bearer <token>
```

The backend validates the token through `JwtStrategy` and adds the authenticated user to `request.user`.

### Global roles

The database has a global role enum:

```txt
USER
ADMIN
```

Admin-only routes use `RolesGuard` and the `@Roles()` decorator.

### Project roles

Projects have their own role system:

```txt
GUEST
MEMBER
PROJECT_LEADER
```

Project leader actions are protected by `ProjectLeaderGuard`. This guard checks whether the logged-in user is a member of the project with role `PROJECT_LEADER`.

## Development notes

### Prisma

Prisma schema:

```txt
srcs/backend/prisma/schema.prisma
```

Generate Prisma client:

```bash
cd srcs/backend
npx prisma generate
```

Run migrations in development:

```bash
cd srcs/backend
npx prisma migrate dev
```

Apply migrations in Docker/production-like mode:

```bash
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

### Backend development

```bash
cd srcs/backend
npm install
npm run start:dev
```

### Frontend development

```bash
cd srcs/frontend
npm install
npm run dev
```

### Shared types

The `shared` package contains TypeScript interfaces/types used by both frontend and backend. This avoids duplicating models such as users, tasks, projects, notifications and dashboard types.

## Evaluation explanation

In simple terms, this project works like this:

1. The user opens the web app in the browser.
2. NGINX receives the request through HTTPS.
3. NGINX serves the React frontend.
4. When the frontend needs data, it calls the NestJS backend through `/api/`.
5. The backend checks authentication and permissions.
6. The backend uses Prisma to communicate with PostgreSQL.
7. PostgreSQL stores users, projects, tasks, comments, messages and notifications.
8. For real-time notifications/messages, the backend uses a WebSocket gateway.
9. Docker Compose starts all services together.
10. The database data is kept in a Docker volume, so it survives container restarts.

## Known improvement points

- Add a committed `.env.example` file so evaluators know exactly which variables are required.
- Remove generated/local files from the repository, such as `.DS_Store`, uploaded test files and unnecessary local artifacts.
- Make sure every protected route consistently returns the correct user role field expected by guards.
- Make sure update methods return the updated object where the frontend expects a response.
- Add more clear tests for guards, permissions and project membership edge cases.
