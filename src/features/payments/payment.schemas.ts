import { z } from "zod";

/** Validated shape for recording a payment against an order. */
export const paymentInputSchema = z.object({
  amountCents: z.number().int().min(1).max(100_000_000),
  paidAt: z.string().date(),
  note: z.string().trim().max(1_000).optional(),
});

export type PaymentInput = z.infer<typeof paymentInputSchema>;
