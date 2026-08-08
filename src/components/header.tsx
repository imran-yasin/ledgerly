"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export function Header({ userId }: { userId?: string | null }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  const { data: session } = useSession();
  // The root layout is preserved during client-side navigation. Use the live
  // NextAuth session so the header updates immediately after signing in/out.
  const isAuthenticated = Boolean(session?.user?.id ?? userId);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-12">
        <Link href="/" className="text-base font-semibold tracking-tight sm:text-lg">
          ledgerly<span className="text-primary">.</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              {!isDashboard && (
                <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                  <Link href="/dashboard">
                    <LayoutDashboard size={14} /> <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                </Button>
              )}
              {!isDashboard && (
                <Button variant="ghost" size="icon-xs" asChild className="sm:hidden">
                  <Link href="/dashboard">
                    <LayoutDashboard size={14} />
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut size={14} /> <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">
                  <span className="hidden sm:inline">Get started</span>
                  <span className="sm:hidden">Start</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
