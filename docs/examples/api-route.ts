import { Elysia } from 'elysia'

/**
 * Example route module demonstrating how to modularize Elysia routes.
 * Import and use with: app.use(exampleRoutes)
 */
export const exampleRoutes = new Elysia({ prefix: '/api/example' })
  .get('/', () => ({
    message: 'Example route',
    endpoints: ['/api/example', '/api/example/:id'],
  }))
  .get('/:id', ({ params }) => ({
    id: params.id,
    message: `Fetched example with id: ${params.id}`,
  }))
