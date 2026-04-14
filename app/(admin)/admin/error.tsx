"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <h2 className="font-display text-2xl font-bold text-destructive">Something went wrong</h2>
      <p className="mt-2 text-sm text-muted">We couldn&apos;t load this page. Please try again.</p>
      <Button className="mt-4 min-h-[44px]" onClick={reset}>Try Again</Button>
    </div>
  );
}
