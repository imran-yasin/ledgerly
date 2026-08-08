import type { Order, OrderItem, Payment } from "@/generated/prisma/client";
import type { OrderInput } from "@/features/orders/order.schemas";
import { deriveOrderStatus } from "@/features/orders/order-status";

/**
 * Shared Prisma include clause used by every order read so that line items
 * and payments are always eager-loaded in a single round-trip. This
 * eliminates N+1 queries when mapping orders to their DTO shape.
 */
export const orderDetail = {
  include: {
    lineItems: true,
    payments: { orderBy: { paidAt: "desc" as const } },
  },
};

/** The raw database shape of an order after eager-loading its relations. */
export type StoredOrder = Order & { lineItems: OrderItem[]; payments: Payment[] };

/**
 * Computes the order total from validated line items.
 *
 * All math is integer cents so there is no floating-point drift.
 */
export function totalFrom(input: OrderInput) {
  return input.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0);
}

/**
 * Converts a persisted order (with eager-loaded relations) into the API
 * response shape. Balances and the derived status are calculated here
 * rather than stored, which keeps them correct across payment changes.
 */
export function toOrderDto(order: StoredOrder) {
  const paidCents = order.payments.reduce((sum, p) => sum + p.amountCents, 0);

  return {
    id: order.id,
    customer: order.customer,
    dueDate: order.dueDate.toISOString().slice(0, 10),
    totalCents: order.totalCents,
    paidCents,
    dueCents: order.totalCents - paidCents,
    status: deriveOrderStatus({ totalCents: order.totalCents, paidCents, dueDate: order.dueDate }),
    createdAt: order.createdAt.toISOString(),
    lineItems: order.lineItems.map((item) => ({ ...item })),
    payments: order.payments.map((p) => ({
      ...p,
      paidAt: p.paidAt.toISOString().slice(0, 10),
      createdAt: p.createdAt.toISOString(),
    })),
  };
}
