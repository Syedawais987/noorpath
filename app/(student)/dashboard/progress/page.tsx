"use client";

import { useEffect, useState } from "react";
import { TrendingUp, CheckCircle, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgressData {
  entries: {
    id: string;
    surahName: string | null;
    paraNumber: number | null;
    lessonNumber: number | null;
    date: string;
    notes: string | null;
  }[];
  attendance: { present: number; total: number };
  feedback: {
    id: string;
    studentFeedback: string | null;
    tajweedScore: number | null;
    createdAt: string;
  }[];
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.ok ? r.json() : null)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 p-6 lg:p-8">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  const attendanceRate = data?.attendance.total
    ? Math.round((data.attendance.present / data.attendance.total) * 100)
    : 0;

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Progress</h1>
        <p className="text-sm text-muted">Track your Quran learning journey</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <CheckCircle className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted">Attendance Rate</p>
              <p className="text-2xl font-bold">{attendanceRate}%</p>
              <p className="text-xs text-muted">
                {data?.attendance.present || 0} / {data?.attendance.total || 0} sessions
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
              <TrendingUp className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted">Latest Surah</p>
              <p className="text-2xl font-bold">
                {data?.entries[0]?.surahName || "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Surah Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Surah Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {!data?.entries.length ? (
            <div className="py-8 text-center">
              <TrendingUp className="mx-auto h-10 w-10 text-muted" />
              <p className="mt-2 text-muted">No progress entries yet.</p>
              <p className="text-sm text-muted">Your progress will be tracked as you attend sessions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.entries.map((entry) => (
                <div key={entry.id} className="flex gap-4 border-l-2 border-primary pl-4">
                  <div>
                    <p className="font-medium">{entry.surahName || `Para ${entry.paraNumber}`}</p>
                    {entry.lessonNumber && (
                      <p className="text-xs text-muted">Lesson {entry.lessonNumber}</p>
                    )}
                    <p className="text-xs text-muted">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    {entry.notes && <p className="mt-1 text-sm text-muted">{entry.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Teacher Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          {!data?.feedback.length ? (
            <div className="py-8 text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-muted" />
              <p className="mt-2 text-muted">No feedback yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.feedback.map((fb) => (
                <div key={fb.id} className="rounded-card border border-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </p>
                    {fb.tajweedScore && (
                      <Badge variant="accent">Tajweed: {fb.tajweedScore}/5</Badge>
                    )}
                  </div>
                  {fb.studentFeedback && (
                    <p className="mt-2 text-sm">{fb.studentFeedback}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
