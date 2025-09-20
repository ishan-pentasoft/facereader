import { z } from "zod";

export const appointmentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),
  serviceSlug: z.string().min(1, "Please select a service"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()) && parsedDate < new Date();
    }, "Please enter a valid date of birth"),
  timeOfBirth: z
    .string()
    .min(1, "Time of birth is required")
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Please enter time in HH:MM format"
    ),
  placeOfBirth: z
    .string()
    .min(2, "Place of birth is required")
    .max(100, "Place of birth is too long"),
  additionalNotes: z.string().max(500, "Notes are too long").optional(),
});
export const appointmentUpdateSchema = appointmentFormSchema.partial();
