import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-content px-section-mobile py-8 lg:px-section-desktop">
      <h1 className="font-display text-3xl font-bold text-primary">
        Welcome, {session.user.name}
      </h1>
      <p className="mt-2 text-muted">Your student dashboard</p>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted">
              Your classes, progress, and assignments will appear here in Phase 4.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
