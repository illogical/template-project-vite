import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../src/App'

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders the Bun + Vite + React text', () => {
    render(<App />)
    expect(screen.getByText(/Bun \+ Vite \+ React/i)).toBeInTheDocument()
  })
})
