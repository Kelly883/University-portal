import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["ADMIN", "FACULTY", "STUDENT"]),
});

export const CourseSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  code: z.string().min(2, "Course code is required").toUpperCase(),
  facultyId: z.string().cuid("Invalid Faculty ID"),
});

export const EnrollmentSchema = z.object({
  studentId: z.string().cuid(),
  courseId: z.string().cuid(),
});

export const GradeSchema = z.object({
  studentId: z.string().cuid(),
  courseId: z.string().cuid(),
  grade: z.string().min(1, "Grade is required"),
});

export const PaymentSchema = z.object({
  studentId: z.string().cuid(),
  amount: z.number().positive("Amount must be positive"),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
});

export const NotificationSchema = z.object({
  userId: z.string().cuid(),
  title: z.string().min(1),
  message: z.string().min(1),
});
