import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <h2 className="font-display text-2xl font-bold text-primary">Page Not Found</h2>
      <p className="mt-2 text-sm text-muted">This admin page doesn&apos;t exist.</p>
      <Button className="mt-4 min-h-[44px]" variant="outline" asChild>
        <Link href="/admin">Go to Admin</Link>
      </Button>
    </div>
  );
}
