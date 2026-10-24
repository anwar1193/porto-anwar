import { randomUUID } from "node:crypto";

import { asc, desc, eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { experiences } from "@/lib/db/schema";

import type { CmsStatus, Experience } from "./types";
import type { ExperienceInput } from "./validation";

export async function getExperiences(
  options: { publishedOnly?: boolean } = {},
): Promise<Experience[]> {
  const db = getDb();
  const query = db.select().from(experiences);

  if (options.publishedOnly) {
    return query
      .where(eq(experiences.status, "published"))
      .orderBy(asc(experiences.sortOrder), desc(experiences.createdAt));
  }

  return query.orderBy(asc(experiences.sortOrder), desc(experiences.createdAt));
}

export async function getExperienceById(
  id: string,
): Promise<Experience | null> {
  const rows = await getDb()
    .select()
    .from(experiences)
    .where(eq(experiences.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function createExperience(input: ExperienceInput): Promise<string> {
  const db = getDb();
  const now = new Date();
  const id = randomUUID();

  const [maxRow] = await db
    .select({ max: sql<number>`coalesce(max(${experiences.sortOrder}), -1)` })
    .from(experiences);

  await db.insert(experiences).values({
    id,
    role: input.role,
    organization: input.organization,
    location: input.location,
    startDate: input.startDate,
    endDate: input.isCurrent ? null : input.endDate,
    isCurrent: input.isCurrent,
    description: input.description,
    icon: input.icon,
    status: input.status,
    sortOrder: Number(maxRow?.max ?? -1) + 1,
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

export async function updateExperience(
  id: string,
  input: ExperienceInput,
): Promise<boolean> {
  const existing = await getExperienceById(id);
  if (!existing) return false;

  await getDb()
    .update(experiences)
    .set({
      role: input.role,
      organization: input.organization,
      location: input.location,
      startDate: input.startDate,
      endDate: input.isCurrent ? null : input.endDate,
      isCurrent: input.isCurrent,
      description: input.description,
      icon: input.icon,
      status: input.status,
      updatedAt: new Date(),
    })
    .where(eq(experiences.id, id));

  return true;
}

export async function deleteExperience(id: string): Promise<boolean> {
  const existing = await getExperienceById(id);
  if (!existing) return false;

  await getDb().delete(experiences).where(eq(experiences.id, id));
  return true;
}

export async function setExperienceStatus(
  id: string,
  status: CmsStatus,
): Promise<boolean> {
  const existing = await getExperienceById(id);
  if (!existing) return false;

  await getDb()
    .update(experiences)
    .set({ status, updatedAt: new Date() })
    .where(eq(experiences.id, id));

  return true;
}

export async function moveExperience(
  id: string,
  direction: "up" | "down",
): Promise<boolean> {
  const db = getDb();
  const rows = await getExperiences();
  const index = rows.findIndex((row) => row.id === id);

  if (index < 0) return false;

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= rows.length) return false;

  const reordered = [...rows];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

  await db.transaction(async (tx) => {
    const now = new Date();

    for (const [nextIndex, row] of reordered.entries()) {
      await tx
        .update(experiences)
        .set({ sortOrder: nextIndex, updatedAt: now })
        .where(eq(experiences.id, row.id));
    }
  });

  return true;
}
