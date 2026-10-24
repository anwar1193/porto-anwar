import { z } from "zod";

export const DEFAULT_ADMIN_PATH = "/admin";

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
  remember: z.boolean().default(false),
  next: z.string().optional(),
});

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function sanitizeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_ADMIN_PATH;
  }

  if (value.includes("\\") || /[\u0000-\u001f\u007f]/.test(value)) {
    return DEFAULT_ADMIN_PATH;
  }

  try {
    const base = "http://localhost";
    const url = new URL(value, base);

    if (url.origin !== base) {
      return DEFAULT_ADMIN_PATH;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_ADMIN_PATH;
  }
}
