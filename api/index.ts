import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import type { HelloResponse, HealthResponse } from '../shared/types'

export const app = new Elysia()
  .use(cors())
  .get('/api/hello', (): HelloResponse => ({
    message: 'Hello from Elysia!',
    timestamp: new Date().toISOString(),
  }))
  .get('/api/health', (): HealthResponse => ({
    status: 'ok',
  }))

// Only start server when run directly (not when imported for testing)
if (import.meta.main) {
  app.listen(3001)
  console.log('API server running at http://localhost:3001')
}
