"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateOrder } from "./use-orders";

interface LineItem {
  description: string;
  quantity: number;
  unitPriceDollars: string;
}

export function useOrderForm() {
  const router = useRouter();
  const createOrder = useCreateOrder();
  const [customer, setCustomer] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<LineItem[]>([{ description: "", quantity: 1, unitPriceDollars: "" }]);
  const [error, setError] = useState("");

  function updateItem(idx: number, field: keyof LineItem, value: string | number) {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: 1, unitPriceDollars: "" }]);
  }

  function removeItem(idx: number) {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  const total = items.reduce((sum, item) => {
    const qty = item.quantity || 0;
    const price = parseFloat(item.unitPriceDollars) || 0;
    return sum + qty * price;
  }, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }
    if (total <= 0) {
      setError("Order total must be greater than $0.00.");
      return;
    }
    const lineItems = items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPriceCents: Math.round((parseFloat(item.unitPriceDollars) || 0) * 100),
    }));
    createOrder.mutate(
      { customer, dueDate, lineItems },
      {
        onSuccess: (data) => router.push(`/orders/${data.data.id}`),
        onError: (err) => setError(err.message),
      },
    );
  }

  return {
    customer,
    setCustomer,
    dueDate,
    setDueDate,
    items,
    updateItem,
    addItem,
    removeItem,
    total,
    error,
    loading: createOrder.isPending,
    handleSubmit,
  };
}
