"use client";

import { Loader2 } from "lucide-react";
import { usePaymentForm } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";

export function PaymentForm({ orderId, maxCents }: { orderId: string; maxCents: number }) {
  const { amount, setAmount, note, setNote, paidAt, setPaidAt, error, loading, handleSubmit } = usePaymentForm(orderId, maxCents);

  const formattedMax = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(maxCents / 100);

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" type="number" step="0.01" min="0.01" placeholder="0.00" value={amount} onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!isNaN(v) && v < 0) return;
          setAmount(e.target.value);
        }} required />
        <p className="text-xs text-muted-foreground">Maximum allowed: {formattedMax}</p>
      </div>
      <div className="grid gap-1.5">
        <Label>Payment date</Label>
        <DatePicker value={paidAt} onChange={setPaidAt} placeholder="Select date" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="note">Note</Label>
        <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Bank transfer" />
        <p className="text-xs text-muted-foreground">Optional</p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="animate-spin" />}
        {loading ? "Recording..." : "Record payment"}
      </Button>
    </form>
  );
}
