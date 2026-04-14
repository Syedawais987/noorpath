"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Loader2, ArrowLeft, ArrowRight, CheckCircle,
  BookMarked, Mic, Languages, Sparkles,
  User, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StepIndicator } from "@/components/ui/step-indicator";
import { enrollmentSchema, type EnrollmentInput } from "@/lib/validations/enrollment";
import { cn } from "@/lib/utils";

const STEPS = ["Personal", "Goal", "Level", "Schedule", "Review"];

const LEARNING_GOALS = [
  { value: "nazra", label: "Nazra", icon: <BookOpen className="h-6 w-6" />, desc: "Learn to read the Quran fluently" },
  { value: "hifz", label: "Hifz", icon: <BookMarked className="h-6 w-6" />, desc: "Memorize the Quran" },
  { value: "tajweed", label: "Tajweed", icon: <Mic className="h-6 w-6" />, desc: "Perfect your recitation" },
  { value: "translation", label: "Translation", icon: <Languages className="h-6 w-6" />, desc: "Understand the meaning" },
  { value: "other", label: "Other", icon: <Sparkles className="h-6 w-6" />, desc: "Something else" },
] as const;

const LEVELS = [
  { value: "beginner", label: "Complete Beginner", desc: "I haven't started learning yet" },
  { value: "can_read_slowly", label: "Can Read Slowly", desc: "I can recognize letters and read slowly" },
  { value: "reads_fluently", label: "Reads Fluently", desc: "I can read but want to improve" },
] as const;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["Morning (8-11 AM)", "Afternoon (12-3 PM)", "Evening (4-7 PM)", "Night (8-10 PM)"];

const TIMEZONES = [
  "Asia/Karachi", "Asia/Dubai", "Asia/Riyadh", "Asia/Kolkata",
  "Europe/London", "Europe/Berlin", "America/New_York", "America/Chicago",
  "America/Los_Angeles", "Australia/Sydney", "UTC",
];

export default function EnrollPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register, handleSubmit, watch, setValue, trigger,
    formState: { errors, isSubmitting },
  } = useForm<EnrollmentInput>({
    resolver: zodResolver(enrollmentSchema),
    mode: "onBlur",
    defaultValues: { preferredSchedule: [] },
  });

  const values = watch();

  async function onSubmit(data: EnrollmentInput) {
    setError("");
    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  }

  async function nextStep() {
    const fieldsToValidate: Record<number, (keyof EnrollmentInput)[]> = {
      0: ["name", "email", "age", "relationship", "location", "timezone"],
      1: ["learningGoal"],
      2: ["currentLevel"],
      3: ["preferredSchedule"],
    };
    const valid = await trigger(fieldsToValidate[step]);
    if (valid) setStep((s) => Math.min(s + 1, 4));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function toggleSchedule(slot: string) {
    const current = values.preferredSchedule || [];
    const updated = current.includes(slot)
      ? current.filter((s) => s !== slot)
      : [...current, slot];
    setValue("preferredSchedule", updated, { shouldValidate: true });
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-section-mobile">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="mx-auto h-16 w-16 text-primary" />
            <h2 className="mt-4 font-display text-2xl font-bold text-primary">
              Enrollment Submitted!
            </h2>
            <p className="mt-2 text-muted">
              Thank you for enrolling. Alma will review your application and
              get back to you within 24 hours.
            </p>
            <Button className="mt-6 min-h-[44px]" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-content items-center gap-2 px-section-mobile lg:px-section-desktop">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-primary">NoorPath</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 px-section-mobile py-8 lg:px-section-desktop">
        <h1 className="text-center font-display text-3xl font-bold text-primary">
          Enroll Now
        </h1>
        <p className="mt-2 text-center text-muted">
          Fill out the form below to start your Quran learning journey.
        </p>

        <div className="mt-8">
          <StepIndicator steps={STEPS} currentStep={step} />
        </div>

        {error && (
          <div className="mt-6 rounded-card bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Step 1: Personal Info */}
              {step === 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>I am enrolling for</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { value: "self", label: "Myself", icon: <User className="h-5 w-5" /> },
                        { value: "my_child", label: "My Child", icon: <Users className="h-5 w-5" /> },
                      ] as const).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setValue("relationship", opt.value, { shouldValidate: true })}
                          className={cn(
                            "flex items-center gap-2 rounded-card border-2 p-4 transition-colors",
                            values.relationship === opt.value
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50",
                          )}
                        >
                          {opt.icon}
                          <span className="text-sm font-medium">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                    {errors.relationship && (
                      <p className="text-xs text-destructive">{errors.relationship.message}</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter full name" {...register("name")} />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" placeholder="Age" {...register("age")} />
                      {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" placeholder="+92 300 1234567" {...register("phone")} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="City, Country" {...register("location")} />
                      {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        className="flex h-10 w-full rounded-card border border-input bg-surface px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...register("timezone")}
                      >
                        <option value="">Select timezone</option>
                        {TIMEZONES.map((tz) => (
                          <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
                        ))}
                      </select>
                      {errors.timezone && <p className="text-xs text-destructive">{errors.timezone.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Learning Goal */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-semibold">What would you like to learn?</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {LEARNING_GOALS.map((goal) => (
                      <button
                        key={goal.value}
                        type="button"
                        onClick={() => setValue("learningGoal", goal.value, { shouldValidate: true })}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-card border-2 p-6 text-center transition-colors",
                          values.learningGoal === goal.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full",
                          values.learningGoal === goal.value ? "bg-primary text-primary-foreground" : "bg-accent",
                        )}>
                          {goal.icon}
                        </div>
                        <span className="font-medium">{goal.label}</span>
                        <span className="text-xs text-muted">{goal.desc}</span>
                      </button>
                    ))}
                  </div>
                  {errors.learningGoal && (
                    <p className="text-xs text-destructive">{errors.learningGoal.message}</p>
                  )}
                </div>
              )}

              {/* Step 3: Current Level */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-semibold">What is your current level?</h2>
                  <div className="grid gap-3">
                    {LEVELS.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setValue("currentLevel", level.value, { shouldValidate: true })}
                        className={cn(
                          "flex items-center gap-4 rounded-card border-2 p-5 text-left transition-colors",
                          values.currentLevel === level.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <div className={cn(
                          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
                          values.currentLevel === level.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground",
                        )}>
                          {LEVELS.indexOf(level) + 1}
                        </div>
                        <div>
                          <p className="font-medium">{level.label}</p>
                          <p className="text-sm text-muted">{level.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.currentLevel && (
                    <p className="text-xs text-destructive">{errors.currentLevel.message}</p>
                  )}
                </div>
              )}

              {/* Step 4: Schedule */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-semibold">When are you available?</h2>
                  <p className="text-sm text-muted">Select all time slots that work for you.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="p-2 text-left text-xs font-medium text-muted" />
                          {TIME_SLOTS.map((slot) => (
                            <th key={slot} className="p-2 text-center text-xs font-medium text-muted">
                              {slot.split(" (")[0]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {DAYS.map((day) => (
                          <tr key={day} className="border-t border-border">
                            <td className="p-2 text-sm font-medium">{day.slice(0, 3)}</td>
                            {TIME_SLOTS.map((slot) => {
                              const id = `${day}-${slot.split(" (")[0]}`;
                              const selected = (values.preferredSchedule || []).includes(id);
                              return (
                                <td key={slot} className="p-1 text-center">
                                  <button
                                    type="button"
                                    onClick={() => toggleSchedule(id)}
                                    className={cn(
                                      "h-8 w-full min-w-[44px] rounded transition-colors",
                                      selected
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-border/50 hover:bg-accent",
                                    )}
                                    aria-label={`${day} ${slot}`}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {errors.preferredSchedule && (
                    <p className="text-xs text-destructive">{errors.preferredSchedule.message}</p>
                  )}
                </div>
              )}

              {/* Step 5: Review */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="font-display text-xl font-semibold">Review Your Information</h2>

                  <Card>
                    <CardContent className="divide-y divide-border p-0">
                      <ReviewRow label="Name" value={values.name} />
                      <ReviewRow label="Email" value={values.email} />
                      <ReviewRow label="Age" value={String(values.age)} />
                      <ReviewRow label="Enrolling for" value={values.relationship === "self" ? "Myself" : "My Child"} />
                      <ReviewRow label="Location" value={values.location} />
                      <ReviewRow label="Timezone" value={values.timezone?.replace(/_/g, " ")} />
                      <ReviewRow label="Learning Goal" value={
                        LEARNING_GOALS.find((g) => g.value === values.learningGoal)?.label || ""
                      } />
                      <ReviewRow label="Current Level" value={
                        LEVELS.find((l) => l.value === values.currentLevel)?.label || ""
                      } />
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-muted">Preferred Schedule</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {(values.preferredSchedule || []).map((s) => (
                            <Badge key={s} variant="accent" className="text-xs">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 0}
              className="min-h-[44px]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {step < 4 ? (
              <Button type="button" onClick={nextStep} className="min-h-[44px]">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="min-h-[44px]">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Enrollment
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm font-medium text-muted">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
