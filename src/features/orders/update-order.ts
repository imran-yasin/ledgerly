import "server-only";
import type { OrderInput } from "@/features/orders/order.schemas";
import { OrderLockedError } from "@/features/orders/order-locked-error";
import { toOrderDto, orderDetail, totalFrom } from "@/features/orders/order-dto";
import { prisma } from "@/lib/db/prisma";

/**
 * Replaces the editable fields and line items of an order that has not yet
 * received any payments. Throws {@link OrderLockedError} if payments exist
 * so the order total can never drop below money already collected.
 *
 * Returns `null` when the calling user does not own the order.
 */
export async function updateOrder(userId: string, orderId: string, input: OrderInput) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.order.findFirst({ where: { id: orderId, userId } });
    if (!existing) return null;

    const paymentCount = await tx.payment.count({ where: { orderId } });
    if (paymentCount > 0) throw new OrderLockedError();

    const order = await tx.order.update({
      where: { id: orderId },
      data: {
        customer: input.customer,
        dueDate: new Date(`${input.dueDate}T00:00:00.000Z`),
        totalCents: totalFrom(input),
        lineItems: { deleteMany: {}, create: input.lineItems },
      },
      ...orderDetail,
    });

    return toOrderDto(order);
  });
}
