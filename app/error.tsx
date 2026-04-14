"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-section-mobile text-center">
      <h1 className="font-display text-4xl font-bold text-destructive">Oops!</h1>
      <p className="mt-2 text-lg text-muted">Something went wrong</p>
      <p className="mt-1 text-sm text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <Button className="mt-6 min-h-[44px]" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
