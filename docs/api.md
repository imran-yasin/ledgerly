# REST API

All routes return `{ "data": ... }` on success or `{ "error": { "code", "message", "details" } }` on failure.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a local account |
| `GET` | `/api/v1/orders` | List the signed-in user's orders |
| `POST` | `/api/v1/orders` | Create an order and its line items |
| `GET` | `/api/v1/orders/:orderId` | Get a single owned order |
| `PATCH` | `/api/v1/orders/:orderId` | Update an unpaid order |
| `DELETE` | `/api/v1/orders/:orderId` | Delete an unpaid order |
| `POST` | `/api/v1/orders/:orderId/payments` | Record a payment |
| `DELETE` | `/api/v1/orders/:orderId/payments/:paymentId` | Delete a payment |

`POST /api/v1/orders/:orderId/payments` accepts `{ amountCents, paidAt, note? }`. If it would exceed the balance, it returns `409 PAYMENT_EXCEEDS_BALANCE` with `details.maxAllowedCents`.

Order changes after the first payment return `409 ORDER_LOCKED`. Deleting a payment is transactional; because status is derived rather than stored, the corrected status appears on the next order read.
