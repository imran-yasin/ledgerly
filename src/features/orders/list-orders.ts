import "server-only";
import { toOrderDto, orderDetail } from "@/features/orders/order-dto";
import { prisma } from "@/lib/db/prisma";

/**
 * Returns every order belonging to the authenticated user, ordered by
 * due date ascending. Line items and payments are eager-loaded through
 * the shared {@link orderDetail} include clause so no additional queries
 * are issued when the rows are mapped to DTOs.
 *
 * For high-volume accounts use {@link listOrdersPaginated} instead.
 */
export async function listOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { dueDate: "asc" },
    ...orderDetail,
  });

  return orders.map(toOrderDto);
}

/**
 * Returns a paginated slice of the user's orders along with a total count.
 * Uses a single `findMany` + `count` within the same request scope so
 * there are exactly two queries regardless of result size — no N+1.
 */
export async function listOrdersPaginated(
  userId: string,
  { page = 1, limit = 20 }: { page?: number; limit?: number } = {},
) {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { dueDate: "asc" },
      skip,
      take: limit,
      ...orderDetail,
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  return {
    data: orders.map(toOrderDto),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
