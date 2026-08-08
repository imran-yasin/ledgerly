/**
 * Thrown when a payment would exceed the remaining balance on an order.
 * Carries the maximum number of cents the caller is still allowed to pay
 * so the API can surface an actionable error message.
 */
export class PaymentConflictError extends Error {
  constructor(readonly remainingCents: number) {
    super("Payment exceeds the remaining balance.");
  }
}
