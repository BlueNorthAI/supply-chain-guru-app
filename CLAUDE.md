# CLAUDE.md - Supply Chain Guru App

This document provides guidance for AI assistants working with this codebase.

## Project Overview

Supply Chain Guru is a comprehensive supply chain management and analytics platform built with Next.js 15. It provides workspaces for teams to manage projects, tasks, and analyze supply chain metrics including warehouse operations, KPIs, incidents, and logistics performance.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + DaisyUI + shadcn/ui (new-york style)
- **Backend**: Hono (API routes with RPC pattern)
- **Database/Auth**: Appwrite (BaaS)
- **State Management**: TanStack React Query v4
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts, AG Charts, Kendo React Charts
- **Data Tables**: TanStack Table, AG Grid
- **Package Manager**: pnpm

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (sign-in, sign-up)
│   ├── (dashboard)/              # Dashboard route group
│   │   └── workspaces/[workspaceId]/
│   │       ├── alert/            # Alerts management
│   │       ├── analytics/        # Analytics dashboards
│   │       ├── benchmark/        # Benchmarking tools
│   │       ├── control/          # Control panels
│   │       ├── controlKpi/       # KPI control dashboards
│   │       ├── costAnalysis/     # Cost analysis
│   │       ├── engine/           # Problem solving engine
│   │       ├── incidents/        # Incident management
│   │       ├── kpi/              # KPI views
│   │       ├── operation/        # Operations dashboard
│   │       ├── projects/         # Project management
│   │       ├── tasks/            # Task management
│   │       ├── track/            # Order tracking
│   │       └── warehouse/        # Warehouse analytics
│   ├── (standalone)/             # Standalone pages (settings, members)
│   ├── api/[[...route]]/         # Hono API catch-all route
│   └── data/                     # Static data files (JSX exports)
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── dashboard/                # Dashboard components
│   ├── engines/                  # Problem solving engine components
│   ├── kpi/                      # KPI visualization components
│   ├── warehouse/                # Warehouse-specific components
│   └── [feature-components]/     # Other feature components
├── features/                     # Feature modules (domain-driven)
│   ├── accounts/                 # Account management
│   ├── alerts/                   # Alert system
│   ├── analytics/                # Analytics features
│   ├── auth/                     # Authentication
│   ├── members/                  # Member management
│   ├── projects/                 # Project management
│   ├── receving/                 # Receiving metrics
│   ├── tasks/                    # Task management
│   ├── trackTrace/               # Order tracking
│   └── workspaces/               # Workspace management
├── hooks/                        # Global React hooks
└── lib/                          # Core utilities
    ├── appwrite.ts               # Appwrite client configuration
    ├── rpc.ts                    # Hono RPC client
    ├── session-middleware.ts     # Auth middleware for Hono
    └── utils.ts                  # Utility functions (cn, formatters)
```

## Feature Module Pattern

Each feature in `src/features/` follows a consistent structure:

```
features/[feature-name]/
├── api/                    # React Query hooks (use-*.ts)
├── components/             # Feature-specific React components
├── server/                 # Hono routes (route.ts)
├── hooks/                  # Feature-specific React hooks
├── schemas.ts              # Zod validation schemas
├── types.ts                # TypeScript types/enums
├── queries.ts              # Server-side query functions
└── constants.ts            # Feature constants
```

### API Hooks Pattern

```typescript
// Example: src/features/auth/api/use-login.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login["$post"]({ json });
      if (!response.ok) throw new Error("Failed to login");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
  });
  return mutation;
};
```

### Server Route Pattern

```typescript
// Example: src/features/[feature]/server/route.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    // ... query logic
    return c.json({ data });
  })
  .post("/", sessionMiddleware, zValidator("json", schema), async (c) => {
    const { field } = c.req.valid("json");
    // ... mutation logic
    return c.json({ data });
  });

export default app;
```

## Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Key Conventions

### Import Aliases

Use the `@/*` alias for imports from `src/`:
```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/features/auth/api/use-login";
```

### Component Patterns

1. **Page Components**: Located in `app/` directories as `page.tsx`
2. **Client Components**: Use `"use client"` directive, often named `client.tsx`
3. **UI Components**: Use shadcn/ui primitives from `components/ui/`
4. **Feature Components**: Colocated in feature module's `components/` folder

### Styling

- Use Tailwind CSS classes with the `cn()` utility for conditional classes
- CSS variables for theming (defined in globals.css)
- DaisyUI components available for rapid prototyping
- Dark mode supported via `next-themes`

### Data Validation

- Always use Zod schemas for form and API validation
- Schemas live in feature module's `schemas.ts` file
- Use `zValidator` middleware in Hono routes

### State Management

- Server state: TanStack React Query
- Form state: React Hook Form
- URL state: `nuqs` for query string management
- Modal state: Zustand stores in feature hooks

## Environment Variables

Required environment variables (configure in `.env.local`):

```
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT=
NEXT_APPWRITE_KEY=

# Database Collection IDs
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=
NEXT_PUBLIC_APPWRITE_MEMBERS_ID=
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=
NEXT_PUBLIC_APPWRITE_TASKS_ID=
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=
NEXT_PUBLIC_APPWRITE_ACCOUNTS_ID=
NEXT_PUBLIC_APPWRITE_ORGANIZATIONS_ID=
NEXT_PUBLIC_APPWRITE_BUSINESS_UNITS_ID=
NEXT_PUBLIC_APPWRITE_FACILITIES_ID=
NEXT_PUBLIC_APPWRITE_DAILY_METRICS_ID=
NEXT_PUBLIC_APPWRITE_ALERTS_ID=

# App URL
NEXT_PUBLIC_APP_URL=
```

## API Routes

All API routes are handled through a single Hono catch-all route at `src/app/api/[[...route]]/route.ts`:

| Route | Feature |
|-------|---------|
| `/api/auth` | Authentication |
| `/api/members` | Member management |
| `/api/workspaces` | Workspace CRUD |
| `/api/projects` | Project management |
| `/api/tasks` | Task management |
| `/api/accounts` | Account management |
| `/api/organizations` | Organization data |
| `/api/daily_metrics` | Daily metrics data |
| `/api/alerts` | Alert management |

## Authentication

- Cookie-based sessions using Appwrite
- Auth cookie name: `supply-chain-guru-session` (defined in `features/auth/constants.ts`)
- Protected routes use `sessionMiddleware` from `lib/session-middleware.ts`
- Client-side auth state via `useQuery` with key `["current"]`

## Common Patterns

### Creating a New Feature

1. Create folder structure in `src/features/[feature-name]/`
2. Define types in `types.ts` and schemas in `schemas.ts`
3. Create Hono routes in `server/route.ts`
4. Register route in `src/app/api/[[...route]]/route.ts`
5. Create React Query hooks in `api/`
6. Build components in `components/`

### Adding a New Page

1. Create route folder in appropriate route group
2. Create `page.tsx` (server component)
3. If client-side logic needed, create `client.tsx` with `"use client"`
4. Import client component in `page.tsx`

### Adding UI Components

Use shadcn/ui CLI or manually add to `src/components/ui/`:
```bash
npx shadcn@latest add [component-name]
```

## Code Quality

- ESLint with Next.js and TypeScript rules
- `@typescript-eslint/no-explicit-any` is disabled
- ESLint is skipped during production builds (configured in `next.config.mjs`)
- TypeScript strict mode enabled

## Testing

No test framework is currently configured. When adding tests:
- Consider Jest + React Testing Library for unit tests
- Consider Playwright for E2E tests

## Notes for AI Assistants

1. **Always read before editing**: Understand the existing patterns before making changes
2. **Follow feature module pattern**: Keep related code colocated in feature folders
3. **Use existing utilities**: Leverage `cn()`, formatters from `lib/utils.ts`
4. **Maintain type safety**: Define proper TypeScript types, use Zod for runtime validation
5. **Keep components focused**: Prefer smaller, composable components
6. **Use React Query patterns**: Follow existing hook patterns for API interactions
7. **Respect the routing structure**: Use appropriate route groups `(auth)`, `(dashboard)`, `(standalone)`
8. **Data files are JSX**: Static data in `app/data/` exports JSX components
9. **Check for existing similar patterns**: Before implementing something new, search for existing implementations
