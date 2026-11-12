import { Router } from 'express'

const healthRouter = Router()

healthRouter.get('/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'nexora-api',
  })
})

export default healthRouter