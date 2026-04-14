import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-section-mobile text-center">
      <BookOpen className="h-16 w-16 text-muted" />
      <h1 className="mt-6 font-display text-4xl font-bold text-primary">404</h1>
      <p className="mt-2 text-lg text-muted">Page not found</p>
      <p className="mt-1 text-sm text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button className="mt-6 min-h-[44px]" asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
