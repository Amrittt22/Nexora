
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
  const task = await canAccessTask(taskId, userId)

  if (!task) {
    return null
  }

  return prisma.comment.create({
    data: {
      content: input.content,
      taskId,
      authorId: userId,
    },
    select: commentFields,
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
