import { z } from "zod";

export const adminSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const changePasswordSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
