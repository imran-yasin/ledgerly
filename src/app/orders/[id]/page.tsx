import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { requireUserId } from "@/lib/auth/session";
import { getQueryClient } from "@/lib/query-client";
import { getOrder } from "@/features/orders";
import { ErrorBoundary } from "@/components/error-boundary";
import { OrderDetailContent } from "./order-content";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const { id } = await params;

  const order = await getOrder(userId, id);
  const queryClient = getQueryClient();

  if (order) {
    queryClient.setQueryData(["orders", id], { data: order });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary>
        <OrderDetailContent orderId={id} />
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
