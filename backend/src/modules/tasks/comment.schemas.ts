import { z } from 'zod'

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(5_000, 'Comment must be 5,000 characters or fewer'),
})

export const updateCommentSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(1, 'Comment cannot be empty')
      .max(5_000, 'Comment must be 5,000 characters or fewer'),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    'Send at least one field to update',
  )

export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>
