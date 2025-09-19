import { z } from "zod";

export const pageSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  image: z.string(),
});

export const paynowSchema = z.object({
  image: z.string(),
});
