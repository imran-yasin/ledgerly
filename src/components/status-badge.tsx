import { cn } from "@/lib/utils";
import { OrderStatus } from "@/generated/prisma/enums";

const styles: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  [OrderStatus.partially_paid]: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  [OrderStatus.paid]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  [OrderStatus.overdue]: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

const labels: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "Pending",
  [OrderStatus.partially_paid]: "Partially Paid",
  [OrderStatus.paid]: "Paid",
  [OrderStatus.overdue]: "Overdue",
};

export function StatusBadge({ status }: { status: string }) {
  const key = status as OrderStatus;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", styles[key] ?? styles[OrderStatus.pending])}>
      {labels[key] ?? status}
    </span>
  );
}
