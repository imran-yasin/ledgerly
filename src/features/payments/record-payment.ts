import "server-only";
import type { PaymentInput } from "@/features/payments/payment.schemas";
import { PaymentConflictError } from "@/features/payments/payment-conflict-error";
import { prisma } from "@/lib/db/prisma";

/**
 * Records a payment for the given order under `Serializable` isolation so
 * two concurrent requests cannot both read the same remaining balance and
 * overpay. If the requested amount would push the order past its total the
 * call throws {@link PaymentConflictError} with the remaining allowance.
 *
 * @returns the created payment, or `null` when the order does not exist
 *          or belongs to a different user.
 */
export async function recordPayment(userId: string, orderId: string, input: PaymentInput) {
  return prisma.$transaction(
    async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, userId },
        select: { id: true, totalCents: true },
      });
      if (!order) return null;

      const aggregate = await tx.payment.aggregate({
        where: { orderId },
        _sum: { amountCents: true },
      });

      const paidSoFar = aggregate._sum.amountCents ?? 0;
      const remainingCents = order.totalCents - paidSoFar;

      if (input.amountCents > remainingCents) {
        throw new PaymentConflictError(remainingCents);
      }

      return tx.payment.create({
        data: {
          orderId,
          amountCents: input.amountCents,
          paidAt: new Date(`${input.paidAt}T00:00:00.000Z`),
          note: input.note || null,
        },
      });
    },
    { isolationLevel: "Serializable" },
  );
}
