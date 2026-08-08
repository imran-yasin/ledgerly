"use client";

import Link from "next/link";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { useOrderForm } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewOrderPage() {
  const {
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
    loading,
    handleSubmit,
  } = useOrderForm();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-8">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={14} /> Back to orders
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">New order</h1>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Order details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer name</Label>
              <Input id="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} required placeholder="e.g. Acme Corp" />
            </div>

            <div className="grid gap-2">
              <Label>Due date</Label>
              <DatePicker value={dueDate} onChange={setDueDate} placeholder="Select due date" />
            </div>

            <fieldset className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label>Line items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus size={14} /> Add item
                </Button>
              </div>
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_56px_88px_32px] sm:grid-cols-[1fr_72px_108px_36px] gap-2">
                  <Input placeholder="Description" value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} required />
                  <Input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)} required className="text-right [&::-webkit-inner-spin-button]:appearance-none" />
                  <Input type="number" step="0.01" min="0" placeholder="0.00" value={item.unitPriceDollars} onChange={(e) => updateItem(idx, "unitPriceDollars", e.target.value)} required className="text-right [&::-webkit-inner-spin-button]:appearance-none" />
                  <Button type="button" variant="ghost" size="icon-xs" onClick={() => removeItem(idx)} disabled={items.length <= 1} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </fieldset>

            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground">Order total</p>
              <p className="text-lg font-semibold tabular-nums">${total.toFixed(2)}</p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading} size="lg">
              {loading && <Loader2 className="animate-spin" />}
              {loading ? "Creating..." : "Create order"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
