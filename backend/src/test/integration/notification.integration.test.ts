
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { randomUUID } from 'node:crypto'

// Mock Supabase authentication at the auth boundary.
vi.mock('../../config/supabase.js', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}))

import app from '../../app.js'
import { prisma } from '../../config/prisma.js'
import { supabase } from '../../config/supabase.js'

const userAId = randomUUID()
const userBId = randomUUID()

const userA = {
  id: userAId,
  email: `notification-a-${userAId}@test.local`,
  user_metadata: {},
}

const userB = {
  id: userBId,
  email: `notification-b-${userBId}@test.local`,
  user_metadata: {},
}

const createdNotificationIds: string[] = []

const createNotification = async (
  recipientId: string,
  message: string,
) => {
  const notification = await prisma.notification.create({
    data: {
      type: 'TASK_UPDATED',
      message,
      recipientId,
    },
  })

  createdNotificationIds.push(notification.id)
  return notification
}

const authenticateAs = (user: typeof userA) => {
  vi.mocked(supabase.auth.getUser).mockImplementation(async (token) => {
    if (token === 'user-a-token') {
      return { data: { user: userA }, error: null } as any
    }

    if (token === 'user-b-token') {
      return { data: { user: userB }, error: null } as any
    }

    return { data: { user: null }, error: null } as any
  })
  
  return user.id === userAId ? 'user-a-token' : 'user-b-token'
}

describe('Notification integration tests', () => {
  beforeAll(async () => {
    await prisma.user.createMany({
      data: [
        {
          id: userAId,
          email: userA.email,
        },
        {
          id: userBId,
          email: userB.email,
        },
      ],
    })
  })

beforeEach(async () => {
  vi.clearAllMocks()

  await prisma.notification.deleteMany({
    where: {
      recipientId: {
        in: [userAId, userBId],
      },
    },
  })

  createdNotificationIds.length = 0
})

  afterAll(async () => {
    await prisma.notification.deleteMany({
      where: {
        id: { in: createdNotificationIds },
      },
    })

    await prisma.user.deleteMany({
      where: {
        id: { in: [userAId, userBId] },
      },
    })
  })

  it('returns only notifications belonging to the authenticated user', async () => {
    await createNotification(userAId, 'User A notification')
    await createNotification(userBId, 'User B notification')

    const token = authenticateAs(userA)

    const response = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.notifications).toHaveLength(1)
    expect(response.body.notifications[0].recipientId).toBe(userAId)
  })

  it('returns the correct unread notification count', async () => {
    await createNotification(userAId, 'Unread notification 1')
    await createNotification(userAId, 'Unread notification 2')
    await createNotification(userBId, 'Another user notification')

    const token = authenticateAs(userA)

    const response = await request(app)
      .get('/api/v1/notifications/unread-count')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.count).toBe(2)
  })

  it('marks an individual notification as read', async () => {
    const notification = await createNotification(
      userAId,
      'Notification to mark as read',
    )

    const token = authenticateAs(userA)

    const response = await request(app)
      .patch(`/api/v1/notifications/${notification.id}/read`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)

    const updated = await prisma.notification.findUnique({
      where: { id: notification.id },
    })

    expect(updated?.isRead).toBe(true)
  })

  it('does not allow a user to mark another user notification as read', async () => {
    const notification = await createNotification(
      userAId,
      'Private notification',
    )

    const token = authenticateAs(userB)

    const response = await request(app)
      .patch(`/api/v1/notifications/${notification.id}/read`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)

    const unchanged = await prisma.notification.findUnique({
      where: { id: notification.id },
    })

    expect(unchanged?.isRead).toBe(false)
  })

  it('marks all notifications belonging to the user as read', async () => {
    const first = await createNotification(userAId, 'First notification')
    const second = await createNotification(userAId, 'Second notification')
    const otherUserNotification = await createNotification(
      userBId,
      'Other user notification',
    )

    const token = authenticateAs(userA)

    const response = await request(app)
      .patch('/api/v1/notifications/read-all')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.count).toBe(2)

    const updated = await prisma.notification.findMany({
      where: {
        id: { in: [first.id, second.id, otherUserNotification.id] },
      },
    })

    expect(updated.find((item) => item.id === first.id)?.isRead).toBe(true)
    expect(updated.find((item) => item.id === second.id)?.isRead).toBe(true)
    expect(
      updated.find((item) => item.id === otherUserNotification.id)?.isRead,
    ).toBe(false)
  })

  it('rejects unauthenticated requests', async () => {
    const response = await request(app)
      .get('/api/v1/notifications')

    expect(response.status).toBe(401)
  })
})
