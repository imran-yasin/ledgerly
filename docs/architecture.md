# Architecture

The application uses Next.js App Router. Layouts and API route handlers are Server Components; interactive UI (forms, tables, dialogs) are Client Components. Server Components prefetch data into TanStack React Query via `HydrationBoundary`, so the first render is always populated — no skeleton flash on cached data.

`src/features/orders` and `src/features/payments` hold contracts and business rules in per-function files, exported through a single barrel index. `src/lib/db` is the only place that initializes Prisma. `src/hooks` contains all client-side logic (React Query hooks for data fetching and caching, form hooks for state management) extracted from JSX components.

API handlers authenticate first, validate with Zod, invoke a feature service, and return a stable `{ data }` / `{ error: { code, message, details } }` response envelope.

## Payment integrity

Money is integer cents. Recording a payment starts a `Serializable` isolation transaction, aggregates existing payments, checks the remaining amount, then inserts the payment. This serializes concurrent writes to the same order and makes over-payment impossible through the API.

Database `CHECK` constraints (`totalCents > 0`, `quantity >= 1`, `unitPriceCents >= 0`, `amountCents > 0`) provide a second line of defense against bugs and operator errors.

## Status and edits

Status is never persisted. It is derived on every read from the payment total and a UTC calendar-date comparison; `paid` takes precedence over `overdue`. An order with one or more payments is locked against edits and deletion, preventing a revised total from falling below money already collected. Deleting a payment automatically corrects the status on the next read — no additional work required.

## Authorization

Auth.js Credentials sessions carry the user id. Every order read and payment write filters by that id; record ownership is never inferred from a client-provided field. Registration is rate-limited (5 attempts per IP per minute).

## Client-state caching

TanStack React Query with 30-second stale time and SSR hydration provides zero-loading navigation between pages. Mutations (create order, record payment, delete) invalidate the `["orders"]` query key so the dashboard and detail page always reflect the latest state without a full page reload.
