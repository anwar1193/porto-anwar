import { z } from "zod";

const trimmedString = z.string().trim();

const optionalUrl = z
  .string()
  .trim()
  .max(2048)
  .optional()
  .transform((value) => (value && value.length > 0 ? value : null))
  .refine(
    (value) =>
      value === null ||
      value.startsWith("/") ||
      /^https?:\/\/[^\s]+$/i.test(value),
    "URL harus diawali https://, http://, atau /",
  );

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

const month = z
  .string()
  .trim()
  .regex(MONTH_PATTERN, "Gunakan format YYYY-MM");

const optionalMonth = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : null))
  .refine(
    (value) => value === null || MONTH_PATTERN.test(value),
    "Gunakan format YYYY-MM",
  );

const tagsSchema = z
  .preprocess(
    (value) => {
      if (typeof value === "string") {
        return value
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      if (Array.isArray(value)) {
        return value.map((tag) => String(tag).trim()).filter(Boolean);
      }

      return value;
    },
    z.array(trimmedString.min(1).max(60)).max(20),
  )
  .default([]);

const statusSchema = z.enum(["draft", "published"]);
const sortOrderSchema = z.coerce.number().int().min(0).default(0);

export const projectInputSchema = z.object({
  title: trimmedString.min(1, "Judul wajib diisi").max(160),
  summary: trimmedString.min(1, "Ringkasan wajib diisi").max(400),
  description: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  category: trimmedString.min(1, "Kategori wajib diisi").max(80),
  tags: tagsSchema,
  imageUrl: optionalUrl,
  repoUrl: optionalUrl,
  liveUrl: optionalUrl,
  badge: z
    .string()
    .trim()
    .max(24)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  status: statusSchema.default("draft"),
  sortOrder: sortOrderSchema,
});

export const experienceInputSchema = z
  .object({
    role: trimmedString.min(1, "Peran wajib diisi").max(160),
    organization: trimmedString.min(1, "Organisasi wajib diisi").max(160),
    location: z
      .string()
      .trim()
      .max(160)
      .optional()
      .transform((value) => (value && value.length > 0 ? value : null)),
    startDate: month,
    endDate: optionalMonth,
    isCurrent: z.boolean().default(false),
    description: trimmedString.min(1, "Deskripsi wajib diisi").max(3000),
    icon: trimmedString.min(1).max(60).default("work"),
    status: statusSchema.default("draft"),
    sortOrder: sortOrderSchema,
  })
  .superRefine((value, context) => {
    if (value.isCurrent && value.endDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Kosongkan tanggal selesai jika pengalaman masih aktif.",
      });
    }

    if (value.endDate && value.endDate < value.startDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai.",
      });
    }
  });

export const skillInputSchema = z.object({
  name: trimmedString.min(1, "Nama skill wajib diisi").max(100),
  category: trimmedString.min(1, "Kategori wajib diisi").max(80),
  yearsLabel: trimmedString.min(1, "Label pengalaman wajib diisi").max(40),
  proficiency: z.coerce.number().int().min(0).max(100).default(0),
  icon: trimmedString.min(1).max(60),
  status: statusSchema.default("draft"),
  sortOrder: sortOrderSchema,
});

export const achievementInputSchema = z.object({
  kind: z.enum(["certificate", "award"]).default("certificate"),
  title: trimmedString.min(1, "Judul wajib diisi").max(200),
  issuer: trimmedString.min(1, "Penerbit wajib diisi").max(160),
  issuedAt: optionalMonth,
  imageUrl: optionalUrl,
  credentialUrl: optionalUrl,
  description: z
    .string()
    .trim()
    .max(3000)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  status: statusSchema.default("draft"),
  sortOrder: sortOrderSchema,
});

export const contentIdSchema = z.string().trim().min(1, "ID tidak valid");

export const contentStatusSchema = z.enum(["draft", "published"]);
export const moveDirectionSchema = z.enum(["up", "down"]);

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ExperienceInput = z.infer<typeof experienceInputSchema>;
export type SkillInput = z.infer<typeof skillInputSchema>;
export type AchievementInput = z.infer<typeof achievementInputSchema>;
