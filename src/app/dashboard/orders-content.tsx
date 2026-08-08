"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { useOrders, type OrderDto } from "@/hooks";
import { formatMoney } from "@/lib/money";
import { DashboardFilters } from "./filters";
import { DeleteOrderButton } from "./delete-order-button";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const statusTooltips: Record<string, string> = {
  pending: "No payments have been recorded yet",
  partially_paid: "Some payments received, but not fully settled",
  paid: "All payments received — fully settled",
  overdue: "Past the due date and not fully paid",
};

export function OrdersContent() {
  const params = useSearchParams();
  const status = params.get("status") ?? undefined;
  const { data, isLoading, error } = useOrders({ status });
  const orders = data?.data ?? [];
  const total = data?.total ?? 0;
  const filtered = orders;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {filtered.length} order{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/orders/new">
            <Plus size={16} /> New order
          </Link>
        </Button>
      </div>

      <DashboardFilters current={status} />

      {error && (
        <div className="mt-10 text-center text-sm text-destructive">
          Failed to load orders. Please try again.
        </div>
      )}

      {isLoading ? (
        <Card className="mt-8">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 z-20 w-[170px] bg-card pl-6"><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead className="w-[180px]"><Skeleton className="h-4 w-32" /></TableHead>
                  <TableHead className="w-[130px]"><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead className="w-[110px] text-right"><Skeleton className="ml-auto h-4 w-16" /></TableHead>
                  <TableHead className="w-[110px] text-right"><Skeleton className="ml-auto h-4 w-16" /></TableHead>
                  <TableHead className="w-[110px] text-right"><Skeleton className="ml-auto h-4 w-16" /></TableHead>
                  <TableHead className="w-[120px] text-right"><Skeleton className="ml-auto h-4 w-20" /></TableHead>
                  <TableHead className="sticky right-0 z-20 w-[80px] bg-card pr-6" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4].map((i) => (
                  <TableRow key={i} className="group">
                    <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-muted/50 pl-6"><Skeleton className="h-4 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-44" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-20" /></TableCell>
                    <TableCell className="sticky right-0 z-10 bg-card group-hover:bg-muted/50 pr-6" />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            {status ? "No orders match this filter." : "No orders yet. Create your first one."}
          </p>
        </div>
      ) : (
        <Card className="mt-8">
          <CardContent className="p-0">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 z-20 w-[170px] bg-card pl-6">Customer</TableHead>
                  <TableHead className="w-[180px]">Description</TableHead>
                  <TableHead className="w-[130px]">Status</TableHead>
                  <TableHead className="w-[110px] text-right">Total</TableHead>
                  <TableHead className="w-[110px] text-right">Paid</TableHead>
                  <TableHead className="w-[110px] text-right">Due</TableHead>
                  <TableHead className="w-[120px] text-right">Due date</TableHead>
                  <TableHead className="sticky right-0 z-20 w-[80px] bg-card pr-6" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order: OrderDto) => (
                  <TableRow key={order.id} className="group">
                    <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-muted/50 pl-6 font-medium">
                      <Link href={`/orders/${order.id}`} className="text-primary hover:underline">
                        {order.customer}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-[160px]">
                      {order.lineItems?.[0]?.description ?? "\u2014"}
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span><StatusBadge status={order.status} /></span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{statusTooltips[order.status] ?? order.status}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatMoney(order.totalCents)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatMoney(order.paidCents)}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{formatMoney(order.dueCents)}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{order.dueDate}</TableCell>
                    <TableCell className="sticky right-0 z-10 bg-card group-hover:bg-muted/50 pr-6 text-right">
                      <DeleteOrderButton orderId={order.id} canDelete={order.paidCents === 0} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
