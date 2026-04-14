"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle, XCircle, Clock, Loader2, ArrowLeft, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface EnrollmentWithUser {
  id: string;
  relationship: string;
  location: string | null;
  preferredSchedule: string | null;
  status: string;
  adminMessage: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    timezone: string;
    studentProfile: {
      age: number | null;
      learningGoal: string | null;
      currentLevel: string | null;
    } | null;
  };
}

type TabType = "PENDING" | "APPROVED" | "REJECTED";

export default function AdminStudentsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [tab, setTab] = useState<TabType>("PENDING");
  const [enrollments, setEnrollments] = useState<EnrollmentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectMessage, setRejectMessage] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/enrollments?status=${tab}`);
    if (res.ok) {
      const data = await res.json();
      setEnrollments(data.enrollments);
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchEnrollments();
    }
  }, [tab, sessionStatus, fetchEnrollments]);

  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || session.user.role !== "TEACHER") {
    redirect("/login");
  }

  async function handleAction(id: string, status: "APPROVED" | "REJECTED", message?: string) {
    setActionLoading(id);
    await fetch(`/api/enroll/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminMessage: message }),
    });
    setActionLoading(null);
    setRejectingId(null);
    setRejectMessage("");
    fetchEnrollments();
  }

  const tabs: { value: TabType; label: string; icon: React.ReactNode }[] = [
    { value: "PENDING", label: "Pending", icon: <Clock className="h-4 w-4" /> },
    { value: "APPROVED", label: "Approved", icon: <CheckCircle className="h-4 w-4" /> },
    { value: "REJECTED", label: "Rejected", icon: <XCircle className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-content px-section-mobile py-8 lg:px-section-desktop">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Students</h1>
          <p className="text-muted">Manage enrollment requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        {tabs.map((t) => (
          <Button
            key={t.value}
            variant={tab === t.value ? "default" : "outline"}
            size="sm"
            onClick={() => setTab(t.value)}
            className="min-h-[44px] gap-2"
          >
            {t.icon}
            {t.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : enrollments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <Users className="h-12 w-12 text-muted" />
              <p className="text-muted">
                No {tab.toLowerCase()} enrollment requests.
              </p>
            </CardContent>
          </Card>
        ) : (
          enrollments.map((enrollment) => (
            <Card key={enrollment.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{enrollment.user.name}</CardTitle>
                  <Badge
                    variant={
                      enrollment.status === "PENDING" ? "secondary"
                        : enrollment.status === "APPROVED" ? "accent"
                          : "destructive"
                    }
                  >
                    {enrollment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <InfoItem label="Email" value={enrollment.user.email} />
                  <InfoItem label="Phone" value={enrollment.user.phone || "—"} />
                  <InfoItem label="Age" value={enrollment.user.studentProfile?.age?.toString() || "—"} />
                  <InfoItem label="Relationship" value={enrollment.relationship === "self" ? "Self" : "Parent (child)"} />
                  <InfoItem label="Location" value={enrollment.location || "—"} />
                  <InfoItem label="Timezone" value={enrollment.user.timezone.replace(/_/g, " ")} />
                  <InfoItem label="Learning Goal" value={enrollment.user.studentProfile?.learningGoal || "—"} />
                  <InfoItem label="Current Level" value={enrollment.user.studentProfile?.currentLevel?.replace(/_/g, " ") || "—"} />
                  <InfoItem label="Submitted" value={new Date(enrollment.createdAt).toLocaleDateString()} />
                </div>

                {enrollment.preferredSchedule && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-muted">Preferred Schedule</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {JSON.parse(enrollment.preferredSchedule).map((s: string) => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {enrollment.adminMessage && (
                  <div className="mt-3 rounded-card bg-muted/10 p-3 text-sm">
                    <p className="text-xs font-medium text-muted">Admin Message</p>
                    <p className="mt-1">{enrollment.adminMessage}</p>
                  </div>
                )}

                {enrollment.status === "PENDING" && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      className="min-h-[44px] gap-2"
                      disabled={actionLoading === enrollment.id}
                      onClick={() => handleAction(enrollment.id, "APPROVED")}
                    >
                      {actionLoading === enrollment.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Approve
                    </Button>

                    {rejectingId === enrollment.id ? (
                      <div className="flex flex-1 items-center gap-2">
                        <Input
                          placeholder="Reason (optional)"
                          value={rejectMessage}
                          onChange={(e) => setRejectMessage(e.target.value)}
                          className="min-w-[200px]"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="min-h-[44px]"
                          disabled={actionLoading === enrollment.id}
                          onClick={() => handleAction(enrollment.id, "REJECTED", rejectMessage)}
                        >
                          Confirm Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="min-h-[44px]"
                          onClick={() => { setRejectingId(null); setRejectMessage(""); }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="min-h-[44px] gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => setRejectingId(enrollment.id)}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-muted">{label}</span>
      <p className="font-medium">{value}</p>
    </div>
  );
}
