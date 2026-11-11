
import { useState } from 'react'
import { useCommentData } from '../../hooks/useCommentData'
import { useAuth } from '../../features/auth/AuthContext'

type TaskCommentsProps = {
  taskId: string
}

function formatCommentDate(date: string) {
  return new Date(date).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function TaskComments({ taskId }: TaskCommentsProps) {
  const { user } = useAuth()

  const {
    comments,
    isLoading,
    error,
    addComment,
    editComment,
    removeComment,
  } = useCommentData(taskId)

  const [content, setContent] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleAddComment() {
    const trimmedContent = content.trim()

    if (!trimmedContent || isSubmitting) return

    setIsSubmitting(true)
    setActionError(null)

    try {
      await addComment(trimmedContent)
      setContent('')
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Unable to add comment',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleUpdateComment(commentId: string) {
    const trimmedContent = editingContent.trim()

    if (!trimmedContent || isSubmitting) return

    setIsSubmitting(true)
    setActionError(null)

    try {
      await editComment(commentId, trimmedContent)
      setEditingCommentId(null)
      setEditingContent('')
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Unable to update comment',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (isSubmitting) return

    const confirmed = window.confirm('Delete this comment?')

    if (!confirmed) return

    setIsSubmitting(true)
    setActionError(null)

    try {
      await removeComment(commentId)
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Unable to delete comment',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          Comments ({comments.length})
        </h3>
      </div>

      <div className="space-y-3">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a comment..."
          maxLength={5000}
          rows={3}
          className="w-full resize-y rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-blue-500"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">
            {content.length}/5000
          </span>

          <button
            type="button"
            onClick={handleAddComment}
            disabled={!content.trim() || isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post comment'}
          </button>
        </div>
      </div>

      {actionError && (
        <p role="alert" className="text-sm text-red-400">
          {actionError}
        </p>
      )}

      {isLoading && (
        <p className="text-sm text-white/50">Loading comments...</p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      {!isLoading && !error && comments.length === 0 && (
        <p className="py-4 text-center text-sm text-white/40">
          No comments yet. Start the conversation!
        </p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => {
          const isAuthor = comment.authorId === user?.id
          const isEditing = editingCommentId === comment.id

          return (
            <article
              key={comment.id}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">
                    {comment.author.displayName ||
                      comment.author.email ||
                      'Unknown user'}
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    {formatCommentDate(comment.createdAt)}
                    {comment.updatedAt !== comment.createdAt &&
                      ' · Edited'}
                  </p>
                </div>

                {isAuthor && !isEditing && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCommentId(comment.id)
                        setEditingContent(comment.content)
                        setActionError(null)
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={isSubmitting}
                      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editingContent}
                    onChange={(event) => setEditingContent(event.target.value)}
                    maxLength={5000}
                    rows={3}
                    className="w-full resize-y rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-blue-500"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCommentId(null)
                        setEditingContent('')
                      }}
                      className="text-sm text-white/60 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateComment(comment.id)}
                      disabled={!editingContent.trim() || isSubmitting}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white/80">
                  {comment.content}
                </p>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
