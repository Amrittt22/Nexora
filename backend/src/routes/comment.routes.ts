import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware.js'
import {
  createComment,
  deleteComment,
  listCommentsForTask,
  updateComment,
} from '../modules/tasks/comment.service.js'
import {
  createCommentSchema,
  updateCommentSchema,
} from '../modules/tasks/comment.schemas.js'

const commentRouter = Router()

// GET /api/v1/tasks/:taskId/comments
commentRouter.get(
  '/tasks/:taskId/comments',
  requireAuth,
  async (request, response) => {
    const taskId = request.params.taskId

    if (typeof taskId !== 'string') {
      response.status(400).json({ error: 'A valid task ID is required' })
      return
    }

    try {
      const comments = await listCommentsForTask(
        taskId,
        response.locals.authUser.id,
      )

      if (!comments) {
        response.status(403).json({ error: 'You cannot access this task' })
        return
      }

      response.status(200).json({ comments })
    } catch (error) {
      console.error('Comment listing failed:', error)
      response.status(500).json({ error: 'Unable to load comments' })
    }
  },
)

// POST /api/v1/tasks/:taskId/comments
commentRouter.post(
  '/tasks/:taskId/comments',
  requireAuth,
  async (request, response) => {
    const taskId = request.params.taskId

    if (typeof taskId !== 'string') {
      response.status(400).json({ error: 'A valid task ID is required' })
      return
    }

    const result = createCommentSchema.safeParse(request.body)

    if (!result.success) {
      response.status(400).json({
        error: 'Invalid comment data',
        details: result.error.flatten().fieldErrors,
      })
      return
    }

    try {
      const comment = await createComment(
        taskId,
        response.locals.authUser.id,
        result.data,
      )

      if (!comment) {
        response.status(403).json({ error: 'You cannot access this task' })
        return
      }

      response.status(201).json({ comment })
    } catch (error) {
      console.error('Comment creation failed:', error)
      response.status(500).json({ error: 'Unable to create comment' })
    }
  },
)

// PATCH /api/v1/comments/:commentId
commentRouter.patch(
  '/comments/:commentId',
  requireAuth,
  async (request, response) => {
    const commentId = request.params.commentId

    if (typeof commentId !== 'string') {
      response.status(400).json({ error: 'A valid comment ID is required' })
      return
    }

    const result = updateCommentSchema.safeParse(request.body)

    if (!result.success) {
      response.status(400).json({
        error: 'Invalid comment data',
        details: result.error.flatten().fieldErrors,
      })
      return
    }

    try {
      const comment = await updateComment(
        commentId,
        response.locals.authUser.id,
        result.data,
      )

      if (!comment) {
        response.status(404).json({
          error: 'Comment not found or you cannot edit it',
        })
        return
      }

      response.status(200).json({ comment })
    } catch (error) {
      console.error('Comment update failed:', error)
      response.status(500).json({ error: 'Unable to update comment' })
    }
  },
)

// DELETE /api/v1/comments/:commentId
commentRouter.delete(
  '/comments/:commentId',
  requireAuth,
  async (request, response) => {
    const commentId = request.params.commentId

    if (typeof commentId !== 'string') {
      response.status(400).json({ error: 'A valid comment ID is required' })
      return
    }

    try {
      const deleted = await deleteComment(
        commentId,
        response.locals.authUser.id,
      )

      if (!deleted) {
        response.status(404).json({
          error: 'Comment not found or you cannot delete it',
        })
        return
      }

      response.status(200).json({ message: 'Comment deleted successfully' })
    } catch (error) {
      console.error('Comment deletion failed:', error)
      response.status(500).json({ error: 'Unable to delete comment' })
    }
  },
)

export default commentRouter
