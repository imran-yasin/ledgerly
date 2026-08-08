import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { requireUserId } from "@/lib/auth/session";
import { getQueryClient } from "@/lib/query-client";
import { listOrders } from "@/features/orders";
import { ErrorBoundary } from "@/components/error-boundary";
import { OrdersContent } from "./orders-content";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const { status, page: pageStr, limit: limitStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(limitStr ?? "20", 10) || 20));

  const queryClient = getQueryClient();
  const allOrders = await listOrders(userId);
  const filtered = status ? allOrders.filter((o) => o.status === status) : allOrders;
  // Client-side pagination for the prefetched filtered set
  const paged = filtered.slice((page - 1) * limit, page * limit);

  queryClient.setQueryData(["orders", { status: status ?? undefined, page, limit }], {
    data: paged,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary>
        <OrdersContent />
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
