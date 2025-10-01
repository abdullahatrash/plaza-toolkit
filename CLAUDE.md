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
- **State Management**: React 19 built-in features
- **Build Tool**: Turborepo with pnpm workspaces
- **TypeScript**: Strict mode enabled across all packages

### Key Architectural Decisions

1. **Monorepo Structure**: Uses Turborepo for efficient builds and caching across packages
2. **Shared UI Package**: All UI components live in `@workspace/ui` package for reusability
3. **Component Imports**: Import components using `@workspace/ui/components/[component-name]`
4. **Styling Strategy**: Tailwind CSS configured at app level, components use utility classes

### PLAZA Platform Context

The platform is designed for environmental incident investigation with role-based interfaces:
- **Officer**: Field reporting and evidence collection
- **Analyst**: Investigation and pattern analysis
- **Prosecutor**: Case building and legal proceedings
- **Citizen**: Incident reporting and status tracking
- **Admin**: System management

Key features include:
- AI-powered analysis with xAI integration
- Geospatial mapping and visualization
- Evidence management with chain of custody
- Multi-language support
- Real-time collaboration

### Component Architecture

UI components follow these patterns:
- Built with Radix UI primitives for accessibility
- Use class-variance-authority (CVA) for variant management
- Follow compound component pattern where appropriate
- Implement responsive design with mobile-first approach

### Data Flow
- Server Components for initial data fetching
- Client Components for interactivity
- Form handling with native HTML forms or controlled components
- API routes follow RESTful conventions

## Import Conventions

- Use `@workspace/ui/components/*` for UI components
- Use `@workspace/ui/hooks/*` for shared hooks
- Use `@workspace/ui/lib/*` for utilities
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
- Use dynamic imports for heavy components
- Implement proper loading states and error boundaries