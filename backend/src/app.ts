import cors from 'cors'
import express from 'express'
import authRouter from './routes/auth.routes.js'
import healthRouter from './routes/health.routes.js'
import projectRouter from './routes/project.routes.js'
import taskRouter from './routes/task.routes.js'
import workspaceRouter from './routes/workspace.routes.js'
import taskUpdateRouter from './routes/task-update.routes.js'
import labelRouter from './routes/label.routes.js'
import taskActivityRouter from './routes/task-activity.routes.js'
import commentRouter from './routes/comment.routes.js'
import notificationRouter from './routes/notification.routes.js'
import {
  errorHandler,
  notFoundHandler,
} from './middleware/error.middleware.js'
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/workspaces', workspaceRouter)
app.use('/api/v1/workspaces/:workspaceId/projects', projectRouter)
app.use('/api/v1/projects/:projectId/tasks', taskRouter)
app.use('/api/v1/tasks', taskActivityRouter)
app.use('/api/v1/tasks', taskUpdateRouter)
app.use('/api/v1', healthRouter)
app.use('/api/v1/workspaces/:workspaceId/labels', labelRouter)
app.use('/api/v1', commentRouter)
app.use('/api/v1/notifications', notificationRouter)
// Handle requests that do not match any registered route.
app.use(notFoundHandler)

// Centralized error handler must always be registered last.
app.use(errorHandler)

export default app
