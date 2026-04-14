import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user.role !== "TEACHER") {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-content px-section-mobile py-8 lg:px-section-desktop">
      <h1 className="font-display text-3xl font-bold text-primary">
        Admin Panel
      </h1>
      <p className="mt-2 text-muted">Welcome back, {session.user.name}</p>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted">
              Student management, scheduling, and analytics will appear here in Phase 5.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
