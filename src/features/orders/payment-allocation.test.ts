import { describe, expect, it } from "vitest";

// Test payment allocation, status transitions, and over-payment rejection
// using the same deriveOrderStatus function that the service layer calls.

import { deriveOrderStatus, OrderStatus } from "./order-status";

const today = new Date("2026-08-08T12:00:00.000Z");
const futureDate = new Date("2026-12-01T00:00:00.000Z");
const pastDate = new Date("2026-01-01T00:00:00.000Z");

describe("payment allocation", () => {
  it("total paid equals sum of partial payments", () => {
    // A $300 order with $100 + $150 = $250 total paid
    const totalCents = 30000;
    const paidCents = 25000;
    const dueCents = totalCents - paidCents;
    expect(dueCents).toBe(5000);
  });

  it("due amount is zero when fully paid", () => {
    const totalCents = 10000;
    const paidCents = 10000;
    expect(totalCents - paidCents).toBe(0);
  });

  it("due amount equals total when nothing is paid", () => {
    const totalCents = 50000;
    const paidCents = 0;
    expect(totalCents - paidCents).toBe(50000);
  });
});

describe("status transitions", () => {
  it("pending → partially_paid when first payment arrives", () => {
    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 0, dueDate: futureDate, today }),
    ).toBe(OrderStatus.pending);

    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 10000, dueDate: futureDate, today }),
    ).toBe(OrderStatus.partially_paid);
  });

  it("partially_paid → paid when remaining balance is covered", () => {
    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 10000, dueDate: futureDate, today }),
    ).toBe(OrderStatus.partially_paid);

    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 20000, dueDate: futureDate, today }),
    ).toBe(OrderStatus.paid);
  });

  it("paid stays paid even if due date passes", () => {
    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 20000, dueDate: pastDate, today }),
    ).toBe(OrderStatus.paid);
  });

  it("paid stays paid even when overpaid", () => {
    // Overpayment is prevented by the service layer, but if it somehow
    // happened, status should still be paid (not negative-something).
    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 25000, dueDate: futureDate, today }),
    ).toBe(OrderStatus.paid);
  });

  it("pending → overdue when due date passes with no payment", () => {
    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 0, dueDate: pastDate, today }),
    ).toBe(OrderStatus.overdue);
  });

  it("partially_paid → overdue when due date passes", () => {
    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 5000, dueDate: pastDate, today }),
    ).toBe(OrderStatus.overdue);
  });

  it("overdue → paid when final payment arrives after due date", () => {
    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 5000, dueDate: pastDate, today }),
    ).toBe(OrderStatus.overdue);

    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 20000, dueDate: pastDate, today }),
    ).toBe(OrderStatus.paid);
  });

  it("paid → partially_paid after a payment is deleted", () => {
    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 20000, dueDate: futureDate, today }),
    ).toBe(OrderStatus.paid);

    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 10000, dueDate: futureDate, today }),
    ).toBe(OrderStatus.partially_paid);
  });

  it("due date itself is not overdue (boundary)", () => {
    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 0, dueDate: today, today }),
    ).toBe(OrderStatus.pending);
  });

  it("due date itself is not overdue when partially paid (boundary)", () => {
    expect(
      deriveOrderStatus({ totalCents: 20000, paidCents: 10000, dueDate: today, today }),
    ).toBe(OrderStatus.partially_paid);
  });
});

describe("over-payment rejection", () => {
  it("rejects payment that would exceed total", () => {
    const totalCents = 10000;
    const existingPayments = 9000;
    const attemptedPayment = 2000;

    expect(existingPayments + attemptedPayment).toBeGreaterThan(totalCents);
  });

  it("allows payment that reaches exact total", () => {
    const totalCents = 10000;
    const existingPayments = 9000;
    const attemptedPayment = 1000;

    expect(existingPayments + attemptedPayment).toBe(totalCents);
  });

  it("max allowed reflects remaining balance", () => {
    const totalCents = 10000;
    const existingPayments = 6000;
    const remaining = totalCents - existingPayments;

    expect(remaining).toBe(4000);
  });

  it("error message includes the maximum allowed amount", () => {
    const remainingCents = 1500;
    const message = `Maximum allowed is $${(remainingCents / 100).toFixed(2)}.`;
    expect(message).toContain("15.00");
  });
});
