/**
 * Shared types between frontend and API server.
 * Import in both client and server code for type-safe API contracts.
 */

export interface ApiResponse<T> {
  data?: T
  error?: string
  timestamp: string
}

export interface HelloResponse {
  message: string
  timestamp: string
}

export interface HealthResponse {
  status: 'ok' | 'error'
}
