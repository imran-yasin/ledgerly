import { apiError } from "@/lib/api/response";
import { requireUserId } from "@/lib/auth/session";
import { deletePayment } from "@/features/payments";

export async function DELETE(_: Request, { params }: { params: Promise<{ orderId: string; paymentId: string }> }) {
  const userId = await requireUserId();
  if (!userId) return apiError(401, "UNAUTHORIZED", "Sign in to delete a payment.");
  const { orderId, paymentId } = await params;
  const deleted = await deletePayment(userId, orderId, paymentId);
  if (!deleted) return apiError(404, "PAYMENT_NOT_FOUND", "This payment does not exist or is not available to you.");
  return new Response(null, { status: 204 });
}
