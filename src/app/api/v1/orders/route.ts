import { NextRequest } from "next/server";
import { apiError, validationError } from "@/lib/api/response";
import { requireUserId } from "@/lib/auth/session";
import { orderInputSchema, createOrder, listOrders } from "@/features/orders";

export async function GET(request: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return apiError(401, "UNAUTHORIZED", "Sign in to access orders.");

  const url = request.nextUrl;
  const status = url.searchParams.get("status") ?? undefined;
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20", 10) || 20));

  // Fetch everything so status filtering (derived, not stored) works before pagination.
  const orders = await listOrders(userId);
  const filtered = status ? orders.filter((o) => o.status === status) : orders;

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const paged = filtered.slice((page - 1) * limit, page * limit);

  return Response.json({ data: paged, total, page, limit, totalPages });
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) return apiError(401, "UNAUTHORIZED", "Sign in to create an order.");
  const parsed = orderInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error.flatten());
  const order = await createOrder(userId, parsed.data);
  return Response.json({ data: order }, { status: 201 });
}
