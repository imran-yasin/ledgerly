import { OrderStatus } from "@/generated/prisma/enums";

export { OrderStatus };

/**
 * Derives the current settlement status from the payment balance and UTC due date.
 *
 * Status is intentionally computed at read time rather than persisted. This
 * guarantees correctness after a payment is deleted and removes the need for
 * a background job to mark orders overdue at midnight.
 *
 * Priority: `paid` > `overdue` > `partially_paid` > `pending`.
 * A fully-settled order is always `paid`, even if the due date has passed.
 */
export function deriveOrderStatus({
  totalCents,
  paidCents,
  dueDate,
  today = new Date(),
}: {
  totalCents: number;
  paidCents: number;
  dueDate: Date;
  today?: Date;
}): OrderStatus {
  if (paidCents >= totalCents) return OrderStatus.paid;

  const dueDay = Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());
  const currentDay = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

  if (dueDay < currentDay) return OrderStatus.overdue;
  return paidCents > 0 ? OrderStatus.partially_paid : OrderStatus.pending;
}
