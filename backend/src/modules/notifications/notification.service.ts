import { prisma } from '../../config/prisma.js'

export const getNotifications = async (
  userId: string,
  page = 1,
  limit = 20,
) => {
  const skip = (page - 1) * limit

  const [notifications, total] = await prisma.$transaction([
    prisma.notification.findMany({
      where: { recipientId: userId },
      include: {
        actor: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({
      where: { recipientId: userId },
    }),
  ])

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export const getUnreadNotificationCount = async (
  userId: string,
) => {
  return prisma.notification.count({
    where: {
      recipientId: userId,
      isRead: false,
    },
  })
}

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string,
) => {
  const result = await prisma.notification.updateMany({
    where: {
      id: notificationId,
      recipientId: userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  })

  return result.count > 0
}

export const markAllNotificationsAsRead = async (
  userId: string,
) => {
  const result = await prisma.notification.updateMany({
    where: {
      recipientId: userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  })

  return result.count
}
