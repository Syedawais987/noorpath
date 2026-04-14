import { z } from "zod";

export const enrollmentSchema = z.object({
  // Step 1: Personal info
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  age: z.coerce.number().min(4, "Age must be at least 4").max(100, "Please enter a valid age"),
  relationship: z.enum(["self", "my_child"], {
    required_error: "Please select who this enrollment is for",
  }),
  location: z.string().min(2, "Please enter your location"),
  timezone: z.string().min(1, "Please select your timezone"),

  // Step 2: Learning goal
  learningGoal: z.enum(["nazra", "hifz", "tajweed", "translation", "other"], {
    required_error: "Please select a learning goal",
  }),

  // Step 3: Current level
  currentLevel: z.enum(["beginner", "can_read_slowly", "reads_fluently"], {
    required_error: "Please select your current level",
  }),

  // Step 4: Preferred schedule
  preferredSchedule: z
    .array(z.string())
    .min(1, "Please select at least one time slot"),
});

export type EnrollmentInput = z.infer<typeof enrollmentSchema>;

// Step-level validation schemas
export const step1Schema = enrollmentSchema.pick({
  name: true,
  email: true,
  phone: true,
  age: true,
  relationship: true,
  location: true,
  timezone: true,
});

export const step2Schema = enrollmentSchema.pick({ learningGoal: true });
export const step3Schema = enrollmentSchema.pick({ currentLevel: true });
export const step4Schema = enrollmentSchema.pick({ preferredSchedule: true });
