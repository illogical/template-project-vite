import { describe, it, expect } from 'vitest'
import { app } from '../../api/index'

describe('API: /api/hello', () => {
  it('returns greeting message', async () => {
    const response = await app.handle(new Request('http://localhost/api/hello'))
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json.message).toBe('Hello from Elysia!')
    expect(json.timestamp).toBeDefined()
  })
})

describe('API: /api/health', () => {
  it('returns health status', async () => {
    const response = await app.handle(new Request('http://localhost/api/health'))
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json.status).toBe('ok')
  })
})
