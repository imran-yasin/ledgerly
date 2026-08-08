import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-7xl flex-col items-center justify-center px-6 text-center sm:px-8 lg:px-12">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The page you requested does not exist or is not available to you.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard">Back to orders</Link>
      </Button>
    </main>
  );
}
