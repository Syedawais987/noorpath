"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpenCheck, Plus, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: string;
  feedback: string | null;
  submissionUrl: string | null;
  student: { name: string; email: string };
}

interface Student { id: string; name: string; email: string }

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({ status: "REVIEWED", feedback: "" });
  const [form, setForm] = useState({ studentId: "", title: "", description: "", dueDate: "" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [aRes, sRes] = await Promise.all([
      fetch("/api/admin/assignments"),
      fetch("/api/admin/students?page=1"),
    ]);
    if (aRes.ok) setAssignments((await aRes.json()).assignments || []);
    if (sRes.ok) setStudents((await sRes.json()).students || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function createAssignment(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    await fetch("/api/admin/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setCreating(false);
    setShowCreate(false);
    setForm({ studentId: "", title: "", description: "", dueDate: "" });
    fetchData();
  }

  async function reviewAssignment() {
    if (!reviewId) return;
    await fetch(`/api/admin/assignments/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewForm),
    });
    setReviewId(null);
    setReviewForm({ status: "REVIEWED", feedback: "" });
    fetchData();
  }

  const statusVariant = (s: string) => {
    switch (s) {
      case "REVIEWED": return "accent" as const;
      case "REDO": return "destructive" as const;
      case "SUBMITTED": return "secondary" as const;
      default: return "outline" as const;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-6 lg:p-8">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Assignments</h1>
          <p className="text-sm text-muted">Create and review assignments</p>
        </div>
        <Button className="min-h-[44px] gap-2" onClick={() => setShowCreate(!showCreate)}>
          <Plus className="h-4 w-4" />New Assignment
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Create Assignment</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={createAssignment} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Student</Label>
                  <select className="flex h-10 w-full rounded-card border border-input bg-surface px-3 text-sm" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
                    <option value="">Select student</option>
                    {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Due Date</Label>
                <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <Button type="submit" className="min-h-[44px]" disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <BookOpenCheck className="h-12 w-12 text-muted" />
            <p className="text-muted">No assignments yet.</p>
          </CardContent>
        </Card>
      ) : (
        assignments.map((a) => (
          <Card key={a.id}>
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted">{a.student.name}</p>
                </div>
                <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
              </div>
              {a.submissionUrl && (
                <div className="rounded-card bg-accent/10 p-2 text-sm">
                  <p className="text-xs font-medium text-muted">Submission</p>
                  <p>{a.submissionUrl}</p>
                </div>
              )}
              {a.status === "SUBMITTED" && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {reviewId === a.id ? (
                    <div className="flex flex-1 flex-wrap items-end gap-2">
                      <select className="flex h-10 rounded-card border border-input bg-surface px-2 text-sm" value={reviewForm.status} onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}>
                        <option value="REVIEWED">Reviewed</option>
                        <option value="REDO">Needs Redo</option>
                      </select>
                      <Input className="min-w-[150px] flex-1" placeholder="Feedback..." value={reviewForm.feedback} onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })} />
                      <Button size="sm" className="min-h-[44px]" onClick={reviewAssignment}>Save</Button>
                      <Button size="sm" variant="ghost" className="min-h-[44px]" onClick={() => setReviewId(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" className="min-h-[44px]" onClick={() => setReviewId(a.id)}>Review</Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
