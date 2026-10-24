"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/guards";
import { failure, validationFailure, type ActionResult } from "@/lib/cms/action-result";
import {
  createProject,
  deleteProject,
  moveProject,
  setProjectStatus,
  updateProject,
} from "@/lib/cms/projects";
import {
  contentIdSchema,
  contentStatusSchema,
  moveDirectionSchema,
  projectInputSchema,
} from "@/lib/cms/validation";

const GENERIC_ERROR =
  "Terjadi kesalahan saat menyimpan proyek. Coba lagi beberapa saat lagi.";

function revalidateProjects() {
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createProjectAction(input: unknown): Promise<ActionResult> {
  await requireAdmin("/admin/projects");

  const parsed = projectInputSchema.safeParse(input);

  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    const id = await createProject(parsed.data);
    revalidateProjects();

    return { ok: true, id };
  } catch (error) {
    console.error("createProjectAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function updateProjectAction(
  id: unknown,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/projects");

  const parsedId = contentIdSchema.safeParse(id);
  const parsedInput = projectInputSchema.safeParse(input);

  if (!parsedId.success) {
    return failure("ID proyek tidak valid.");
  }

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  try {
    const updated = await updateProject(parsedId.data, parsedInput.data);

    if (!updated) return failure("Proyek tidak ditemukan.");

    revalidateProjects();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("updateProjectAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function deleteProjectAction(id: unknown): Promise<ActionResult> {
  await requireAdmin("/admin/projects");

  const parsedId = contentIdSchema.safeParse(id);

  if (!parsedId.success) {
    return failure("ID proyek tidak valid.");
  }

  try {
    const deleted = await deleteProject(parsedId.data);

    if (!deleted) return failure("Proyek tidak ditemukan.");

    revalidateProjects();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("deleteProjectAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function setProjectStatusAction(
  id: unknown,
  status: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/projects");

  const parsedId = contentIdSchema.safeParse(id);
  const parsedStatus = contentStatusSchema.safeParse(status);

  if (!parsedId.success) {
    return failure("ID proyek tidak valid.");
  }

  if (!parsedStatus.success) {
    return failure("Status proyek tidak valid.");
  }

  try {
    const updated = await setProjectStatus(parsedId.data, parsedStatus.data);

    if (!updated) return failure("Proyek tidak ditemukan.");

    revalidateProjects();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("setProjectStatusAction failed", error);
    return failure(GENERIC_ERROR);
  }
}

export async function moveProjectAction(
  id: unknown,
  direction: unknown,
): Promise<ActionResult> {
  await requireAdmin("/admin/projects");

  const parsedId = contentIdSchema.safeParse(id);
  const parsedDirection = moveDirectionSchema.safeParse(direction);

  if (!parsedId.success) {
    return failure("ID proyek tidak valid.");
  }

  if (!parsedDirection.success) {
    return failure("Arah perpindahan tidak valid.");
  }

  try {
    const moved = await moveProject(parsedId.data, parsedDirection.data);

    if (!moved) return failure("Proyek sudah berada di urutan paling atas atau bawah.");

    revalidateProjects();

    return { ok: true, id: parsedId.data };
  } catch (error) {
    console.error("moveProjectAction failed", error);
    return failure(GENERIC_ERROR);
  }
}
