export type Locale = "en" | "ur";

export type UserRole = "STUDENT" | "PARENT" | "TEACHER";

export type SessionStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export type AssignmentStatus = "PENDING" | "SUBMITTED" | "REVIEWED" | "REDO";

export type InvoiceStatus = "PENDING" | "PAID" | "OVERDUE";

export interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}
