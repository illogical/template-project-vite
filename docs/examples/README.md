# Code Examples

These examples demonstrate key patterns from the template-project-vite architecture.

## Files

- **[api-route.ts](api-route.ts)** - Elysia route module with prefix pattern
- **[component.tsx](component.tsx)** - React component with styled-components and transient props
- **[shared-type.ts](shared-type.ts)** - Type-safe API contract pattern

## Usage

Copy these examples into your project and modify as needed. Each file demonstrates production-ready patterns used in the template.

### API Route Example

The [api-route.ts](api-route.ts) file shows:
- Modular Elysia route definition
- Route prefix pattern (`/api/example`)
- Route parameter handling
- JSDoc documentation

### Component Example

The [component.tsx](component.tsx) file shows:
- styled-components with TypeScript
- Transient props pattern (`$variant` prefix)
- Conditional styling with `css` helper
- Pseudo-class styling
- Default prop values

### Shared Type Example

The [shared-type.ts](shared-type.ts) file shows:
- Generic API response wrapper
- Specific response interfaces
- Type-safe contracts between frontend and backend
- JSDoc documentation

---

**Template Repository**: https://github.com/illogical/template-project-vite
**See also**: [CODING_STANDARDS.md](../CODING_STANDARDS.md) | [SETUP_GUIDE.md](../SETUP_GUIDE.md)
