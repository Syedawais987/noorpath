"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  timezone: string;
  whatsappOptedIn: boolean;
}

const TIMEZONES = [
  "Asia/Karachi", "Asia/Dubai", "Asia/Riyadh", "Asia/Kolkata",
  "Europe/London", "Europe/Berlin", "America/New_York", "America/Chicago",
  "America/Los_Angeles", "Australia/Sydney", "UTC",
];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const {
    register, handleSubmit, reset,
    formState: { isSubmitting },
  } = useForm<ProfileData>();

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        reset(data.profile);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [reset]);

  async function onSubmit(data: ProfileData) {
    setSaved(false);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="space-y-4 p-6 lg:p-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Profile</h1>
        <p className="text-sm text-muted">Update your personal information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Info</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" disabled {...register("email")} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+92 300 1234567" {...register("phone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="flex h-10 w-full rounded-card border border-input bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("timezone")}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="whatsappOptedIn"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                {...register("whatsappOptedIn")}
              />
              <Label htmlFor="whatsappOptedIn" className="cursor-pointer">
                Receive WhatsApp notifications
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" className="min-h-[44px]" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
              {saved && (
                <span className="flex items-center gap-1 text-sm text-primary">
                  <CheckCircle className="h-4 w-4" />
                  Saved
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
