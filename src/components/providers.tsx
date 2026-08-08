"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ReactQueryProvider } from "./react-query-provider";
import { ErrorBoundary } from "./error-boundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster richColors closeButton position="top-right" />
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
