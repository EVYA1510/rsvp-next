import { z } from "zod";

// RSVP Status enum - canonical values for API
export const RSVP_STATUS = ["yes", "maybe", "no"] as const;
export type RsvpStatus = (typeof RSVP_STATUS)[number];

// RSVP Form Schema
export const RsvpSchema = z
  .object({
    name: z
      .string()
      .min(2, "שם חייב להכיל לפחות 2 תווים")
      .max(50, "שם לא יכול להיות ארוך מ-50 תווים")
      .regex(
        /^[a-zA-Z\u0590-\u05FF\s]+$/,
        "שם חייב להכיל רק אותיות עבריות, אנגליות ומרווחים"
      )
      .refine((val) => val.trim().length > 0, "שם לא יכול להיות ריק"),
    status: z.enum(RSVP_STATUS),
    guests: z
      .number()
      .int()
      .min(0, "מספר אורחים לא יכול להיות שלילי")
      .max(10, "מספר אורחים לא יכול להיות גדול מ-10")
      .default(0),
    blessing: z
      .string()
      .max(500, "ברכה לא יכולה להיות ארוכה מ-500 תווים")
      .optional(),
    id: z.string().min(3, "מזהה חייב להכיל לפחות 3 תווים"),
  })
  .superRefine((val, ctx) => {
    if (val.status === "yes" && val.guests < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "מספר אורחים חייב להיות 1 ומעלה כשמסמנים מגיע",
        path: ["guests"],
      });
    }
  });

// Legacy schema for backward compatibility
export const RSVPStatusSchema = z.enum(["מגיע", "אולי", "לא מגיע"]);
export const RSVPFormSchema = RsvpSchema;

// Guest ID Schema
export const GuestIdSchema = z
  .string()
  .min(1, "מזהה אורח חייב להיות קיים")
  .regex(/^rsvp_\d+_[a-z0-9]+$/, "מזהה אורח לא תקין");

// URL Parameters Schema
export const URLParamsSchema = z.object({
  name: z.string().optional(),
  id: z.string().optional(),
});

// API Response Schema
export const APIResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
});

// Types derived from schemas
export type RSVPFormData = z.infer<typeof RsvpSchema>;
export type RSVPStatus = z.infer<typeof RSVPStatusSchema>;
export type GuestId = z.infer<typeof GuestIdSchema>;
export type URLParams = z.infer<typeof URLParamsSchema>;
export type APIResponse = z.infer<typeof APIResponseSchema>;

// Validation functions
export const validateRSVPForm = (data: unknown): RSVPFormData => {
  return RsvpSchema.parse(data);
};

export const validateGuestId = (id: unknown): GuestId => {
  return GuestIdSchema.parse(id);
};

export const validateURLParams = (params: unknown): URLParams => {
  return URLParamsSchema.parse(params);
};

// Safe validation functions (return errors instead of throwing)
export const safeValidateRSVPForm = (data: unknown) => {
  return RsvpSchema.safeParse(data);
};

export const safeValidateGuestId = (id: unknown) => {
  return GuestIdSchema.safeParse(id);
};
