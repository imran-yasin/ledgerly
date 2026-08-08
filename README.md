# Orders & Settlements

A web application for creating orders with line items, recording partial payments, and tracking settlement status. Built with Next.js 16, PostgreSQL, and Auth.js.

## Live URL

`[DEPLOYED_URL_HERE]`

## Prerequisites

- Node.js 20+
- PostgreSQL database (or Supabase project)
- A Supabase project (free tier works)

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> && cd crossval
npm install

# 2. Set environment variables
cp .env.example .env
# Fill in DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL

# 3. Run migrations
npx prisma migrate dev

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (pooled URL for app runtime) |
| `AUTH_SECRET` | NextAuth secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |

For Supabase, use the **session pooler** URL for migrations (port 5432) and the **transaction pooler** URL for the app runtime (port 6543). See `.env.example`.

## API Overview

All endpoints return `{ "data": ... }` on success or `{ "error": { "code", "message", "details" } }` on failure.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create account (`email`, `password`) |
| `POST` | `/api/auth/[...nextauth]` | Sign in (NextAuth credentials) |
| `GET` | `/api/v1/orders` | List own orders. Query: `?status=pending` |
| `POST` | `/api/v1/orders` | Create order with line items |
| `GET` | `/api/v1/orders/:id` | Get order detail |
| `PATCH` | `/api/v1/orders/:id` | Update unpaid order (locked after first payment) |
| `DELETE` | `/api/v1/orders/:id` | Delete unpaid order |
| `POST` | `/api/v1/orders/:id/payments` | Record payment |
| `DELETE` | `/api/v1/orders/:id/payments/:pid` | Delete payment |

### Create Order

```json
{
  "customer": "Acme Corp",
  "dueDate": "2026-09-15",
  "lineItems": [
    { "description": "Consulting", "quantity": 10, "unitPriceCents": 15000 }
  ]
}
```

### Record Payment

```json
{
  "amountCents": 40000,
  "paidAt": "2026-08-08",
  "note": "Bank transfer"
}
```

Returns `409 PAYMENT_EXCEEDS_BALANCE` with `details.maxAllowedCents` on overpayment.

## Order Status

Status is **derived at read time** from the payment balance and due date. It is never stored.

| Status | Condition |
|---|---|
| `paid` | Total payments ≥ order total (always takes precedence) |
| `overdue` | Past due date AND not fully paid |
| `partially_paid` | Some payments recorded but not fully paid |
| `pending` | No payments recorded |

**Edge case decision:** A fully-paid order is always `paid` regardless of the due date. If an overdue order receives its final payment, the status immediately becomes `paid`. No background job is needed — the status is recomputed on every read.

## Architecture Decisions

### Money as Integer Cents

All monetary values are stored and computed as integer cents. No floats touch money paths. Formatting to currency display happens only at the presentation layer.

### Status is Derived, Not Stored

Status is computed on every read from the order's payment total and the current UTC date. This means:
- No stale status values after a payment is deleted
- No background job needed to mark orders overdue at midnight
- The `paid` precedence over `overdue` is handled by check order in the derivation function

### Row Locking for Payment Integrity

Recording or deleting a payment uses `SELECT ... FOR UPDATE` on the order row inside a database transaction. This serializes concurrent writes to the same order:

1. Lock the order row
2. Aggregate existing payments
3. Check the remaining balance
4. Insert or delete the payment

Even if two requests arrive at the exact same moment, the database ensures they execute sequentially. The second one sees the updated balance and correctly rejects any overpayment.

### Orders Become Read-Only After First Payment

Once a payment exists, the order's total cannot change. This prevents a revised total from falling below money already collected. The API returns `409 ORDER_LOCKED` with a hint to create a replacement order instead.

### Database CHECK Constraints

In addition to application-level validation (Zod schemas + service layer), the database enforces:
- `totalCents > 0`
- `quantity >= 1`
- `unitPriceCents >= 0`
- `amountCents > 0`

These act as a second line of defense against bugs and operator errors.

## Assumptions & Tradeoffs

- **No order-level tax or discount**: The spec states the order total equals the subtotal.
- **No invoices or accounting integration**: This is a focused orders-and-payments tool, not a full accounting system.
- **Dates are UTC calendar-date comparisons**: Status derivation compares dates only (not times), using UTC to avoid timezone ambiguity.
- **Password minimum 12 characters** for registration, 8 for login (Auth.js Credentials provider).
- **NextAuth v4 with JWT sessions**: Chosen for simplicity. v5 (Auth.js) would work but v4 has more established App Router patterns.

## What I Would Improve Before Production

1. **Email verification** — Add email confirmation flows, password reset, and rate limiting on auth endpoints.
2. **Idempotency keys** — Add idempotency keys on payment creation to safely retry failed requests without double-charging.
3. **Audit log** — Track all mutations (order created, payment recorded, payment deleted) with timestamps and user IDs for compliance.
4. **API versioning and pagination** — The current list endpoint returns all orders. Add cursor-based pagination for large datasets.
5. **Soft deletes** — Consider soft-deleting orders and payments instead of hard deletes to preserve financial history.
6. **CSV export** — Add a date-range export endpoint for orders.
7. **Playwright E2E tests** — Add browser-level tests for the full user flow (register → create order → pay → verify status).
8. **Observability** — Add structured logging, error tracking (Sentry), and performance monitoring.
9. **Database migrations in CI/CD** — Automate migration application in the deployment pipeline.

## Running Tests

```bash
npm test          # Unit tests (Vitest)
npx prisma studio # Browse database
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: NextAuth v4 (Credentials provider, Argon2id hashing)
- **Validation**: Zod
- **State**: TanStack React Query (server-state caching with SSR prefetching)
- **UI**: Tailwind CSS, shadcn/ui, Lucide icons, Sonner toasts
- **Testing**: Vitest

## Project Structure

```
src/
├── app/                    # Next.js routes and pages
│   ├── api/v1/orders/      # REST API
│   ├── login/              # Sign-in page
│   ├── register/           # Sign-up page
│   ├── dashboard/          # Orders list
│   └── orders/[id]/        # Order detail
├── features/
│   ├── orders/             # Order schemas, service, status logic
│   └── payments/           # Payment schemas, service
├── hooks/
│   └── use-orders.ts       # React Query hooks
├── components/
│   ├── ui/                 # shadcn components
│   ├── status-badge.tsx    # Colored status chip
│   └── date-picker.tsx     # Calendar date picker
├── lib/
│   ├── db/prisma.ts        # Prisma client singleton
│   ├── auth/               # NextAuth configuration
│   ├── money.ts            # Integer-cents utilities
│   └── api/response.ts     # API response helpers
└── generated/prisma/       # Generated Prisma client
```
