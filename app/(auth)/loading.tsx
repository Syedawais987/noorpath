import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-section-mobile">
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="mx-auto h-8 w-32" />
        <Skeleton className="h-64 rounded-card" />
      </div>
    </div>
  );
}
