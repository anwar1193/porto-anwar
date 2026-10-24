import { randomUUID } from "node:crypto";

import { asc, desc, eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { achievements } from "@/lib/db/schema";

import type { Achievement, CmsStatus } from "./types";
import type { AchievementInput } from "./validation";

export async function getAchievements(
  options: { publishedOnly?: boolean } = {},
): Promise<Achievement[]> {
  const db = getDb();
  const query = db.select().from(achievements);

  if (options.publishedOnly) {
    return query
      .where(eq(achievements.status, "published"))
      .orderBy(asc(achievements.sortOrder), desc(achievements.createdAt));
  }

  return query.orderBy(
    asc(achievements.sortOrder),
    desc(achievements.createdAt),
  );
}

export async function getAchievementById(
  id: string,
): Promise<Achievement | null> {
  const rows = await getDb()
    .select()
    .from(achievements)
    .where(eq(achievements.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function createAchievement(
  input: AchievementInput,
): Promise<string> {
  const db = getDb();
  const now = new Date();
  const id = randomUUID();

  const [maxRow] = await db
    .select({ max: sql<number>`coalesce(max(${achievements.sortOrder}), -1)` })
    .from(achievements);

  await db.insert(achievements).values({
    id,
    kind: input.kind,
    title: input.title,
    issuer: input.issuer,
    issuedAt: input.issuedAt,
    imageUrl: input.imageUrl,
    credentialUrl: input.credentialUrl,
    description: input.description,
    status: input.status,
    sortOrder: Number(maxRow?.max ?? -1) + 1,
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

export async function updateAchievement(
  id: string,
  input: AchievementInput,
): Promise<boolean> {
  const existing = await getAchievementById(id);
  if (!existing) return false;

  await getDb()
    .update(achievements)
    .set({
      kind: input.kind,
      title: input.title,
      issuer: input.issuer,
      issuedAt: input.issuedAt,
      imageUrl: input.imageUrl,
      credentialUrl: input.credentialUrl,
      description: input.description,
      status: input.status,
      updatedAt: new Date(),
    })
    .where(eq(achievements.id, id));

  return true;
}

export async function deleteAchievement(id: string): Promise<boolean> {
  const existing = await getAchievementById(id);
  if (!existing) return false;

  await getDb().delete(achievements).where(eq(achievements.id, id));
  return true;
}

export async function setAchievementStatus(
  id: string,
  status: CmsStatus,
): Promise<boolean> {
  const existing = await getAchievementById(id);
  if (!existing) return false;

  await getDb()
    .update(achievements)
    .set({ status, updatedAt: new Date() })
    .where(eq(achievements.id, id));

  return true;
}

export async function moveAchievement(
  id: string,
  direction: "up" | "down",
): Promise<boolean> {
  const db = getDb();
  const rows = await getAchievements();
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
        .update(achievements)
        .set({ sortOrder: nextIndex, updatedAt: now })
        .where(eq(achievements.id, row.id));
    }
  });

  return true;
}
