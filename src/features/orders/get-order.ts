import "server-only";
import { toOrderDto, orderDetail } from "@/features/orders/order-dto";
import { prisma } from "@/lib/db/prisma";

/**
 * Returns a single order owned by the requesting user, including all line
 * items and payments in a single query. Returns `null` when the order does
 * not exist or belongs to a different user — the caller sees the same
 * result either way to avoid leaking ownership information.
 */
export async function getOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    ...orderDetail,
  });

  return order ? toOrderDto(order) : null;
}
