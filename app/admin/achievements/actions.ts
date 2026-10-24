"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/guards";
import { failure, validationFailure, type ActionResult } from "@/lib/cms/action-result";
import {
  createAchievement,
  deleteAchievement,
  moveAchievement,
  setAchievementStatus,
  updateAchievement,
} from "@/lib/cms/achievements";
import {
  achievementInputSchema,
  contentIdSchema,
  contentStatusSchema,
  moveDirectionSchema,
} from "@/lib/cms/validation";

const GENERIC_ERROR =
  "Terjadi kesalahan saat menyimpan pencapaian. Coba lagi beberapa saat lagi.";

function revalidateAchievements() {
  revalidatePath("/admin/achievements");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createAchievementAction(
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/achievements");

  const parsed = achievementInputSchema.safeParse(input);

  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    const id = await createAchievement(parsed.data);
    revalidateAchievements();

    return { ok: true, id };
  } catch (error) {
    console.error("createAchievementAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function updateAchievementAction(
  id: unknown,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/achievements");

  const parsedId = contentIdSchema.safeParse(id);
  const parsedInput = achievementInputSchema.safeParse(input);

  if (!parsedId.success) {
    return failure("ID pencapaian tidak valid.");
  }

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  try {
    const updated = await updateAchievement(parsedId.data, parsedInput.data);

    if (!updated) return failure("Pencapaian tidak ditemukan.");

    revalidateAchievements();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("updateAchievementAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function deleteAchievementAction(
  id: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/achievements");

  const parsedId = contentIdSchema.safeParse(id);

  if (!parsedId.success) {
    return failure("ID pencapaian tidak valid.");
  }

  try {
    const deleted = await deleteAchievement(parsedId.data);

    if (!deleted) return failure("Pencapaian tidak ditemukan.");

    revalidateAchievements();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("deleteAchievementAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function setAchievementStatusAction(
  id: unknown,
  status: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/achievements");

  const parsedId = contentIdSchema.safeParse(id);
  const parsedStatus = contentStatusSchema.safeParse(status);

  if (!parsedId.success) {
    return failure("ID pencapaian tidak valid.");
  }

  if (!parsedStatus.success) {
    return failure("Status pencapaian tidak valid.");
  }

  try {
    const updated = await setAchievementStatus(
      parsedId.data,
      parsedStatus.data,
    );

    if (!updated) return failure("Pencapaian tidak ditemukan.");

    revalidateAchievements();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("setAchievementStatusAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function moveAchievementAction(
  id: unknown,
  direction: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/achievements");

  const parsedId = contentIdSchema.safeParse(id);
  const parsedDirection = moveDirectionSchema.safeParse(direction);

  if (!parsedId.success) {
    return failure("ID pencapaian tidak valid.");
  }

  if (!parsedDirection.success) {
    return failure("Arah perpindahan tidak valid.");
  }

  try {
    const moved = await moveAchievement(parsedId.data, parsedDirection.data);

    if (!moved) {
      return failure(
        "Pencapaian sudah berada di urutan paling atas atau bawah.",
      );
    }

    revalidateAchievements();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("moveAchievementAction failed", error);
    return failure(GENERIC_ERROR);
  }
}
