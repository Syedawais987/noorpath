"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Calendar, Clock, BookOpenCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalStudents: number;
  pendingEnrollments: number;
  sessionsToday: number;
  totalSessions: number;
}

export default function AdminHomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  const cards = [
    { icon: <Users className="h-5 w-5 text-primary" />, label: "Total Students", value: stats?.totalStudents || 0, href: "/admin/students" },
    { icon: <Clock className="h-5 w-5 text-secondary" />, label: "Pending Enrollments", value: stats?.pendingEnrollments || 0, href: "/admin/students" },
    { icon: <Calendar className="h-5 w-5 text-primary" />, label: "Sessions Today", value: stats?.sessionsToday || 0, href: "/admin/schedule" },
    { icon: <BookOpenCheck className="h-5 w-5 text-accent-foreground" />, label: "Total Sessions", value: stats?.totalSessions || 0, href: "/admin/schedule" },
  ];

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary lg:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted">Overview of your teaching platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs text-muted">{c.label}</p>
                  <p className="text-2xl font-bold">{c.value}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Button className="min-h-[44px]" asChild>
          <Link href="/admin/sessions/new">Create Session</Link>
        </Button>
        <Button variant="outline" className="min-h-[44px]" asChild>
          <Link href="/admin/assignments">Manage Assignments</Link>
        </Button>
        <Button variant="outline" className="min-h-[44px]" asChild>
          <Link href="/admin/payments">Manage Payments</Link>
        </Button>
      </div>
    </div>
  );
}
