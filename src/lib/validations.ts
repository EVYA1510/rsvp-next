import { z } from "zod";

export const RSVP_STATUS = ["yes", "maybe", "no"] as const;
export type RsvpStatus = (typeof RSVP_STATUS)[number];

export const RsvpSchema = z
  .object({
    name: z
      .string()
      .min(2, "שם חייב להכיל לפחות 2 תווים")
      .regex(
        /^[a-zA-Z0-9\u0590-\u05FF\s]+$/,
        "שם יכול להכיל אותיות, מספרים ורווחים בלבד"
      ),
    status: z.enum(RSVP_STATUS),
    guests: z.number().int().min(0).default(0),
    blessing: z
      .string()
      .max(500, "ברכה לא יכולה להיות ארוכה מ-500 תווים")
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.status === "yes" && val.guests < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "מספר אורחים חייב להיות 1 ומעלה כשמסמנים מגיע",
      });
    }
  });

export type RsvpFormData = z.infer<typeof RsvpSchema>;

export function validateRsvpForm(data: unknown): RsvpFormData {
  return RsvpSchema.parse(data);
}

export function validateRsvpFormSafe(data: unknown) {
  return RsvpSchema.safeParse(data);
}

export function isGasOk(d: any) {
  const ok = d?.ok === true || d?.success === true;
  const hasId = typeof d?.reportId === "string" && d.reportId.length > 0;
  const goodAction = ["create", "update"].includes(
    String(d?.action || "").toLowerCase()
  );
  return ok && (hasId || goodAction);
}
