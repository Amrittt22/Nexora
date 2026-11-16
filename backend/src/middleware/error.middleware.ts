
import type { ErrorRequestHandler, RequestHandler } from 'express'

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
) => {
  if (res.headersSent) {
    return
  }

  const isAppError = error instanceof AppError
  const isZodError =
    error instanceof Error && error.name === 'ZodError'

  const statusCode = isAppError
    ? error.statusCode
    : isZodError
      ? 400
      : 500

  const message =
    statusCode >= 500
      ? 'Internal server error'
      : error instanceof Error
        ? error.message
        : 'Request failed'

  if (statusCode >= 500) {
    console.error('[API Error]', error)
  }

  res.status(statusCode).json({
    message,
  })
}
