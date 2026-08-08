import Link from "next/link";
import { ArrowRight, Receipt, DollarSign, BarChart3 } from "lucide-react";
import { requireUserId } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Receipt, text: "Create orders with line items and auto-calculated totals" },
  { icon: DollarSign, text: "Accept full or partial payments with over-payment protection" },
  { icon: BarChart3, text: "Real-time status: Pending, Partially Paid, Paid, or Overdue" },
];

const steps = [
  { step: "1", title: "Create an order", desc: "Add customer details and line items. Totals are calculated automatically." },
  { step: "2", title: "Record payments", desc: "Accept full or partial payments. Over-payments are prevented automatically." },
  { step: "3", title: "Track status", desc: "Always know where things stand with color-coded status indicators." },
];

export default async function Home() {
  const userId = await requireUserId();

  return (
    <main className="min-h-screen">
      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-16 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:py-28 lg:px-10">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Orders, settled simply</p>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Know exactly what is owed.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            A focused workspace for creating orders, collecting partial payments, and always knowing what&apos;s due.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {userId ? (
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Open workspace <ArrowRight size={16} />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/register">
                    Create free account <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
              </>
            )}
          </div>
          <ul className="mt-14 grid gap-4">
            {features.map(({ icon: Icon, text }) => (
              <li className="flex items-start gap-3" key={text}>
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Icon size={13} className="text-primary" />
                </span>
                <span className="text-sm text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <Card className="h-fit">
          <CardContent className="p-8">
            <p className="text-sm font-semibold">How it works</p>
            <p className="mt-1 text-xs text-muted-foreground">Three simple steps</p>
            <div className="mt-8 grid gap-6">
              {steps.map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
