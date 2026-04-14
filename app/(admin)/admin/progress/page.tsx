"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  id: string;
  user: { name: string; email: string };
  learningGoal: string | null;
  currentLevel: string | null;
  progressEntries: { surahName: string | null; date: string }[];
}

export default function AdminProgressPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/progress")
      .then((r) => r.ok ? r.json() : { profiles: [] })
      .then((d) => setProfiles(d.profiles || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 p-6 lg:p-8">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Progress Overview</h1>
        <p className="text-sm text-muted">Track all students&apos; progress</p>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted" />
            <p className="text-muted">No student profiles yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {profiles.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{p.user.name}</p>
                  <p className="text-sm text-muted">{p.user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{p.learningGoal || "—"}</Badge>
                  <Badge variant="accent">
                    {p.progressEntries[0]?.surahName || "No entries"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
