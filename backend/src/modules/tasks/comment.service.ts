
import { prisma } from '../../config/prisma.js'
import type {
  CreateCommentInput,
  UpdateCommentInput,
} from './comment.schemas.js'

const commentFields = {
  id: true,
  content: true,
  taskId: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      email: true,
      displayName: true,
    },
  },
} as const

async function canAccessTask(taskId: string, userId: string) {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        workspace: {
          members: {
            some: { userId },
          },
        },
      },
    },
    select: { id: true },
  })
}

export async function listCommentsForTask(
  taskId: string,
  userId: string,
) {
  const task = await canAccessTask(taskId, userId)

  if (!task) {
    return null
  }

  return prisma.comment.findMany({
    where: { taskId },
    orderBy: { createdAt: 'asc' },
    select: commentFields,
  })
}


export async function createComment(
  taskId: string,
  userId: string,
  input: CreateCommentInput,
) {
  return prisma.$transaction(async (transaction) => {
    const task = await transaction.task.findFirst({
      where: {
        id: taskId,
        project: {
          workspace: {
            members: {
              some: { userId },
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        creatorId: true,
        assignees: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (!task) {
      return null
    }

    const comment = await transaction.comment.create({
      data: {
        content: input.content,
        taskId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    })

    const recipients = new Set<string>()

    if (task.creatorId && task.creatorId !== userId) {
      recipients.add(task.creatorId)
    }

    for (const assignee of task.assignees) {
      if (assignee.userId !== userId) {
        recipients.add(assignee.userId)
      }
    }

    if (recipients.size > 0) {
      await transaction.notification.createMany({
        data: Array.from(recipients).map((recipientId) => ({
          type: 'COMMENT_ADDED',
          message: `${comment.author.displayName || comment.author.email} commented on "${task.title}"`,
          recipientId,
          actorId: userId,
          taskId,
        })),
      })
    }

    return comment
  })
}


export async function updateComment(
  commentId: string,
  userId: string,
  input: UpdateCommentInput,
) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: userId,
      task: {
        project: {
          workspace: {
            members: {
              some: { userId },
            },
          },
        },
      },
    },
    select: { id: true },
  })

  if (!comment) {
    return null
  }

  return prisma.comment.update({
    where: { id: commentId },
    data: {
      content: input.content,
    },
    select: commentFields,
  })
}

export async function deleteComment(
  commentId: string,
  userId: string,
) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: userId,
      task: {
        project: {
          workspace: {
            members: {
              some: { userId },
            },
          },
        },
      },
    },
    select: { id: true },
  })

  if (!comment) {
    return false
  }

  await prisma.comment.delete({
    where: { id: commentId },
  })

  return true
}
