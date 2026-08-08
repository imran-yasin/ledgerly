import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import { requireUserId } from "@/lib/auth/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ledgerly — Orders & settlements",
  description: "A precise, calm workspace for orders and payments.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const userId = await requireUserId();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider delayDuration={300}>
          <Providers>
            <Header userId={userId} />
            {children}
          </Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}
