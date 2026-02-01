# Bun + Vite + React Starter Template

A production-ready starter template with Bun runtime, Vite build tool, React 19, TypeScript, Elysia API server, and styled-components.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Build Tool**: [Vite](https://vite.dev) with SWC
- **Frontend**: [React 19](https://react.dev) + TypeScript
- **Styling**: [styled-components](https://styled-components.com)
- **API Server**: [Elysia](https://elysiajs.com) (Bun-native, type-safe)
- **Testing**: [Vitest](https://vitest.dev) + React Testing Library
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)

### Installation

```bash
bun install
```

### Development

Start both frontend and API servers:

```bash
bun run dev:all
```

Or run them separately:

```bash
# Frontend only (http://localhost:5173)
bun run dev

# API only (http://localhost:3001)
bun run dev:api
```

### Testing

```bash
# Run all tests (frontend + backend)
bun run test

# Run tests with UI
bun run test:ui
```

### Build

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start Vite dev server |
| `dev:api` | Start Elysia API server with hot reload |
| `dev:all` | Start both frontend and API servers |
| `build` | Type check and build for production |
| `preview` | Preview production build |
| `test` | Run tests with Vitest |
| `test:ui` | Run tests with Vitest UI |
| `lint` | Lint code with ESLint |
| `format` | Format code with Prettier |
| `format:check` | Check code formatting |

## Project Structure

```
/
├── api/                    # Elysia API server
│   ├── index.ts           # Server entry point
│   └── routes/            # Route modules
├── shared/                # Shared types (client/server)
│   └── types.ts
├── src/                   # React frontend
│   ├── components/        # React components
│   ├── App.tsx           # Main component
│   └── main.tsx          # Entry point
├── tests/                 # Test files
│   ├── App.test.tsx      # Frontend tests
│   └── api/              # Backend tests
├── vite.config.ts        # Vite + Vitest config
├── tsconfig.json         # TypeScript config
└── package.json
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/hello` | GET | Returns greeting message |
| `/api/health` | GET | Health check endpoint |

## Development Notes

### Proxy Configuration

During development, the Vite dev server proxies `/api` requests to the Elysia server running on port 3001. This is configured in `vite.config.ts`.

### Adding New API Routes

1. Create a route module in `api/routes/`:

```typescript
// api/routes/users.ts
import { Elysia } from 'elysia'

export const userRoutes = new Elysia({ prefix: '/api/users' })
  .get('/', () => ({ users: [] }))
  .get('/:id', ({ params }) => ({ id: params.id }))
```

2. Import and use in `api/index.ts`:

```typescript
import { userRoutes } from './routes/users'

export const app = new Elysia()
  .use(cors())
  .use(userRoutes)
  // ... other routes
```

### Shared Types

Define types in `shared/types.ts` for type-safe API contracts between frontend and backend:

```typescript
// shared/types.ts
export interface User {
  id: string
  name: string
}

// Use in API
app.get('/api/users/:id', ({ params }): User => ({ ... }))

// Use in frontend
const user = await fetch('/api/users/1').then(r => r.json()) as User
```

## License

MIT
