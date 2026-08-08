import "server-only";
import { OrderLockedError } from "@/features/orders/order-locked-error";
import { prisma } from "@/lib/db/prisma";

/**
 * Hard-deletes an unpaid order belonging to the calling user. Orders that
 * have received at least one payment are preserved for financial history
 * and throw {@link OrderLockedError} instead.
 *
 * @returns `true` when the order was deleted, `false` when it does not exist
 *          or does not belong to the user.
 */
export async function deleteOrder(userId: string, orderId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.order.findFirst({ where: { id: orderId, userId } });
    if (!existing) return false;

    const paymentCount = await tx.payment.count({ where: { orderId } });
    if (paymentCount > 0) throw new OrderLockedError();

    await tx.order.delete({ where: { id: orderId } });
    return true;
  });
}
