"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const STATUSES = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "partially_paid", label: "Partially Paid" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

export function DashboardFilters({ current }: { current?: string }) {
  const router = useRouter();
  const params = useSearchParams();

  function setStatus(value: string) {
    const next = new URLSearchParams(params);
    if (value) {
      next.set("status", value);
    } else {
      next.delete("status");
    }
    router.push(`/dashboard?${next.toString()}`);
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {STATUSES.map((s) => {
        const isActive = (s.value || undefined) === current;
        return (
          <button key={s.value} onClick={() => setStatus(s.value)}>
            <Badge variant={isActive ? "default" : "outline"} className="cursor-pointer">
              {s.label}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
