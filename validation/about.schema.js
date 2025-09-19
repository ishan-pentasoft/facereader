import { z } from "zod";

export const aboutSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  image: z.string(),
});
