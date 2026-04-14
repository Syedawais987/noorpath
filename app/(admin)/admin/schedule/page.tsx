"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Trash2, Loader2, Video } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Session {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  dailyRoomUrl: string | null;
  student: { name: string };
  sessionNote: { attendanceStatus: string; tajweedScore: number | null; content: string | null } | null;
}

interface AvailSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AdminSchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [slots, setSlots] = useState<AvailSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newSlot, setNewSlot] = useState({ dayOfWeek: "1", startTime: "09:00", endTime: "10:00" });
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [noteModal, setNoteModal] = useState<string | null>(null);
  const [noteForm, setNoteForm] = useState({ content: "", studentFeedback: "", tajweedScore: "", attendanceStatus: "PRESENT" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [sRes, aRes] = await Promise.all([
      fetch("/api/admin/sessions"),
      fetch("/api/admin/availability"),
    ]);
    if (sRes.ok) setSessions((await sRes.json()).sessions || []);
    if (aRes.ok) setSlots((await aRes.json()).slots || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function addSlot() {
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newSlot, dayOfWeek: parseInt(newSlot.dayOfWeek) }),
    });
    fetchData();
  }

  async function deleteSlot() {
    if (!deleteId) return;
    await fetch(`/api/admin/availability?id=${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    fetchData();
  }

  async function saveNotes() {
    if (!noteModal) return;
    await fetch(`/api/admin/sessions/${noteModal}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteForm),
    });
    setNoteModal(null);
    setNoteForm({ content: "", studentFeedback: "", tajweedScore: "", attendanceStatus: "PRESENT" });
    fetchData();
  }

  if (loading) {
    return (
      <div className="space-y-4 p-6 lg:p-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Schedule</h1>
          <p className="text-sm text-muted">Manage sessions and availability</p>
        </div>
        <Button className="min-h-[44px] gap-2" asChild>
          <Link href="/admin/sessions/new"><Plus className="h-4 w-4" />New Session</Link>
        </Button>
      </div>

      {/* Availability */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Weekly Availability</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {slots.map((s) => (
              <div key={s.id} className="flex items-center gap-2 rounded-pill border border-border px-3 py-1 text-sm">
                <span>{DAYS[s.dayOfWeek]} {s.startTime}–{s.endTime}</span>
                <button onClick={() => setDeleteId(s.id)} className="text-muted hover:text-destructive" aria-label="Delete slot">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            {slots.length === 0 && <p className="text-sm text-muted">No availability set.</p>}
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <Label className="text-xs">Day</Label>
              <select className="flex h-10 rounded-card border border-input bg-surface px-2 text-sm" value={newSlot.dayOfWeek} onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}>
                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs">Start</Label>
              <Input type="time" className="w-28" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">End</Label>
              <Input type="time" className="w-28" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })} />
            </div>
            <Button size="sm" className="min-h-[44px]" onClick={addSlot}>Add</Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card>
        <CardHeader><CardTitle className="text-lg">All Sessions</CardTitle></CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="py-8 text-center text-muted">No sessions yet.</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <div key={s.id} className="flex flex-col gap-2 rounded-card border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{s.student.name}</p>
                    <p className="text-sm text-muted">
                      {new Date(s.startTime).toLocaleDateString()} {new Date(s.startTime).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={s.status === "COMPLETED" ? "accent" : s.status === "CANCELLED" ? "destructive" : "secondary"}>
                      {s.status}
                    </Badge>
                    {s.status === "SCHEDULED" && !s.dailyRoomUrl && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="min-h-[44px]"
                        disabled={confirmingId === s.id}
                        onClick={async () => {
                          setConfirmingId(s.id);
                          await fetch(`/api/sessions/${s.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ action: "confirm" }),
                          });
                          setConfirmingId(null);
                          fetchData();
                        }}
                      >
                        {confirmingId === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
                      </Button>
                    )}
                    {s.status === "SCHEDULED" && s.dailyRoomUrl && (
                      <>
                        <Badge variant="accent">Confirmed</Badge>
                        <Button size="sm" className="min-h-[44px] gap-2" asChild>
                          <a href={s.dailyRoomUrl} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4" />
                            Join
                          </a>
                        </Button>
                      </>
                    )}
                    {s.status === "COMPLETED" && !s.sessionNote && (
                      <Button size="sm" variant="outline" className="min-h-[44px]" onClick={() => setNoteModal(s.id)}>
                        Add Notes
                      </Button>
                    )}
                    {(s.status === "SCHEDULED" || s.status === "COMPLETED") && s.sessionNote && (
                      <Button size="sm" variant="ghost" className="min-h-[44px]" onClick={() => setNoteModal(s.id)}>
                        Edit Notes
                      </Button>
                    )}
                    {s.status === "SCHEDULED" && !s.dailyRoomUrl && !s.sessionNote && (
                      <Button size="sm" variant="outline" className="min-h-[44px]" onClick={() => setNoteModal(s.id)}>
                        Add Notes
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Availability Slot"
        description="Are you sure you want to remove this time slot?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={deleteSlot}
        onCancel={() => setDeleteId(null)}
      />

      {/* Session Notes Modal */}
      {noteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-modal border border-border bg-surface p-6 shadow-lg">
            <h3 className="font-display text-lg font-semibold">Session Notes</h3>
            <div className="mt-4 space-y-3">
              <div>
                <Label className="text-xs">Attendance</Label>
                <select className="flex h-10 w-full rounded-card border border-input bg-surface px-3 text-sm" value={noteForm.attendanceStatus} onChange={(e) => setNoteForm({ ...noteForm, attendanceStatus: e.target.value })}>
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LATE">Late</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Tajweed Score (1-5)</Label>
                <Input type="number" min="1" max="5" value={noteForm.tajweedScore} onChange={(e) => setNoteForm({ ...noteForm, tajweedScore: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Private Notes</Label>
                <Input value={noteForm.content} onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })} placeholder="Teacher notes..." />
              </div>
              <div>
                <Label className="text-xs">Student Feedback (visible to student)</Label>
                <Input value={noteForm.studentFeedback} onChange={(e) => setNoteForm({ ...noteForm, studentFeedback: e.target.value })} placeholder="Great progress today..." />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNoteModal(null)} className="min-h-[44px]">Cancel</Button>
              <Button onClick={saveNotes} className="min-h-[44px]">Save Notes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
