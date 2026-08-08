"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <main className="flex min-h-[60vh] items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
              <AlertTriangle size={32} className="text-destructive" />
              <div>
                <p className="font-semibold">Something went wrong</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  An unexpected error occurred. Please try refreshing the page.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
              >
                Refresh page
              </Button>
            </CardContent>
          </Card>
        </main>
      );
    }

    return this.props.children;
  }
}
