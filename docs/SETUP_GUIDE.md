# Setup Guide: Bun + Vite + React + Elysia Projects

> **Based on**: [template-project-vite](https://github.com/illogical/template-project-vite)
> **Template Version**: `c2a10f824975b57efe9b14e9ddeb83204dccd298`
> **Generated**: `2026-02-01 22:56:22 UTC`

This guide provides step-by-step instructions for setting up and working with projects using the Bun + Vite + React + Elysia architecture.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Initialization](#project-initialization)
- [Development Environment](#development-environment)
- [Adding New Features](#adding-new-features)
  - [Adding API Routes](#adding-api-routes)
  - [Adding Components](#adding-components)
  - [Adding Shared Types](#adding-shared-types)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Scripts Reference](#scripts-reference)

---

## Prerequisites

### Required Software

1. **Bun Runtime** (v1.0+)
   ```bash
   # Install Bun
   curl -fsSL https://bun.sh/install | bash

   # Verify installation
   bun --version
   ```

2. **Git** (for cloning the template)
   ```bash
   git --version
   ```

### Optional Tools

- **GitHub CLI** (for cloning repos)
  ```bash
  gh --version
  ```

- **VS Code** with recommended extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features

---

## Project Initialization

### Option 1: Clone Template Repository

```bash
# Clone the template
gh repo clone illogical/template-project-vite my-project-name

# Or use git
git clone https://github.com/illogical/template-project-vite.git my-project-name

# Navigate to project
cd my-project-name

# Install dependencies
bun install
```

### Option 2: Use Template on GitHub

1. Go to https://github.com/illogical/template-project-vite
2. Click "Use this template" → "Create a new repository"
3. Clone your new repository
4. Run `bun install`

### Initial Setup Steps

```bash
# 1. Install dependencies
bun install

# 2. Verify everything works
bun run dev:all

# 3. Run tests to ensure setup is correct
bun run test

# 4. Initialize git (if not already initialized)
git init
git add .
git commit -m "Initial commit from template"
```

---

## Development Environment

### Starting Development Servers

#### Full-Stack Development (Recommended)
```bash
bun run dev:all
```
- Starts frontend on http://localhost:5173
- Starts backend on http://localhost:3001
- Both servers run concurrently with hot reload

#### Frontend Only
```bash
bun run dev
```
- Starts Vite dev server on http://localhost:5173
- Hot Module Replacement (HMR) enabled
- Proxies `/api` requests to port 3001 (backend must be running separately)

#### Backend Only
```bash
bun run dev:api
```
- Starts Elysia server on http://localhost:3001
- Watch mode enabled (restarts on file changes)

### Development Workflow

1. **Start servers**: `bun run dev:all`
2. **Make changes**: Edit files in `src/`, `api/`, or `shared/`
3. **See updates**: Both servers automatically reload
4. **Run tests**: `bun run test` in another terminal
5. **Lint code**: `bun run lint` to check for issues
6. **Format code**: `bun run format` to auto-format

---

## Adding New Features

### Adding API Routes

#### Step 1: Create Route Module

Create a new file in `api/routes/`:

```bash
# Create new route file
touch api/routes/users.ts
```

#### Step 2: Define Route Module

```typescript
// api/routes/users.ts
import { Elysia } from 'elysia'
import type { UserResponse, CreateUserRequest } from '../../shared/types'

export const userRoutes = new Elysia({ prefix: '/api/users' })
  .get('/', (): UserResponse[] => {
    // TODO: Implement user list logic
    return [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ]
  })
  .get('/:id', ({ params }): UserResponse => {
    // TODO: Implement user fetch logic
    return {
      id: params.id,
      name: 'John Doe',
      email: 'john@example.com',
    }
  })
  .post('/', ({ body }): UserResponse => {
    // TODO: Implement user creation logic
    const newUser = body as CreateUserRequest
    return {
      id: crypto.randomUUID(),
      ...newUser,
    }
  })
```

#### Step 3: Register Route Module

Add the route module to `api/index.ts`:

```typescript
// api/index.ts
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { userRoutes } from './routes/users'  // Import new route

export const app = new Elysia()
  .use(cors())
  .use(userRoutes)  // Register route module
  // ... other routes

if (import.meta.main) {
  app.listen(3001)
  console.log('API server running at http://localhost:3001')
}
```

#### Step 4: Test the Route

```bash
# Start the API server
bun run dev:api

# Test in another terminal
curl http://localhost:3001/api/users
curl http://localhost:3001/api/users/123
```

---

### Adding Components

#### Step 1: Create Component File

```bash
# Create new component
touch src/components/UserCard.tsx
```

#### Step 2: Define Component

```typescript
// src/components/UserCard.tsx
import styled from 'styled-components'
import type { UserResponse } from '../../shared/types'

interface UserCardProps {
  user: UserResponse
  $variant?: 'default' | 'compact'
}

const Card = styled.div<{ $variant?: 'default' | 'compact' }>`
  padding: ${({ $variant }) => ($variant === 'compact' ? '0.5rem' : '1rem')};
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`

const Name = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
`

const Email = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`

export function UserCard({ user, $variant = 'default' }: UserCardProps) {
  return (
    <Card $variant={$variant}>
      <Name>{user.name}</Name>
      <Email>{user.email}</Email>
    </Card>
  )
}
```

#### Step 3: Use Component

```typescript
// src/App.tsx
import { useState, useEffect } from 'react'
import { UserCard } from './components/UserCard'
import type { UserResponse } from '../shared/types'

function App() {
  const [users, setUsers] = useState<UserResponse[]>([])

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Failed to fetch users:', error))
  }, [])

  return (
    <div>
      <h1>Users</h1>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

export default App
```

---

### Adding Shared Types

Shared types ensure type safety between frontend and backend.

#### Step 1: Define Types in `shared/types.ts`

```typescript
// shared/types.ts

// Add new types at the bottom
export interface UserResponse {
  id: string
  name: string
  email: string
}

export interface CreateUserRequest {
  name: string
  email: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
}
```

#### Step 2: Use in Backend

```typescript
// api/routes/users.ts
import type { UserResponse, CreateUserRequest } from '../../shared/types'

export const userRoutes = new Elysia({ prefix: '/api/users' })
  .post('/', ({ body }): UserResponse => {
    const newUser = body as CreateUserRequest
    return {
      id: crypto.randomUUID(),
      ...newUser,
    }
  })
```

#### Step 3: Use in Frontend

```typescript
// src/App.tsx
import type { UserResponse } from '../shared/types'

const [users, setUsers] = useState<UserResponse[]>([])

const fetchUsers = async () => {
  const response = await fetch('/api/users')
  const data: UserResponse[] = await response.json()
  setUsers(data)
}
```

**Benefits**:
- TypeScript catches API mismatches at compile time
- Autocomplete works for API responses in frontend
- Refactoring is safer (rename propagates everywhere)

---

## Testing

### Running Tests

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

### Writing Frontend Tests

#### Component Test Example

```typescript
// tests/components/UserCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserCard } from '../../src/components/UserCard'

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  }

  it('renders user name', () => {
    render(<UserCard user={mockUser} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders user email', () => {
    render(<UserCard user={mockUser} />)
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('applies compact variant styling', () => {
    render(<UserCard user={mockUser} $variant="compact" />)
    // Add assertions for compact styling
  })
})
```

### Writing Backend Tests

#### API Endpoint Test Example

```typescript
// tests/api/users.test.ts
import { describe, it, expect } from 'vitest'
import { app } from '../../api/index'

describe('API: /api/users', () => {
  it('returns list of users', async () => {
    const response = await app.handle(new Request('http://localhost/api/users'))

    expect(response.status).toBe(200)

    const users = await response.json()
    expect(Array.isArray(users)).toBe(true)
    expect(users.length).toBeGreaterThan(0)
  })

  it('returns single user by id', async () => {
    const response = await app.handle(new Request('http://localhost/api/users/123'))

    expect(response.status).toBe(200)

    const user = await response.json()
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('name')
    expect(user).toHaveProperty('email')
  })

  it('creates new user', async () => {
    const newUser = { name: 'Test User', email: 'test@example.com' }

    const response = await app.handle(
      new Request('http://localhost/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
    )

    expect(response.status).toBe(200)

    const user = await response.json()
    expect(user.name).toBe(newUser.name)
    expect(user.email).toBe(newUser.email)
    expect(user).toHaveProperty('id')
  })
})
```

### Test Organization

```
tests/
├── App.test.tsx                 # Main app tests
├── components/                  # Component tests
│   └── UserCard.test.tsx
└── api/                         # API tests
    ├── hello.test.ts
    └── users.test.ts
```

---

## Building for Production

### Build Command

```bash
# Type check and build
bun run build
```

**What happens**:
1. `tsc -b` - Type checks all TypeScript files
2. `vite build` - Builds frontend for production
3. Output in `dist/` directory

### Preview Production Build

```bash
# Build first
bun run build

# Preview
bun run preview
```

Opens production build at http://localhost:4173

### Production Deployment

1. **Build the frontend**:
   ```bash
   bun run build
   ```

2. **Deploy `dist/` directory** to static hosting (Vercel, Netlify, etc.)

3. **Deploy backend separately**:
   ```bash
   # Backend runs independently on port 3001
   bun run api/index.ts
   ```

4. **Configure production API URL** in frontend:
   ```typescript
   // src/config.ts
   export const API_BASE_URL = import.meta.env.PROD
     ? 'https://api.yourdomain.com'
     : 'http://localhost:3001'
   ```

---

## Scripts Reference

### Development Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `bunx --bun vite` | Start Vite dev server (port 5173) |
| `dev:api` | `bun --watch api/index.ts` | Start Elysia API server with hot reload (port 3001) |
| `dev:all` | `bun run dev & bun run dev:api` | Start both frontend and backend concurrently |

### Build Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `build` | `tsc -b && bunx --bun vite build` | Type check and build for production |
| `preview` | `bunx --bun vite preview` | Preview production build (port 4173) |

### Testing Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `test` | `vitest` | Run all tests |
| `test:ui` | `vitest --ui` | Run tests with interactive UI |

### Code Quality Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `lint` | `eslint .` | Lint all files with ESLint |
| `format` | `prettier --write "src/**/*.{ts,tsx}" "api/**/*.ts" "shared/**/*.ts"` | Format all code with Prettier |
| `format:check` | `prettier --check "src/**/*.{ts,tsx}" "api/**/*.ts" "shared/**/*.ts"` | Check code formatting (for CI) |

---

## Common Tasks

### Adding a New Dependency

```bash
# Add runtime dependency
bun add package-name

# Add dev dependency
bun add -d package-name
```

### Updating Dependencies

```bash
# Update all dependencies
bun update

# Update specific package
bun update package-name
```

### Cleaning Build Artifacts

```bash
# Remove build output
rm -rf dist/

# Remove dependencies (requires reinstall)
rm -rf node_modules/ bun.lock
bun install
```

---

## Troubleshooting

### Port Already in Use

If port 5173 or 3001 is already in use:

```bash
# Find process using port
lsof -i :5173
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Type Errors After Adding Shared Types

```bash
# Rebuild TypeScript project
bun run build

# Check for type errors
tsc -b --noEmit
```

### Tests Failing After Changes

```bash
# Clear Vitest cache
rm -rf node_modules/.vitest

# Run tests again
bun run test
```

---

## Next Steps

1. **Read the Coding Standards**: Review [CODING_STANDARDS.md](./CODING_STANDARDS.md) for detailed patterns
2. **Add Your First Feature**: Follow the guides above to add a route or component
3. **Set Up CI/CD**: Configure GitHub Actions or similar for automated testing
4. **Customize the Template**: Adapt the architecture to your project's needs

---

**Template Repository**: https://github.com/illogical/template-project-vite
**Generated by**: [template-vite-standards](https://claude.com) Claude Code Skill
