import { z } from "zod";

export const serviceFormSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Title must be less than 100 characters"),
  price: z
    .number()
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least 0.01"),
  currency: z
    .string()
    .min(3, "Currency must be at least 3 characters")
    .max(3, "Currency must be exactly 3 characters")
    .default("CAD"),
  image: z.string().optional(),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters long")
    .max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

export const serviceUpdateSchema = serviceFormSchema.partial();
