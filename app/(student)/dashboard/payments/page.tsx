"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  dueDate: string;
  paidAt: string | null;
  status: string;
  paymentMethod: string | null;
}

export default function PaymentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments")
      .then((r) => r.ok ? r.json() : { invoices: [] })
      .then((d) => setInvoices(d.invoices || []))
      .finally(() => setLoading(false));
  }, []);

  const statusVariant = (status: string) => {
    switch (status) {
      case "PAID": return "accent" as const;
      case "OVERDUE": return "destructive" as const;
      default: return "secondary" as const;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-6 lg:p-8">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Payments</h1>
        <p className="text-sm text-muted">Your invoices and billing history</p>
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <CreditCard className="h-12 w-12 text-muted" />
            <p className="text-muted">No invoices yet.</p>
            <p className="text-sm text-muted">Invoices will appear here when created by your teacher.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <Card key={inv.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">
                    {inv.currency} {inv.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted">
                    Due: {new Date(inv.dueDate).toLocaleDateString()}
                  </p>
                  {inv.paidAt && (
                    <p className="text-xs text-muted">
                      Paid: {new Date(inv.paidAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
                  {inv.status === "PAID" && (
                    <Button size="sm" variant="outline" className="min-h-[44px]" asChild>
                      <a href={`/api/payments/${inv.id}/receipt`} target="_blank" rel="noopener noreferrer">
                        View Receipt
                      </a>
                    </Button>
                  )}
                  {inv.status === "PENDING" && (
                    <Button size="sm" variant="secondary" className="min-h-[44px]" disabled>
                      Pay Now (v2)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
