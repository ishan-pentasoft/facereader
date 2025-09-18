import { z } from "zod";

export const reviewFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  review: z
    .string()
    .min(10, "Review must be at least 10 characters long")
    .max(500, "Review must be less than 500 characters"),
});
