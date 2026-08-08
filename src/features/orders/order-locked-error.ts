/**
 * Thrown when attempting to modify or delete an order that already has one
 * or more recorded payments. Orders become read-only after the first payment
 * to prevent the order total from falling below the amount already collected.
 */
export class OrderLockedError extends Error {
  constructor() {
    super("Orders with recorded payments are read-only.");
  }
}
