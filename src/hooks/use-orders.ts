"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface OrderDto {
  id: string;
  customer: string;
  dueDate: string;
  totalCents: number;
  paidCents: number;
  dueCents: number;
  status: string;
  createdAt: string;
  lineItems: { id: string; description: string; quantity: number; unitPriceCents: number }[];
  payments: { id: string; amountCents: number; paidAt: string; note?: string; createdAt: string }[];
}

interface PaginatedOrders {
  data: OrderDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useOrders({ status, page = 1, limit = 20 }: { status?: string; page?: number; limit?: number } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  params.set("page", String(page));
  params.set("limit", String(limit));

  return useQuery({
    queryKey: ["orders", { status, page, limit }],
    queryFn: () => axios.get<PaginatedOrders>(`/api/v1/orders?${params.toString()}`).then((r) => r.data),
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => axios.get<{ data: OrderDto }>(`/api/v1/orders/${orderId}`).then((r) => r.data),
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: unknown) => axios.post("/api/v1/orders", body).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useRecordPayment(orderId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { amountCents: number; paidAt: string; note?: string }) =>
      axios.post(`/api/v1/orders/${orderId}/payments`, body).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useDeletePayment(orderId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => axios.delete(`/api/v1/orders/${orderId}/payments/${paymentId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => axios.delete(`/api/v1/orders/${orderId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}
