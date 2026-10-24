"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/guards";
import { failure, validationFailure, type ActionResult } from "@/lib/cms/action-result";
import {
  createSkill,
  deleteSkill,
  moveSkill,
  setSkillStatus,
  updateSkill,
} from "@/lib/cms/skills";
import {
  contentIdSchema,
  contentStatusSchema,
  moveDirectionSchema,
  skillInputSchema,
} from "@/lib/cms/validation";

const GENERIC_ERROR =
  "Terjadi kesalahan saat menyimpan skill. Coba lagi beberapa saat lagi.";

function revalidateSkills() {
  revalidatePath("/admin/skills");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createSkillAction(input: unknown): Promise<ActionResult> {
  await requireAdmin("/admin/skills");

  const parsed = skillInputSchema.safeParse(input);

  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    const id = await createSkill(parsed.data);
    revalidateSkills();

    return { ok: true, id };
  } catch (error) {
    console.error("createSkillAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function updateSkillAction(
  id: unknown,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/skills");

  const parsedId = contentIdSchema.safeParse(id);
  const parsedInput = skillInputSchema.safeParse(input);

  if (!parsedId.success) {
    return failure("ID skill tidak valid.");
  }

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  try {
    const updated = await updateSkill(parsedId.data, parsedInput.data);

    if (!updated) return failure("Skill tidak ditemukan.");

    revalidateSkills();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("updateSkillAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function deleteSkillAction(id: unknown): Promise<ActionResult> {
  await requireAdmin("/admin/skills");

  const parsedId = contentIdSchema.safeParse(id);

  if (!parsedId.success) {
    return failure("ID skill tidak valid.");
  }

  try {
    const deleted = await deleteSkill(parsedId.data);

    if (!deleted) return failure("Skill tidak ditemukan.");

    revalidateSkills();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("deleteSkillAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function setSkillStatusAction(
  id: unknown,
  status: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/skills");

  const parsedId = contentIdSchema.safeParse(id);
  const parsedStatus = contentStatusSchema.safeParse(status);

  if (!parsedId.success) {
    return failure("ID skill tidak valid.");
  }

  if (!parsedStatus.success) {
    return failure("Status skill tidak valid.");
  }

  try {
    const updated = await setSkillStatus(parsedId.data, parsedStatus.data);

    if (!updated) return failure("Skill tidak ditemukan.");

    revalidateSkills();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("setSkillStatusAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function moveSkillAction(
  id: unknown,
  direction: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/skills");

  const parsedId = contentIdSchema.safeParse(id);
  const parsedDirection = moveDirectionSchema.safeParse(direction);

  if (!parsedId.success) {
    return failure("ID skill tidak valid.");
  }

  if (!parsedDirection.success) {
    return failure("Arah perpindahan tidak valid.");
  }

  try {
    const moved = await moveSkill(parsedId.data, parsedDirection.data);

    if (!moved) {
      return failure("Skill sudah berada di urutan paling atas atau bawah.");
    }

    revalidateSkills();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("moveSkillAction failed", error);
    return failure(GENERIC_ERROR);
  }
}
