
import { apiRequest } from '../lib/api'

export type CommentAuthor = {
  id: string
  email: string | null
  displayName: string | null
}

export type TaskComment = {
  id: string
  content: string
  taskId: string
  authorId: string
  createdAt: string
  updatedAt: string
  author: CommentAuthor
}

type CommentsResponse = {
  comments: TaskComment[]
}

type CommentResponse = {
  comment: TaskComment
}

type DeleteCommentResponse = {
  message: string
}

export async function fetchTaskComments(
  taskId: string,
): Promise<TaskComment[]> {
  const result = await apiRequest<CommentsResponse>(
    `/api/v1/tasks/${taskId}/comments`,
  )

  return result.comments
}

export async function createTaskComment(
  taskId: string,
  content: string,
): Promise<TaskComment> {
  const result = await apiRequest<CommentResponse>(
    `/api/v1/tasks/${taskId}/comments`,
    {
      method: 'POST',
      body: JSON.stringify({ content }),
    },
  )

  return result.comment
}

export async function updateTaskComment(
  commentId: string,
  content: string,
): Promise<TaskComment> {
  const result = await apiRequest<CommentResponse>(
    `/api/v1/comments/${commentId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    },
  )

  return result.comment
}

export async function deleteTaskComment(
  commentId: string,
): Promise<string> {
  const result = await apiRequest<DeleteCommentResponse>(
    `/api/v1/comments/${commentId}`,
    {
      method: 'DELETE',
    },
  )

  return result.message
}
