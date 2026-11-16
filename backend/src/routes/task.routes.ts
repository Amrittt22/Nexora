import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware.js'
import { createTaskForProject, listTasksForProject } from '../modules/tasks/task.service.js'
import { createTaskSchema } from '../modules/tasks/task.schemas.js'
import { validateBody } from '../middleware/validate.middleware.js'
const taskRouter = Router({ mergeParams: true })

taskRouter.get('/', requireAuth, async (request, response) => {
  const projectId = request.params.projectId
  if (typeof projectId !== 'string') {
    response.status(400).json({ error: 'A valid project ID is required' })
    return
  }

  try {
    const tasks = await listTasksForProject(projectId, response.locals.authUser.id)

    if (!tasks) {
      response.status(403).json({ error: 'You cannot access this project' })
      return
    }

    response.status(200).json({ tasks })
  } catch (error) {
    console.error('Task listing failed:', error)
    response.status(500).json({ error: 'Unable to load tasks' })
  }
})

taskRouter.post('/', requireAuth, validateBody(createTaskSchema), async (request, response) => {
  const projectId = request.params.projectId
  if (typeof projectId !== 'string') {
    response.status(400).json({ error: 'A valid project ID is required' })
    return
  }


  try {
    const task = await createTaskForProject(
      projectId,
      response.locals.authUser.id,
      request.body,
    )

    if (!task) {
      response.status(403).json({ error: 'You cannot access this project' })
      return
    }

    response.status(201).json({ task })
  } catch (error) {
    console.error('Task creation failed:', error)
    response.status(500).json({ error: 'Unable to create task' })
  }
})

export default taskRouter
