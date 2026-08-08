import { apiError, validationError } from "@/lib/api/response";
import { requireUserId } from "@/lib/auth/session";
import { orderInputSchema, getOrder, deleteOrder, updateOrder, OrderLockedError } from "@/features/orders";

export async function GET(_: Request, { params }: RouteContext<"/api/v1/orders/[orderId]">) {
  const userId = await requireUserId();
  if (!userId) return apiError(401, "UNAUTHORIZED", "Sign in to access this order.");
  const { orderId } = await params;
  const order = await getOrder(userId, orderId);
  if (!order) return apiError(404, "ORDER_NOT_FOUND", "This order does not exist or is not available to you.");
  return Response.json({ data: order });
}

export async function PATCH(request: Request, { params }: RouteContext<"/api/v1/orders/[orderId]">) {
  const userId = await requireUserId();
  if (!userId) return apiError(401, "UNAUTHORIZED", "Sign in to update this order.");
  const parsed = orderInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error.flatten());
  try {
    const order = await updateOrder(userId, (await params).orderId, parsed.data);
    if (!order) return apiError(404, "ORDER_NOT_FOUND", "This order does not exist or is not available to you.");
    return Response.json({ data: order });
  } catch (error) {
    if (error instanceof OrderLockedError) return apiError(409, "ORDER_LOCKED", error.message, { hint: "Create a replacement order instead." });
    throw error;
  }
}

export async function DELETE(_: Request, { params }: RouteContext<"/api/v1/orders/[orderId]">) {
  const userId = await requireUserId();
  if (!userId) return apiError(401, "UNAUTHORIZED", "Sign in to delete this order.");
  try {
    const deleted = await deleteOrder(userId, (await params).orderId);
    if (!deleted) return apiError(404, "ORDER_NOT_FOUND", "This order does not exist or is not available to you.");
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof OrderLockedError) return apiError(409, "ORDER_LOCKED", error.message, { hint: "Paid orders are retained for financial history." });
    throw error;
  }
}
