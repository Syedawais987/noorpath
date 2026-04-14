"use client";

import { useState } from "react";
import { Calendar, Video, Clock, Plus, X, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { VideoModal } from "@/components/dashboard/VideoModal";
import { useSchedule } from "@/hooks/useSchedule";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function SchedulePage() {
  const { sessions, slots, loading, refetch } = useSchedule();
  const [booking, setBooking] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  async function requestSession(slot: { dayOfWeek: number; startTime: string; endTime: string }) {
    setBooking(true);
    await fetch("/api/sessions/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slot),
    });
    setBooking(false);
    refetch();
  }

  async function cancelSession() {
    if (!cancelId) return;
    setCancelling(true);
    const res = await fetch(`/api/sessions/${cancelId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    setCancelling(false);
    if (!res.ok) {
      const data = await res.json();
      alert(data.error);
    }
    setCancelId(null);
    refetch();
  }

  if (loading) {
    return (
      <div className="space-y-4 p-6 lg:p-8">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Schedule</h1>
        <p className="text-sm text-muted">Book sessions and join classes</p>
      </div>

      {/* Available Slots */}
      {slots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted">Click a slot to request a session.</p>
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <Button
                  key={slot.id}
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] gap-2"
                  disabled={booking}
                  onClick={() => requestSession(slot)}
                >
                  {booking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {DAYS[slot.dayOfWeek]} {slot.startTime}–{slot.endTime}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions */}
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Calendar className="h-12 w-12 text-muted" />
            <p className="text-muted">No classes scheduled yet.</p>
            {slots.length > 0 ? (
              <p className="text-sm text-muted">Select an available slot above to request a session.</p>
            ) : (
              <p className="text-sm text-muted">Once Alma sets her availability, you can book sessions here.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const start = new Date(s.startTime);
            const end = new Date(s.endTime);
            const msUntil = start.getTime() - now.getTime();
            const canJoin = s.dailyRoomUrl && msUntil <= 10 * 60 * 1000 && msUntil > -60 * 60 * 1000;
            const canCancel = s.status === "SCHEDULED" && msUntil > 0;

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
                      <Button
                        size="sm"
                        className="min-h-[44px] gap-2"
                        onClick={() => setVideoUrl(s.dailyRoomUrl)}
                      >
                        <Video className="h-4 w-4" />
                        Join Class
                      </Button>
                    )}
                    {canCancel && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="min-h-[44px] text-destructive"
                        onClick={() => setCancelId(s.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!cancelId}
        title="Cancel Session"
        description="Are you sure you want to cancel this session? Cancellations within 12 hours of the session may not be allowed."
        confirmLabel="Cancel Session"
        variant="destructive"
        loading={cancelling}
        onConfirm={cancelSession}
        onCancel={() => setCancelId(null)}
      />

      {videoUrl && (
        <VideoModal url={videoUrl} onClose={() => setVideoUrl(null)} />
      )}
    </div>
  );
}
