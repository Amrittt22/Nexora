
import { useCallback, useEffect, useState } from 'react'
import {
  createTaskComment,
  deleteTaskComment,
  fetchTaskComments,
  updateTaskComment,
  type TaskComment,
} from '../services/comment.service'

export function useCommentData(taskId: string | null) {
  const [comments, setComments] = useState<TaskComment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadComments = useCallback(async () => {
    if (!taskId) {
      setComments([])
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchTaskComments(taskId)
      setComments(result)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load comments',
      )
    } finally {
      setIsLoading(false)
    }
  }, [taskId])

  useEffect(() => {
    void loadComments()
  }, [loadComments])

  const addComment = async (content: string) => {
    if (!taskId) {
      throw new Error('No task selected')
    }

    const comment = await createTaskComment(taskId, content)
    setComments((current) => [...current, comment])

    return comment
  }

  const editComment = async (commentId: string, content: string) => {
    const updatedComment = await updateTaskComment(commentId, content)

    setComments((current) =>
      current.map((comment) =>
        comment.id === commentId ? updatedComment : comment,
      ),
    )

    return updatedComment
  }

  const removeComment = async (commentId: string) => {
    await deleteTaskComment(commentId)

    setComments((current) =>
      current.filter((comment) => comment.id !== commentId),
    )
  }

  return {
    comments,
    isLoading,
    error,
    loadComments,
    addComment,
    editComment,
    removeComment,
  }
}
