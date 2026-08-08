import "server-only";
import { prisma } from "@/lib/db/prisma";

/**
 * Deletes a payment that belongs to an order owned by the calling user.
 * Because the order status is derived at read time rather than stored,
 * the corrected balance appears automatically on the next read without
 * any additional work.
 *
 * @returns `true` when the payment was deleted, `false` when the order
 *          or payment does not exist or belongs to a different user.
 */
export async function deletePayment(userId: string, orderId: string, paymentId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id: orderId, userId },
      select: { id: true },
    });
    if (!order) return false;

    const payment = await tx.payment.findFirst({
      where: { id: paymentId, orderId },
      select: { id: true },
    });
    if (!payment) return false;

    await tx.payment.delete({ where: { id: payment.id } });
    return true;
  });
}
