import { z } from "zod";

/** A single billable entry within an order. */
export const lineItemSchema = z.object({
  description: z.string().trim().min(1).max(160),
  quantity: z.number().int().min(1).max(1_000_000),
  unitPriceCents: z.number().int().min(0).max(100_000_000),
});

/** Validated shape for creating or updating an order. */
export const orderInputSchema = z.object({
  customer: z.string().trim().min(1).max(120),
  dueDate: z.string().date(),
  lineItems: z.array(lineItemSchema).min(1).max(100),
});

export type OrderInput = z.infer<typeof orderInputSchema>;
