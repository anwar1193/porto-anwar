"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/guards";
import { failure, validationFailure, type ActionResult } from "@/lib/cms/action-result";
import {
  createExperience,
  deleteExperience,
  moveExperience,
  setExperienceStatus,
  updateExperience,
} from "@/lib/cms/experiences";
import {
  contentIdSchema,
  contentStatusSchema,
  experienceInputSchema,
  moveDirectionSchema,
} from "@/lib/cms/validation";

const GENERIC_ERROR =
  "Terjadi kesalahan saat menyimpan pengalaman. Coba lagi beberapa saat lagi.";

function revalidateExperiences() {
  revalidatePath("/admin/experiences");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createExperienceAction(
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/experiences");

  const parsed = experienceInputSchema.safeParse(input);

  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    const id = await createExperience(parsed.data);
    revalidateExperiences();

    return { ok: true, id };
  } catch (error) {
    console.error("createExperienceAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function updateExperienceAction(
  id: unknown,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/experiences");

  const parsedId = contentIdSchema.safeParse(id);
  const parsedInput = experienceInputSchema.safeParse(input);

  if (!parsedId.success) {
    return failure("ID pengalaman tidak valid.");
  }

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  try {
    const updated = await updateExperience(parsedId.data, parsedInput.data);

    if (!updated) return failure("Pengalaman tidak ditemukan.");

    revalidateExperiences();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("updateExperienceAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function deleteExperienceAction(
  id: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/experiences");

  const parsedId = contentIdSchema.safeParse(id);

  if (!parsedId.success) {
    return failure("ID pengalaman tidak valid.");
  }

  try {
    const deleted = await deleteExperience(parsedId.data);

    if (!deleted) return failure("Pengalaman tidak ditemukan.");

    revalidateExperiences();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("deleteExperienceAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function setExperienceStatusAction(
  id: unknown,
  status: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/experiences");

  const parsedId = contentIdSchema.safeParse(id);
  const parsedStatus = contentStatusSchema.safeParse(status);

  if (!parsedId.success) {
    return failure("ID pengalaman tidak valid.");
  }

  if (!parsedStatus.success) {
    return failure("Status pengalaman tidak valid.");
  }

  try {
    const updated = await setExperienceStatus(parsedId.data, parsedStatus.data);

    if (!updated) return failure("Pengalaman tidak ditemukan.");

    revalidateExperiences();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("setExperienceStatusAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function moveExperienceAction(
  id: unknown,
  direction: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/experiences");

  const parsedId = contentIdSchema.safeParse(id);
  const parsedDirection = moveDirectionSchema.safeParse(direction);

  if (!parsedId.success) {
    return failure("ID pengalaman tidak valid.");
  }

  if (!parsedDirection.success) {
    return failure("Arah perpindahan tidak valid.");
  }

  try {
    const moved = await moveExperience(parsedId.data, parsedDirection.data);

    if (!moved) {
      return failure(
        "Pengalaman sudah berada di urutan paling atas atau bawah.",
      );
    }

    revalidateExperiences();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("moveExperienceAction failed", error);
    return failure(GENERIC_ERROR);
  }
}
