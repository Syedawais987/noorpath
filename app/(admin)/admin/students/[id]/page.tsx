"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  timezone: string;
  role: string;
  createdAt: string;
  studentProfile: {
    age: number | null;
    learningGoal: string | null;
    currentLevel: string | null;
    progressEntries: { id: string; surahName: string | null; date: string; notes: string | null }[];
  } | null;
  studentSessions: {
    id: string;
    startTime: string;
    status: string;
    sessionNote: { tajweedScore: number | null; attendanceStatus: string; studentFeedback: string | null } | null;
  }[];
  assignments: { id: string; title: string; status: string; dueDate: string | null }[];
  enrollmentRequest: { id: string; status: string; relationship: string; location: string | null } | null;
}

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [showReject, setShowReject] = useState(false);

  function fetchStudent() {
    fetch(`/api/admin/students/${params.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setStudent(d?.student || null))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchStudent();
  }, [params.id]);

  async function handleEnrollmentAction(status: "APPROVED" | "REJECTED") {
    if (!student?.enrollmentRequest) return;
    setActionLoading(true);
    await fetch(`/api/enroll/${student.enrollmentRequest.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminMessage: rejectMessage || undefined }),
    });
    setActionLoading(false);
    setShowReject(false);
    setRejectMessage("");
    fetchStudent();
  }

  if (loading) {
    return (
      <div className="space-y-4 p-6 lg:p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6 text-center lg:p-8">
        <p className="text-muted">Student not found.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/students">Back to Students</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/students"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">{student.name}</h1>
          <p className="text-sm text-muted">{student.email}</p>
        </div>
      </div>

      {/* Personal Info */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Personal Info</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Phone" value={student.phone || "—"} />
            <Info label="Timezone" value={student.timezone} />
            <Info label="Role" value={student.role} />
            <Info label="Age" value={student.studentProfile?.age?.toString() || "—"} />
            <Info label="Learning Goal" value={student.studentProfile?.learningGoal || "—"} />
            <Info label="Level" value={student.studentProfile?.currentLevel?.replace(/_/g, " ") || "—"} />
            <Info label="Enrollment" value={student.enrollmentRequest?.status || "—"} />
            <Info label="Relationship" value={student.enrollmentRequest?.relationship || "—"} />
            <Info label="Location" value={student.enrollmentRequest?.location || "—"} />
          </div>
        </CardContent>
      </Card>

      {/* Enrollment Actions */}
      {student.enrollmentRequest?.status === "PENDING" && (
        <Card className="border-secondary">
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <p className="font-medium">Enrollment is pending approval.</p>
            <Button
              className="min-h-[44px] gap-2"
              disabled={actionLoading}
              onClick={() => handleEnrollmentAction("APPROVED")}
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Approve
            </Button>
            {showReject ? (
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                  placeholder="Reason (optional)"
                  value={rejectMessage}
                  onChange={(e) => setRejectMessage(e.target.value)}
                  className="min-w-[200px]"
                />
                <Button
                  variant="destructive"
                  className="min-h-[44px]"
                  disabled={actionLoading}
                  onClick={() => handleEnrollmentAction("REJECTED")}
                >
                  Confirm Reject
                </Button>
                <Button variant="ghost" className="min-h-[44px]" onClick={() => setShowReject(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="min-h-[44px] gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => setShowReject(true)}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sessions */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Sessions ({student.studentSessions.length})</CardTitle></CardHeader>
        <CardContent>
          {student.studentSessions.length === 0 ? (
            <p className="py-4 text-center text-muted">No sessions yet.</p>
          ) : (
            <div className="space-y-2">
              {student.studentSessions.slice(0, 10).map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-card border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(s.startTime).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                    {s.sessionNote && (
                      <p className="text-xs text-muted">
                        Tajweed: {s.sessionNote.tajweedScore || "—"}/5 · {s.sessionNote.attendanceStatus}
                      </p>
                    )}
                  </div>
                  <Badge variant={s.status === "COMPLETED" ? "accent" : s.status === "CANCELLED" ? "destructive" : "secondary"}>
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Progress Entries</CardTitle></CardHeader>
        <CardContent>
          {!student.studentProfile?.progressEntries.length ? (
            <p className="py-4 text-center text-muted">No progress entries yet.</p>
          ) : (
            <div className="space-y-2">
              {student.studentProfile.progressEntries.map((p) => (
                <div key={p.id} className="border-l-2 border-primary pl-4">
                  <p className="font-medium text-sm">{p.surahName || "Entry"}</p>
                  <p className="text-xs text-muted">{new Date(p.date).toLocaleDateString()}</p>
                  {p.notes && <p className="text-xs text-muted">{p.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignments */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Assignments ({student.assignments.length})</CardTitle></CardHeader>
        <CardContent>
          {student.assignments.length === 0 ? (
            <p className="py-4 text-center text-muted">No assignments yet.</p>
          ) : (
            <div className="space-y-2">
              {student.assignments.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-card border border-border p-3">
                  <p className="text-sm font-medium">{a.title}</p>
                  <Badge variant={a.status === "REVIEWED" ? "accent" : a.status === "REDO" ? "destructive" : "secondary"}>
                    {a.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-muted">{label}</span>
      <p className="font-medium">{value}</p>
    </div>
  );
}
