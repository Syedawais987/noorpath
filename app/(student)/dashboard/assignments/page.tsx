"use client";

import { useEffect, useState } from "react";
import { BookOpenCheck, Loader2, Upload, Mic, Square } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  attachmentUrl: string | null;
  status: string;
  feedback: string | null;
  submissionUrl: string | null;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  useEffect(() => {
    fetch("/api/assignments")
      .then((r) => r.ok ? r.json() : { assignments: [] })
      .then((d) => setAssignments(d.assignments || []))
      .finally(() => setLoading(false));
  }, []);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(blob);
      stream.getTracks().forEach((t) => t.stop());
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorder?.stop();
    setRecording(false);
    setMediaRecorder(null);
  }

  async function submitAssignment(id: string) {
    setSubmittingId(id);
    await fetch(`/api/assignments/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: submissionText }),
    });
    setSubmittingId(null);
    setSubmissionText("");
    setAudioBlob(null);

    // Refresh
    const res = await fetch("/api/assignments");
    if (res.ok) {
      const d = await res.json();
      setAssignments(d.assignments || []);
    }
  }

  const statusVariant = (status: string) => {
    switch (status) {
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
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Assignments</h1>
        <p className="text-sm text-muted">Your homework and tasks</p>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <BookOpenCheck className="h-12 w-12 text-muted" />
            <p className="text-muted">No assignments yet.</p>
            <p className="text-sm text-muted">Assignments will appear here when posted by your teacher.</p>
          </CardContent>
        </Card>
      ) : (
        assignments.map((a) => (
          <Card key={a.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{a.title}</CardTitle>
                <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {a.description && <p className="text-sm text-muted">{a.description}</p>}
              {a.dueDate && (
                <p className="text-xs text-muted">
                  Due: {new Date(a.dueDate).toLocaleDateString()}
                </p>
              )}
              {a.feedback && (
                <div className="rounded-card bg-accent/20 p-3 text-sm">
                  <p className="text-xs font-medium text-muted">Teacher Feedback</p>
                  <p className="mt-1">{a.feedback}</p>
                </div>
              )}

              {(a.status === "PENDING" || a.status === "REDO") && (
                <div className="space-y-3 border-t border-border pt-3">
                  <Input
                    placeholder="Write your submission..."
                    value={submittingId === a.id ? submissionText : ""}
                    onChange={(e) => {
                      setSubmittingId(a.id);
                      setSubmissionText(e.target.value);
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {recording ? (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="min-h-[44px] gap-2"
                        onClick={stopRecording}
                      >
                        <Square className="h-4 w-4" />
                        Stop Recording
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="min-h-[44px] gap-2"
                        onClick={startRecording}
                      >
                        <Mic className="h-4 w-4" />
                        Record Audio
                      </Button>
                    )}
                    {audioBlob && (
                      <Badge variant="accent">Audio recorded</Badge>
                    )}
                    <Button
                      size="sm"
                      className="min-h-[44px] gap-2"
                      disabled={submittingId === a.id && !submissionText && !audioBlob}
                      onClick={() => submitAssignment(a.id)}
                    >
                      {submittingId === a.id && submissionText ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
