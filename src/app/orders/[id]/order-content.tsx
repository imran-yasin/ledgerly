"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useOrder, type OrderDto } from "@/hooks";
import { formatMoney } from "@/lib/money";
import { PaymentForm } from "./payment-form";
import { DeletePaymentButton } from "./delete-payment-button";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusTooltips: Record<string, string> = {
  pending: "No payments have been recorded yet",
  partially_paid: "Some payments received, but not fully settled",
  paid: "All payments received — fully settled",
  overdue: "Past the due date and not fully paid",
};

export function OrderDetailContent({ orderId }: { orderId: string }) {
  const { data, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-12">
        <Skeleton className="h-4 w-24 sm:w-28" />
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Skeleton className="h-9 w-36 sm:w-52" />
            <Skeleton className="mt-2 h-4 w-24 sm:w-36" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full sm:w-28" />
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
          <div className="space-y-8">
            <Card>
              <CardHeader><Skeleton className="h-5 w-24 sm:w-28" /></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6"><Skeleton className="h-4 w-16 sm:w-20" /></TableHead>
                      <TableHead className="w-[80px] text-right"><Skeleton className="ml-auto h-4 w-6 sm:w-8" /></TableHead>
                      <TableHead className="w-[120px] text-right"><Skeleton className="ml-auto h-4 w-12 sm:w-16" /></TableHead>
                      <TableHead className="w-[120px] pr-6 text-right"><Skeleton className="ml-auto h-4 w-12 sm:w-16" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2].map((i) => (
                      <TableRow key={i}>
                        <TableCell className="pl-6"><Skeleton className="h-4 w-32 sm:w-44" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-6 sm:w-8" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-12 sm:w-16" /></TableCell>
                        <TableCell className="pr-6 text-right"><Skeleton className="ml-auto h-4 w-12 sm:w-16" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><Skeleton className="h-5 w-28 sm:w-36" /></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="pl-6"><Skeleton className="h-4 w-20 sm:w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-12 sm:w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28 sm:w-36" /></TableCell>
                      <TableCell className="w-[60px] pr-6" />
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <aside className="space-y-8">
            <Card>
              <CardHeader className="pb-4"><Skeleton className="h-4 w-16 sm:w-20" /></CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-28 sm:w-36" />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Skeleton className="h-[72px] rounded-xl" />
                  <Skeleton className="h-[72px] rounded-xl" />
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    );
  }

  if (error || !data?.data) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-20 text-center sm:px-8 lg:px-12">
        <p className="text-muted-foreground">Order not found.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-primary hover:underline">Back to orders</Link>
      </main>
    );
  }

  const order: OrderDto = data.data;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={14} /> Back to orders
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{order.customer}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Due {order.dueDate}</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <span><StatusBadge status={order.status} /></span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{statusTooltips[order.status] ?? order.status}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Line items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Description</TableHead>
                    <TableHead className="w-[80px] text-right">Qty</TableHead>
                    <TableHead className="w-[120px] text-right">Unit price</TableHead>
                    <TableHead className="w-[120px] pr-6 text-right">Line total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="pl-6">{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatMoney(item.unitPriceCents)}</TableCell>
                      <TableCell className="pr-6 text-right tabular-nums">{formatMoney(item.quantity * item.unitPriceCents)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Payment history</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {order.payments.length === 0 ? (
                <p className="px-6 pb-6 text-sm text-muted-foreground">No payments recorded yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Date</TableHead>
                      <TableHead className="w-[120px] text-right">Amount</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead className="w-[60px] pr-6" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="pl-6 tabular-nums">{payment.paidAt}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatMoney(payment.amountCents)}</TableCell>
                        <TableCell className="text-muted-foreground">{payment.note || "\u2014"}</TableCell>
                        <TableCell className="pr-6 text-right">
                          <DeletePaymentButton orderId={order.id} paymentId={payment.id} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-8">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold tabular-nums tracking-tight">{formatMoney(order.totalCents)}</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="text-xs font-medium text-muted-foreground">Paid</p>
                  <p className="mt-1.5 text-xl font-semibold tabular-nums">{formatMoney(order.paidCents)}</p>
                </div>
                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="text-xs font-medium text-muted-foreground">Due</p>
                  <p className="mt-1.5 text-xl font-semibold tabular-nums">{formatMoney(order.dueCents)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.status !== "paid" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Record payment</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentForm orderId={order.id} maxCents={order.dueCents} />
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </main>
  );
}
