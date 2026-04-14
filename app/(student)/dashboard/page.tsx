"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, BookOpenCheck, TrendingUp, Video } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardData {
  nextSession: {
    id: string;
    startTime: string;
    endTime: string;
    dailyRoomUrl: string | null;
    teacher: { name: string };
  } | null;
  stats: {
    totalSessions: number;
    completedSessions: number;
    pendingAssignments: number;
    currentSurah: string | null;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-40" />
      </div>
    );
  }

  const now = new Date();
  const nextStart = data?.nextSession ? new Date(data.nextSession.startTime) : null;
  const canJoin = nextStart && nextStart.getTime() - now.getTime() <= 10 * 60 * 1000 && nextStart.getTime() > now.getTime();

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary lg:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted">Your learning overview</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Calendar className="h-5 w-5 text-primary" />}
          label="Total Sessions"
          value={String(data?.stats.totalSessions || 0)}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
          label="Completed"
          value={String(data?.stats.completedSessions || 0)}
        />
        <StatCard
          icon={<BookOpenCheck className="h-5 w-5 text-secondary" />}
          label="Pending Tasks"
          value={String(data?.stats.pendingAssignments || 0)}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-accent-foreground" />}
          label="Current Surah"
          value={data?.stats.currentSurah || "—"}
        />
      </div>

      {/* Next Class */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Next Class</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.nextSession ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">
                  {nextStart!.toLocaleDateString(undefined, {
                    weekday: "long", month: "long", day: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted">
                  {nextStart!.toLocaleTimeString(undefined, {
                    hour: "2-digit", minute: "2-digit",
                  })}{" "}
                  — with {data.nextSession.teacher.name}
                </p>
              </div>
              {canJoin && data.nextSession.dailyRoomUrl ? (
                <Button className="min-h-[44px] gap-2" asChild>
                  <a href={data.nextSession.dailyRoomUrl} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4" />
                    Join Class
                  </a>
                </Button>
              ) : (
                <Badge variant="accent">
                  {nextStart! > now ? "Upcoming" : "In Progress"}
                </Badge>
              )}
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-muted">No upcoming classes scheduled.</p>
              <Button variant="outline" className="mt-3 min-h-[44px]" asChild>
                <Link href="/dashboard/schedule">View Schedule</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
