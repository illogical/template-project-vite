# Coding Standards: Bun + Vite + React + Elysia Full-Stack Architecture

> **Based on**: [template-project-vite](https://github.com/illogical/template-project-vite)

This document establishes comprehensive coding standards for full-stack TypeScript projects using the Bun + Vite + React + Elysia architecture. These standards are derived from the actual patterns in the template repository.

---

## Table of Contents

- [Project Structure](#project-structure)
- [TypeScript Configuration](#typescript-configuration)
- [Code Style](#code-style)
- [Frontend Patterns](#frontend-patterns)
- [Backend Patterns](#backend-patterns)
- [Shared Types](#shared-types)
- [Testing](#testing)
- [Development Workflow](#development-workflow)

---

## Project Structure

### Canonical Directory Layout

```
/
├── api/                    # Elysia backend API server
│   ├── index.ts           # Server entry point with conditional start
│   └── routes/            # Modular API route definitions
│       └── example.ts     # Example route module pattern
├── shared/                # Shared types (client/server contracts)
│   └── types.ts          # Type-safe API interfaces
├── src/                   # React frontend application
│   ├── components/        # Reusable UI components
│   ├── assets/           # Static assets (images, SVGs)
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Frontend entry point
│   └── index.css         # Global styles
├── tests/                 # Test files (mirrors source structure)
│   ├── App.test.tsx      # Frontend component tests
│   └── api/              # Backend API tests
│       └── hello.test.ts
├── public/                # Static public assets (served as-is)
├── dist/                  # Production build output (gitignored)
├── vite.config.ts        # Vite + Vitest configuration
├── tsconfig.json         # Root TypeScript config (project references)
├── tsconfig.app.json     # Frontend TypeScript config
├── tsconfig.api.json     # Backend TypeScript config
├── tsconfig.node.json    # Build tools TypeScript config
├── eslint.config.js      # ESLint flat config
├── .prettierrc           # Prettier formatting rules
└── package.json          # Dependencies and scripts
```

### Architectural Principles

1. **Monorepo Structure**: Frontend and backend in one repository for easier type sharing and coordinated changes
2. **Clear Separation**: Distinct directories for client (`src/`), server (`api/`), and shared code (`shared/`)
3. **Shared Types Directory**: Type-safe contracts between frontend and backend prevent API mismatches
4. **Modular Organization**: Backend routes organized in separate modules for scalability
5. **Test Directory Mirrors Source**: Tests organized to match source structure for easy navigation

---

## TypeScript Configuration

### Three-Tier Configuration Strategy

The project uses **TypeScript project references** with three specialized configs:

#### Root Config: `tsconfig.json`
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.api.json" }
  ]
}
```

**Purpose**: Orchestrates the three specialized configs. Contains no files itself, only references.

#### Frontend Config: `tsconfig.app.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "verbatimModuleSyntax": true
  },
  "include": ["src", "shared"]
}
```

**Key Features**:
- **DOM libs** for browser APIs
- **JSX support** with `react-jsx` (React 19)
- **Vite types** for import.meta.env
- **Includes shared/** for type-safe API contracts
- **Bundler mode** for modern module resolution

#### Backend Config: `tsconfig.api.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "types": ["bun"],
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "verbatimModuleSyntax": true
  },
  "include": ["api", "shared"]
}
```

**Key Features**:
- **NO DOM libs** (server-only)
- **Bun types** for runtime APIs
- **Includes shared/** for type-safe API contracts
- **Same strict rules** as frontend for consistency

### Standard TypeScript Features

**Always Enable**:
- `strict: true` - All strict checks
- `noUnusedLocals: true` - Catch unused variables
- `noUnusedParameters: true` - Catch unused function parameters
- `noFallthroughCasesInSwitch: true` - Prevent switch fallthrough bugs
- `noUncheckedSideEffectImports: true` - Force explicit side-effect imports
- `verbatimModuleSyntax: true` - Enforce explicit type imports

**Bundler Mode**:
- `moduleResolution: "bundler"` - Modern module resolution for both frontend and backend
- Allows TypeScript extensions in imports
- Optimized for Vite and Bun

---

## Code Style

### ESLint Configuration

The project uses **ESLint flat config** (ESLint 9+) with environment-specific rules.

#### Flat Config Structure (`eslint.config.js`)

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),

  // Frontend files (React)
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
  },

  // Backend/API files (Bun)
  {
    files: ['api/**/*.ts', 'shared/**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        Bun: 'readonly',
      },
    },
  },

  // Test files
  {
    files: ['tests/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
])
```

**Key Patterns**:
1. **Environment-Specific Rules**: Different configs for frontend (browser), backend (node + Bun), and tests (both)
2. **React Plugins**: Only applied to `src/**/*.{ts,tsx}` files
3. **Global Bun**: Added to backend globals for Bun-specific APIs
4. **Flat Config Format**: Modern ESLint 9+ configuration style

### Prettier Configuration

#### `.prettierrc`
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**Style Rules**:
- **No semicolons** - Cleaner, modern JavaScript style
- **Single quotes** - Consistent with modern JS conventions
- **2-space indentation** - Standard for TypeScript/React
- **ES5 trailing commas** - Trailing commas where valid in ES5
- **100 character line width** - Balance readability and screen width

**Format Command**:
```bash
bun run format        # Format all code
bun run format:check  # Check formatting (CI)
```

### Naming Conventions

#### Files
- **Components**: PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`)
- **Utilities/Hooks**: camelCase (e.g., `formatDate.ts`, `useAuth.ts`)
- **Types**: camelCase (e.g., `types.ts`, `api.types.ts`)
- **Tests**: Match source with `.test` suffix (e.g., `Button.test.tsx`)

#### Code
- **Components**: PascalCase (e.g., `const Button = () => ...`)
- **Functions/Variables**: camelCase (e.g., `const fetchData = ...`)
- **Types/Interfaces**: PascalCase (e.g., `interface UserData {}`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `const API_BASE_URL = ...`)

---

## Frontend Patterns

### React Component Structure

#### Functional Components with Hooks

```typescript
import { useState, useEffect } from 'react'
import type { HelloResponse } from '../shared/types'

function App() {
  const [count, setCount] = useState(0)
  const [apiData, setApiData] = useState<HelloResponse | null>(null)

  // Async API calls with proper error handling
  const fetchHello = async () => {
    try {
      const response = await fetch('/api/hello')
      const data = await response.json()
      setApiData(data)
    } catch (error) {
      console.error('API fetch failed:', error)
    }
  }

  useEffect(() => {
    fetchHello()
  }, [])

  return <Container>...</Container>
}

export default App
```

**Patterns**:
- **Functional components** - No class components
- **TypeScript typing** - Explicit types for state and props
- **Error handling** - Always wrap async calls in try/catch
- **Type imports** - Use `type` keyword for type-only imports

### Styled Components

#### Transient Props Pattern

```typescript
import styled, { css } from 'styled-components'

interface ButtonProps {
  $variant?: 'primary' | 'secondary'  // $ prefix for transient props
}

export const Button = styled.button<ButtonProps>`
  border-radius: 8px;
  padding: 0.6em 1.2em;

  // Conditional styling with css helper
  ${({ $variant = 'primary' }) =>
    $variant === 'primary'
      ? css`
          background-color: #1a1a1a;
          color: #fff;
        `
      : css`
          background-color: #333;
          color: #888;
        `}

  // Pseudo-class support
  &:hover {
    border-color: #646cff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
```

**Key Patterns**:
1. **Transient Props**: Use `$` prefix (e.g., `$variant`) to prevent props from being passed to DOM
2. **TypeScript Interfaces**: Define prop types for styled components
3. **css Helper**: Use for conditional styling blocks
4. **Default Values**: Provide defaults in destructuring (e.g., `$variant = 'primary'`)
5. **Pseudo-classes**: Use `&:hover`, `&:focus`, etc. for state-based styles

#### Component Organization

```typescript
// Option 1: Co-located styled components
// src/components/Button.tsx
import styled from 'styled-components'

export const Button = styled.button`...`

// Option 2: Inline styled components
// src/App.tsx
const Container = styled.div`...`

function App() {
  return <Container>...</Container>
}
```

**Guidelines**:
- **Named exports** for reusable components
- **Co-locate** styled components with their usage
- **Keep styling close** to component logic

---

## Backend Patterns

### Elysia API Server

#### Main Server Entry Point

```typescript
// api/index.ts
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
```

**Key Patterns**:
1. **Export app** for testing
2. **Conditional server start** with `import.meta.main`
3. **Type-safe responses** using shared types
4. **CORS middleware** for cross-origin requests
5. **Inline route handlers** with explicit return types

#### Modular Route Pattern

```typescript
// api/routes/example.ts
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
```

**Key Patterns**:
1. **Prefix option** - All routes inherit the prefix (e.g., `/api/example`)
2. **Named exports** - Export route modules for composition
3. **JSDoc comments** - Document route module purpose
4. **Route chaining** - Chain `.get()`, `.post()`, etc.
5. **Destructure context** - Use `{ params }` for route parameters

#### Integrating Route Modules

```typescript
// api/index.ts
import { exampleRoutes } from './routes/example'
import { userRoutes } from './routes/users'

export const app = new Elysia()
  .use(cors())
  .use(exampleRoutes)
  .use(userRoutes)
  // ... other routes
```

---

## Shared Types

### Type-Safe API Contracts

The `shared/` directory contains TypeScript interfaces shared between frontend and backend.

#### Pattern: Shared Type Definitions

```typescript
// shared/types.ts

/**
 * Shared types between frontend and API server.
 * Import in both client and server code for type-safe API contracts.
 */

// Generic wrapper for API responses
export interface ApiResponse<T> {
  data?: T
  error?: string
  timestamp: string
}

// Specific response interfaces
export interface HelloResponse {
  message: string
  timestamp: string
}

export interface HealthResponse {
  status: 'ok' | 'error'
}
```

#### Usage in Backend

```typescript
// api/index.ts
import type { HelloResponse } from '../shared/types'

app.get('/api/hello', (): HelloResponse => ({
  message: 'Hello from Elysia!',
  timestamp: new Date().toISOString(),
}))
```

#### Usage in Frontend

```typescript
// src/App.tsx
import type { HelloResponse } from '../shared/types'

const [data, setData] = useState<HelloResponse | null>(null)

const fetchHello = async () => {
  const response = await fetch('/api/hello')
  const data: HelloResponse = await response.json()
  setData(data)
}
```

### Naming Conventions

- **Response types**: `{Resource}Response` (e.g., `UserResponse`, `HelloResponse`)
- **Request types**: `{Resource}Request` (e.g., `CreateUserRequest`)
- **Generic wrappers**: `Api{Type}` (e.g., `ApiResponse<T>`, `ApiError`)

---

## Testing

### Vitest Configuration

The project uses **Vitest** for both frontend and backend tests.

#### Configuration (`vite.config.ts`)

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,               // Enable Vitest globals (describe, it, expect)
    environment: 'jsdom',        // DOM environment for React tests
    setupFiles: './vitest.setup.ts',
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
  },
})
```

### Frontend Testing Patterns

#### React Component Tests

```typescript
// tests/App.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../src/App'

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders Vite and React logos', () => {
    render(<App />)
    const logos = screen.getAllByRole('img')
    expect(logos).toHaveLength(2)
  })
})
```

**Patterns**:
- **React Testing Library** for component testing
- **Accessible queries** (e.g., `getByRole`, `getByLabelText`)
- **jest-dom matchers** (e.g., `toBeInTheDocument()`)
- **Descriptive test names** that explain what's being tested

### Backend Testing Patterns

#### API Endpoint Tests

```typescript
// tests/api/hello.test.ts
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

  it('returns correct content-type', async () => {
    const response = await app.handle(new Request('http://localhost/api/hello'))
    expect(response.headers.get('content-type')).toContain('application/json')
  })
})
```

**Patterns**:
- **Elysia `.handle()` method** - Test routes without running server
- **Mock Request objects** - Use `new Request()` for testing
- **Assert status codes** - Check response.status
- **Assert response body** - Parse JSON and validate structure
- **Assert headers** - Check content-type and other headers

### Test Organization

```
tests/
├── App.test.tsx           # Frontend component tests
└── api/                   # Backend API tests
    ├── hello.test.ts
    └── health.test.ts
```

**Guidelines**:
- **Mirror source structure** - Test file organization matches source
- **`.test` suffix** - Use `.test.ts` or `.test.tsx` for test files
- **Descriptive describe blocks** - Group related tests
- **One assertion per test** (when possible) - Makes failures clear

---

## Development Workflow

### Package Scripts

```json
{
  "scripts": {
    "dev": "bunx --bun vite",                    // Frontend dev server (port 5173)
    "dev:api": "bun --watch api/index.ts",       // Backend dev server with hot reload (port 3001)
    "dev:all": "bun run dev & bun run dev:api",  // Start both concurrently
    "build": "tsc -b && bunx --bun vite build",  // Type check + build
    "preview": "bunx --bun vite preview",        // Preview production build
    "test": "vitest",                            // Run all tests
    "test:ui": "vitest --ui",                    // Run tests with UI
    "lint": "eslint .",                          // Lint all files
    "format": "prettier --write \"src/**/*.{ts,tsx}\" \"api/**/*.ts\" \"shared/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx}\" \"api/**/*.ts\" \"shared/**/*.ts\""
  }
}
```

### Development Servers

#### Frontend Server
- **Command**: `bun run dev`
- **Port**: 5173
- **Features**: Hot module replacement (HMR), Vite proxy for `/api` requests

#### Backend Server
- **Command**: `bun run dev:api`
- **Port**: 3001
- **Features**: Watch mode with `--watch`, automatic restart on file changes

#### Full-Stack Development
```bash
bun run dev:all
```
Starts both servers concurrently for full-stack development.

### Vite Proxy Configuration

During development, Vite proxies `/api` requests to the Elysia server:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',  // Elysia server
        changeOrigin: true,
      },
    },
  },
})
```

**How it works**:
1. Frontend makes request to `/api/hello`
2. Vite dev server proxies to `http://localhost:3001/api/hello`
3. Elysia server responds
4. Response returned to frontend

**Benefits**:
- No CORS issues in development
- Frontend and backend on same origin
- Matches production routing patterns

### Build Process

```bash
# Type check + build
bun run build

# Output directory: dist/
```

**Steps**:
1. `tsc -b` - Type check all TypeScript configs (app, api, node)
2. `vite build` - Build frontend for production
3. Output in `dist/` directory

### Testing Workflow

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test -- --watch

# Run tests with UI
bun run test:ui

# Run specific test file
bun run test tests/App.test.tsx
```

---

## Summary

This architecture provides:
- **Type safety** across the full stack with shared types
- **Modern tooling** with Bun, Vite, and Elysia
- **Developer experience** with hot reload for both frontend and backend
- **Code quality** with ESLint, Prettier, and comprehensive testing
- **Scalability** with modular organization and clear separation of concerns

Follow these standards to ensure consistency, maintainability, and team collaboration.

---

**Template Repository**: https://github.com/illogical/template-project-vite
**Generated by**: [template-vite-standards](https://claude.com) Claude Code Skill
