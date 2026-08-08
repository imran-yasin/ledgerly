"use client";

import { useState } from "react";
import { useRecordPayment } from "./use-orders";
import { toast } from "sonner";

export function usePaymentForm(orderId: string, maxCents: number) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const recordPayment = useRecordPayment(orderId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const amountCents = Math.round((parseFloat(amount) || 0) * 100);
    if (amountCents <= 0) {
      setError("Enter a positive amount.");
      return;
    }
    if (amountCents > maxCents) {
      setError(`Maximum allowed is $${(maxCents / 100).toFixed(2)}.`);
      return;
    }
    if (!paidAt) {
      setError("Select a payment date.");
      return;
    }
    recordPayment.mutate(
      { amountCents, paidAt, note: note || undefined },
      {
        onSuccess: () => {
          setAmount("");
          setNote("");
          toast.success("Payment recorded");
        },
        onError: (err) => setError(err.message),
      },
    );
  }

  return {
    amount,
    setAmount,
    note,
    setNote,
    paidAt,
    setPaidAt,
    error,
    loading: recordPayment.isPending,
    handleSubmit,
    maxCents,
  };
}
