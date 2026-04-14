"use client";

import { useEffect, useState, useCallback } from "react";
import { CreditCard, Plus, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  dueDate: string;
  paidAt: string | null;
  status: string;
  paymentMethod: string | null;
  student: { name: string; email: string };
}

interface Student { id: string; name: string; email: string }

export default function AdminPaymentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [markPaidId, setMarkPaidId] = useState<string | null>(null);
  const [form, setForm] = useState({ studentId: "", amount: "", currency: "PKR", dueDate: "" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [pRes, sRes] = await Promise.all([
      fetch("/api/admin/payments"),
      fetch("/api/admin/students?page=1"),
    ]);
    if (pRes.ok) setInvoices((await pRes.json()).invoices || []);
    if (sRes.ok) setStudents((await sRes.json()).students || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function createInvoice(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    await fetch("/api/admin/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setCreating(false);
    setShowCreate(false);
    setForm({ studentId: "", amount: "", currency: "PKR", dueDate: "" });
    fetchData();
  }

  async function markAsPaid() {
    if (!markPaidId) return;
    await fetch(`/api/admin/payments/${markPaidId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PAID" }),
    });
    setMarkPaidId(null);
    fetchData();
  }

  const statusVariant = (s: string) => {
    switch (s) {
      case "PAID": return "accent" as const;
      case "OVERDUE": return "destructive" as const;
      default: return "secondary" as const;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-6 lg:p-8">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Payments</h1>
          <p className="text-sm text-muted">Manage invoices and payments</p>
        </div>
        <Button className="min-h-[44px] gap-2" onClick={() => setShowCreate(!showCreate)}>
          <Plus className="h-4 w-4" />New Invoice
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Create Invoice</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={createInvoice} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Student</Label>
                  <select className="flex h-10 w-full rounded-card border border-input bg-surface px-3 text-sm" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
                    <option value="">Select student</option>
                    {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Amount</Label>
                  <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Currency</Label>
                  <select className="flex h-10 w-full rounded-card border border-input bg-surface px-3 text-sm" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                    <option value="PKR">PKR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Due Date</Label>
                  <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
                </div>
              </div>
              <Button type="submit" className="min-h-[44px]" disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Invoice
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <CreditCard className="h-12 w-12 text-muted" />
            <p className="text-muted">No invoices yet.</p>
          </CardContent>
        </Card>
      ) : (
        invoices.map((inv) => (
          <Card key={inv.id}>
            <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{inv.student.name}</p>
                <p className="text-sm text-muted">
                  {inv.currency} {inv.amount.toLocaleString()} — Due: {new Date(inv.dueDate).toLocaleDateString()}
                </p>
                {inv.paidAt && <p className="text-xs text-muted">Paid: {new Date(inv.paidAt).toLocaleDateString()}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
                {inv.status === "PENDING" && (
                  <Button size="sm" variant="outline" className="min-h-[44px]" onClick={() => setMarkPaidId(inv.id)}>
                    Mark Paid
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <ConfirmDialog
        open={!!markPaidId}
        title="Mark as Paid"
        description="Are you sure you want to mark this invoice as paid?"
        confirmLabel="Mark Paid"
        onConfirm={markAsPaid}
        onCancel={() => setMarkPaidId(null)}
      />
    </div>
  );
}
