import { z } from "zod";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export function failure(
  error: string,
  fieldErrors?: Record<string, string[]>,
): ActionResult {
  return { ok: false, error, fieldErrors };
}

export function validationFailure(
  error: z.ZodError,
  message = "Data belum valid. Periksa kembali isian Anda.",
): ActionResult {
  const flattened = z.flattenError(error);
  const fieldErrors = Object.fromEntries(
    Object.entries(flattened.fieldErrors).filter(
      (entry): entry is [string, string[]] => Array.isArray(entry[1]),
    ),
  );

  return failure(message, fieldErrors);
}
