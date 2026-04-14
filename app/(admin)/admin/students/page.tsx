"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Users, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  studentProfile: { learningGoal: string | null; currentLevel: string | null } | null;
  enrollmentRequest: { status: string } | null;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/students?search=${search}&page=${page}`);
    if (res.ok) {
      const data = await res.json();
      setStudents(data.students);
      setTotalPages(data.pages);
    }
    setLoading(false);
  }, [search, page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const enrollmentBadge = (status: string | undefined) => {
    switch (status) {
      case "APPROVED": return <Badge variant="accent">Approved</Badge>;
      case "REJECTED": return <Badge variant="destructive">Rejected</Badge>;
      case "PENDING": return <Badge variant="secondary">Pending</Badge>;
      default: return <Badge variant="outline">No Request</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Students</h1>
          <p className="text-sm text-muted">Manage all students and enrollments</p>
        </div>
        <Button className="min-h-[44px]" asChild>
          <Link href="/admin/students?tab=pending">View Pending Enrollments</Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
        <Input
          placeholder="Search by name or email..."
          className="pl-9"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Users className="h-12 w-12 text-muted" />
            <p className="text-muted">No students found.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {students.map((s) => (
              <Link key={s.id} href={`/admin/students/${s.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-muted">{s.email}</p>
                      <p className="text-xs text-muted">
                        {s.studentProfile?.learningGoal || "—"} · {s.studentProfile?.currentLevel?.replace(/_/g, " ") || "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {enrollmentBadge(s.enrollmentRequest?.status)}
                      <Badge variant="outline">{s.role}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline" size="icon"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted">Page {page} of {totalPages}</span>
              <Button
                variant="outline" size="icon"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
