"use client";

import { useEffect, useState } from "react";
import { Calendar, Video, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Session {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  dailyRoomUrl: string | null;
  teacher: { name: string };
}

export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.ok ? r.json() : { sessions: [] })
      .then((d) => setSessions(d.sessions || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 p-6 lg:p-8">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Schedule</h1>
        <p className="text-sm text-muted">Your upcoming and past sessions</p>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Calendar className="h-12 w-12 text-muted" />
            <p className="text-muted">No classes scheduled yet.</p>
            <p className="text-sm text-muted">Once Alma schedules your sessions, they will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const start = new Date(s.startTime);
            const end = new Date(s.endTime);
            const canJoin = s.dailyRoomUrl && start.getTime() - now.getTime() <= 10 * 60 * 1000 && start > now;

            return (
              <Card key={s.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                      <Clock className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                      </p>
                      <p className="text-sm text-muted">
                        {start.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                        {" — "}
                        {end.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        s.status === "COMPLETED" ? "accent"
                          : s.status === "CANCELLED" ? "destructive"
                            : "secondary"
                      }
                    >
                      {s.status}
                    </Badge>
                    {canJoin && (
                      <Button size="sm" className="min-h-[44px] gap-2" asChild>
                        <a href={s.dailyRoomUrl!} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4" />
                          Join
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
