import { z } from "zod";

export const contactDetailsSchema = z.object({
  phone1: z.string().min(10).optional(),
  phone2: z.string().min(10).optional(),
  whatsapp: z.string().min(10).optional(),
  email: z.email("Please enter a valid email address").optional(),
  address: z.string().min(5).optional(),
});
