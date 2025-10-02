# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo for the PLAZA Toolkit - an Environmental Incident Investigation Platform. The codebase uses Next.js 15 with shadcn/ui components for building a comprehensive UI system.

## Monorepo Structure

```
├── apps/
│   └── web/           # Next.js 15 web application (main application)
├── packages/
│   ├── ui/           # Shared UI component library (shadcn/ui components)
│   ├── database/     # Prisma database package with SQLite
│   ├── lib/          # Shared utilities (auth, db-api, utils)
│   ├── types/        # Shared TypeScript types and Zod schemas
│   ├── eslint-config/  # Shared ESLint configuration
│   └── typescript-config/  # Shared TypeScript configuration
```

## Development Commands

### Root-level commands (run from project root):
- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all files with Prettier

### App-specific commands (run from apps/web):
- `pnpm dev` - Start Next.js dev server with Turbopack
- `pnpm build` - Build Next.js application
- `pnpm lint` - Run Next.js linter
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm typecheck` - Run TypeScript type checking

### Database commands (run from packages/database or root with pnpm --filter):
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:seed` - Seed database with test data
- `pnpm db:reset` - Reset database and re-seed
- `pnpm db:studio` - Open Prisma Studio GUI
- `pnpm db:migrate` - Create and apply migrations

### Adding shadcn/ui components:
Run from the root directory:
```bash
pnpm dlx shadcn@latest add [component-name] -c apps/web
```
This places components in `packages/ui/src/components/`

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **UI Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **Database**: Prisma with SQLite (dev.db)
- **Authentication**: JWT with bcrypt (cookies-based sessions)
- **State Management**: Zustand with persistence
- **Maps**: Leaflet.js with React Leaflet
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Turborepo with pnpm workspaces
- **TypeScript**: Strict mode enabled across all packages

### Key Architectural Decisions

1. **Monorepo Structure**: Uses Turborepo for efficient builds and caching across packages
2. **Shared UI Package**: All UI components live in `@workspace/ui` package for reusability
3. **Component Imports**: Import components using `@workspace/ui/components/[component-name]`
4. **Database Package**: Centralized Prisma setup in `@workspace/database` with client exports
5. **Shared Libraries**: Auth utilities, database APIs, and common functions in `@workspace/lib`
6. **Type Safety**: Shared types and Zod schemas in `@workspace/types`

### PLAZA Platform Context

The platform is designed for environmental incident investigation with role-based interfaces:
- **Officer**: Field reporting and evidence collection
- **Analyst**: Investigation and pattern analysis
- **Prosecutor**: Case building and legal proceedings
- **Citizen**: Incident reporting and status tracking
- **Admin**: System management

Key features include:
- Role-based access control with JWT authentication
- Geospatial mapping with Leaflet (clustering, heatmaps, drawing tools)
- Evidence management with chain of custody
- Case management linking multiple reports
- Photo/document upload and management
- Real-time notifications
- Activity tracking and audit logs

### Database Architecture

Uses Prisma ORM with SQLite for development. Key models:
- **User**: Role-based user accounts (OFFICER, ANALYST, PROSECUTOR, ADMIN, CITIZEN)
- **Report**: Incident reports with location, photos, evidence
- **Case**: Investigations linking multiple reports
- **Evidence**: Chain of custody for physical/digital evidence
- **Photo**: Image attachments for reports and evidence
- **Activity**: Audit log for user actions
- **Notification**: User notifications
- **AnalysisJob**: AI analysis requests and results

Database file location: `packages/database/prisma/dev.db`

### Authentication & Authorization

- **JWT-based**: Tokens stored in HTTP-only cookies
- **Middleware**: Next.js middleware validates tokens and enforces role-based access
- **Auth utilities**: Located in `packages/lib/src/auth.ts`
- **Session helpers**: Located in `apps/web/lib/auth-utils.ts` and `auth-middleware.ts`
- **Role access**: Defined in middleware with route patterns per role
- **Protected routes**: All `/dashboard/*` routes require authentication

### Component Architecture

UI components follow these patterns:
- Built with Radix UI primitives for accessibility
- Use class-variance-authority (CVA) for variant management
- Follow compound component pattern where appropriate
- Implement responsive design with mobile-first approach
- Located in `packages/ui/src/components/` (from shadcn)
- Custom components in `apps/web/components/` organized by domain (auth, layout, map, notifications)

### Data Flow & API Design

- **Server Components**: For initial data fetching (dashboard pages)
- **Client Components**: For interactivity ("use client" directive)
- **API Routes**: RESTful endpoints in `apps/web/app/api/`
  - `/api/auth/*` - Authentication endpoints
  - `/api/reports/*` - Report CRUD operations
  - `/api/cases/*` - Case management
  - `/api/evidence/*` - Evidence handling
  - `/api/photos/*` - Photo uploads
  - `/api/users/*` - User management
  - `/api/notifications/*` - Notification system
- **Database API**: Centralized queries in `packages/lib/src/db-api.ts`
- **Form handling**: React Hook Form with Zod schemas from `@workspace/types`

### Map Integration

Leaflet.js is used for mapping features:
- **Base map**: OpenStreetMap tiles
- **Clustering**: react-leaflet-cluster for performance
- **Heatmaps**: leaflet.heat for density visualization
- **Drawing tools**: leaflet-draw for area selection
- **Custom markers**: Icon-based markers for different report types
- **Dynamic imports**: Map components loaded client-side only
- **Location**: `apps/web/components/map/`

## Import Conventions

- Use `@workspace/ui/components/*` for UI components
- Use `@workspace/ui/hooks/*` for shared hooks
- Use `@workspace/ui/lib/*` for UI utilities
- Use `@workspace/database` for Prisma client
- Use `@workspace/database/client` for direct client access
- Use `@workspace/lib/db-api` for database query functions
- Use `@workspace/lib/auth` for authentication utilities
- Use `@workspace/lib/utils` for common utilities (cn, etc.)
- Use `@workspace/types/api` for API types
- Use `@workspace/types/forms` for form schemas
- Use `@workspace/types/ui` for UI component types
- Maintain absolute imports within apps using path aliases

## Testing & Quality

Before committing changes:
1. Run `pnpm typecheck` in apps/web to ensure type safety
2. Run `pnpm lint` to check for linting issues
3. Run `pnpm build` to verify production build works
4. Format code with `pnpm format` for consistency

## Performance Considerations

- Next.js uses Turbopack in development for faster HMR
- Components are optimized for tree-shaking
- Use dynamic imports for heavy components (especially Leaflet)
- Implement proper loading states and error boundaries
- Database queries optimized to avoid N+1 problems (use includes)

## Common Development Workflows

### Adding a new database model:
1. Update `packages/database/prisma/schema.prisma`
2. Run `pnpm db:push` from packages/database
3. Add query functions to `packages/lib/src/db-api.ts`
4. Create types in `packages/types/src/` if needed
5. Update seed file if needed and run `pnpm db:seed`

### Adding a new page with authentication:
1. Create page in `apps/web/app/dashboard/[feature]/page.tsx`
2. Fetch data using server components or API routes
3. Use `getCurrentUser()` helper to get authenticated user
4. Check middleware role access if needed
5. Create corresponding API routes in `apps/web/app/api/[feature]/`

### Adding a new API endpoint:
1. Create route in `apps/web/app/api/[feature]/route.ts`
2. Import database API from `@workspace/lib/db-api`
3. Validate input with Zod schemas from `@workspace/types/forms`
4. Return typed responses using types from `@workspace/types/api`
5. Handle authentication with `getCurrentUser()` helper

### Working with forms:
1. Define Zod schema in `packages/types/src/forms.ts`
2. Use React Hook Form with `@hookform/resolvers/zod`
3. Import form components from `@workspace/ui/components/form`
4. Handle submission via API routes
5. Show toast notifications from `sonner`
