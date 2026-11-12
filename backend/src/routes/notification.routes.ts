
import { Router } from 'express'
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../modules/notifications/notification.service.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const notificationRouter = Router()

notificationRouter.use(requireAuth)

notificationRouter.get('/', async (req, res, next) => {
  try {
    const userId = res.locals.authUser.id

    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))

    const result = await getNotifications(userId, page, limit)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

notificationRouter.get('/unread-count', async (req, res, next) => {
  try {
    const count = await getUnreadNotificationCount(
      res.locals.authUser.id,
    )

    res.status(200).json({ count })
  } catch (error) {
    next(error)
  }
})

notificationRouter.patch('/read-all', async (req, res, next) => {
  try {
    const count = await markAllNotificationsAsRead(
      res.locals.authUser.id,
    )

    res.status(200).json({
      message: 'All notifications marked as read',
      count,
    })
  } catch (error) {
    next(error)
  }
})

notificationRouter.patch('/:id/read', async (req, res, next) => {
  try {
    const updated = await markNotificationAsRead(
      req.params.id,
      res.locals.authUser.id,
    )

    if (!updated) {
      res.status(404).json({ error: 'Notification not found' })
      return
    }

    res.status(200).json({
      message: 'Notification marked as read',
    })
  } catch (error) {
    next(error)
  }
})

export default notificationRouter
