# Orders & Settlements — Implementation Plan

## Goal

Deliver a secure, deployed orders-and-settlements application with a clear REST API. The implementation prioritizes correctness for money and payments, a maintainable Next.js architecture, and a refined light/dark interface.

## Technology decisions

- Next.js App Router with strict TypeScript
- Prisma ORM with Prisma Postgres
- Auth.js Credentials Provider with Argon2id password hashes and JWT sessions
- TanStack React Query for server-state caching with SSR hydration
- Tailwind CSS, shadcn/ui primitives, Geist font, and Sonner toasts
- Zod for request and form validation
- Axios for client-side HTTP
- Vitest for domain/API tests

## Product rules

- Amounts are integer cents everywhere; floating-point currency is prohibited.
- An order total is calculated server-side from its line items.
- Status precedence is `paid`, then `overdue`, then `partially_paid`, then `pending`.
- An order becomes read-only after its first payment; update/delete return an actionable `409` response.
- Payment creation occurs in a `Serializable` isolation transaction and never permits payment total to exceed the order total.
- Every read and mutation is scoped to the authenticated owner.
- Status is derived at read time, not persisted — eliminates stale status and the need for a background job.

## Phases

- [x] 1. Record architecture decisions and delivery plan.
- [x] 2. Scaffold Next.js, linting, UI foundation, Prisma, and Auth.js.
- [x] 3. Implement domain types, schemas, migrations, and transactional REST endpoints.
- [x] 4. Implement dashboard, order form/detail flows, theme handling, toasts, and payment UI.
- [x] 5. Add tests (status + payment allocation), migrations, documentation, and deployment configuration.
- [x] 6. Full build and browser verification for the documented sample scenario.

## Directory boundaries

```text
src/app/                 routes, layouts, API route handlers
src/components/          presentational and composed UI
src/features/orders/     order contracts, domain rules, per-function service files
src/features/payments/   payment contracts, domain rules, per-function service files
src/hooks/               React Query hooks, form hooks (logic extracted from JSX)
src/lib/auth/            Auth.js configuration and session helpers
src/lib/db/              Prisma client only
src/lib/                 cross-cutting utilities: money, rate-limit, API responses
src/types/               app-wide framework-independent types
docs/                    API, architecture, decisions, and verification notes
prisma/                  schema, migrations, and seed data
```
