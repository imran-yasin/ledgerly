import "server-only";
import type { OrderInput } from "@/features/orders/order.schemas";
import { toOrderDto, orderDetail, totalFrom } from "@/features/orders/order-dto";
import { prisma } from "@/lib/db/prisma";

/**
 * Creates an order and its line items in a single atomic write for the
 * authenticated user. The total is calculated server-side from the
 * submitted line items — the client never sends a total.
 */
export async function createOrder(userId: string, input: OrderInput) {
  const totalCents = totalFrom(input);

  const order = await prisma.order.create({
    data: {
      userId,
      customer: input.customer,
      dueDate: new Date(`${input.dueDate}T00:00:00.000Z`),
      totalCents,
      lineItems: { create: input.lineItems },
    },
    ...orderDetail,
  });

  return toOrderDto(order);
}
