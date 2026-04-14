import { z } from "zod";

export const createSessionSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  startTime: z.string().min(1, "Start time is required"),
  duration: z.coerce.number().refine((v) => [30, 45, 60].includes(v), "Duration must be 30, 45, or 60 minutes"),
});

export const createAssignmentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  title: z.string().min(1, "Title is required").max(500),
  description: z.string().max(2000).optional(),
  dueDate: z.string().optional(),
});

export const reviewAssignmentSchema = z.object({
  status: z.enum(["REVIEWED", "REDO", "PENDING", "SUBMITTED"]),
  feedback: z.string().max(2000).optional(),
});

export const createInvoiceSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  currency: z.enum(["PKR", "USD"]).default("PKR"),
  dueDate: z.string().min(1, "Due date is required"),
});

export const updateInvoiceSchema = z.object({
  status: z.enum(["PENDING", "PAID", "OVERDUE"]),
  paymentMethod: z.string().max(100).optional(),
});

export const createAvailabilitySchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:MM format"),
});

export const sessionNoteSchema = z.object({
  content: z.string().max(5000).optional(),
  studentFeedback: z.string().max(2000).optional(),
  tajweedScore: z.coerce.number().int().min(1).max(5).optional().nullable(),
  attendanceStatus: z.enum(["PRESENT", "ABSENT", "LATE"]).default("PRESENT"),
});

export const createProgressSchema = z.object({
  studentProfileId: z.string().min(1),
  surahName: z.string().max(200).optional(),
  paraNumber: z.coerce.number().int().min(1).max(30).optional().nullable(),
  lessonNumber: z.coerce.number().int().min(1).optional().nullable(),
  notes: z.string().max(2000).optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  phone: z.string().max(20).optional().nullable(),
  timezone: z.string().min(1, "Timezone is required"),
  whatsappOptedIn: z.boolean().default(false),
});

export const submitAssignmentSchema = z.object({
  text: z.string().max(10000).optional(),
});
