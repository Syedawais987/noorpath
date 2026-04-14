"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PasswordStrength } from "@/components/ui/password-strength";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const password = watch("password", "");

  async function onSubmit(data: ResetPasswordInput) {
    setError("");

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    const response = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, token }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (!token) {
    return (
      <CardContent className="text-center">
        <p className="text-sm text-destructive">
          Invalid reset link. Please request a new password reset.
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/forgot-password">Request New Link</Link>
        </Button>
      </CardContent>
    );
  }

  if (success) {
    return (
      <CardContent>
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <CheckCircle className="h-12 w-12 text-primary" />
          <p className="font-medium text-foreground">Password reset successfully!</p>
          <p className="text-sm text-muted">Redirecting to login...</p>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="space-y-4">
      {error && (
        <div className="rounded-card bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            {...register("password")}
          />
          <PasswordStrength password={password} />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full min-h-[44px]"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reset Password
        </Button>
      </form>
    </CardContent>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-section-mobile">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-primary">NoorPath</span>
          </Link>
          <CardTitle>Set New Password</CardTitle>
          <CardDescription>Choose a strong password for your account</CardDescription>
        </CardHeader>
        <Suspense fallback={<CardContent><p className="text-center text-muted">Loading...</p></CardContent>}>
          <ResetPasswordForm />
        </Suspense>
      </Card>
    </div>
  );
}
