
import type { RequestHandler } from 'express'
import type { ZodType } from 'zod'
import { AppError } from './error.middleware.js'

export const validateBody = (schema: ZodType): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const details = result.error.issues
        .map((issue) => {
          const field = issue.path.join('.') || 'body'
          return `${field}: ${issue.message}`
        })
        .join('; ')

      return next(
        new AppError(`Validation failed: ${details}`, 400),
      )
    }

    req.body = result.data
    next()
  }
}
