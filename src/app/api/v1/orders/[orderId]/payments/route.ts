import { apiError, validationError } from "@/lib/api/response";
import { requireUserId } from "@/lib/auth/session";
import { paymentInputSchema, recordPayment, PaymentConflictError } from "@/features/payments";

export async function POST(request: Request, { params }: RouteContext<"/api/v1/orders/[orderId]/payments">) {
  const userId = await requireUserId();
  if (!userId) return apiError(401, "UNAUTHORIZED", "Sign in to record a payment.");
  const parsed = paymentInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error.flatten());
  const { orderId } = await params;
  try {
    const payment = await recordPayment(userId, orderId, parsed.data);
    if (!payment) return apiError(404, "ORDER_NOT_FOUND", "This order does not exist or is not available to you.");
    return Response.json(
      {
        data: { ...payment, paidAt: payment.paidAt.toISOString().slice(0, 10), createdAt: payment.createdAt.toISOString() },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof PaymentConflictError) return apiError(409, "PAYMENT_EXCEEDS_BALANCE", error.message, { maxAllowedCents: error.remainingCents });
    throw error;
  }
}
