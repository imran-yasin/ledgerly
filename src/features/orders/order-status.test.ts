import { describe, expect, it } from "vitest";
import { deriveOrderStatus } from "./order-status";
import { OrderStatus } from "@/generated/prisma/enums";

const dueDate = new Date("2026-08-07T00:00:00.000Z");
const dayAfterDue = new Date("2026-08-08T00:01:00.000Z");

describe("deriveOrderStatus", () => {
  it("keeps a fully paid order paid after its due date", () => {
    expect(deriveOrderStatus({ totalCents: 20_000, paidCents: 20_000, dueDate, today: dayAfterDue })).toBe(OrderStatus.paid);
  });

  it("marks an incomplete balance overdue after the UTC due date", () => {
    expect(deriveOrderStatus({ totalCents: 20_000, paidCents: 10_000, dueDate, today: dayAfterDue })).toBe(OrderStatus.overdue);
  });

  it("changes from overdue to paid after a final payment", () => {
    expect(deriveOrderStatus({ totalCents: 20_000, paidCents: 10_000, dueDate, today: dayAfterDue })).toBe(OrderStatus.overdue);
    expect(deriveOrderStatus({ totalCents: 20_000, paidCents: 20_000, dueDate, today: dayAfterDue })).toBe(OrderStatus.paid);
  });

  it("treats the due date itself as not overdue", () => {
    expect(deriveOrderStatus({ totalCents: 20_000, paidCents: 0, dueDate, today: dueDate })).toBe(OrderStatus.pending);
  });
});
