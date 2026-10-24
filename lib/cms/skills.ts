import { randomUUID } from "node:crypto";

import { asc, eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { skills } from "@/lib/db/schema";

import type { CmsStatus, Skill } from "./types";
import type { SkillInput } from "./validation";

export async function getSkills(
  options: { publishedOnly?: boolean } = {},
): Promise<Skill[]> {
  const db = getDb();
  const query = db.select().from(skills);

  if (options.publishedOnly) {
    return query
      .where(eq(skills.status, "published"))
      .orderBy(asc(skills.category), asc(skills.sortOrder));
  }

  return query.orderBy(asc(skills.category), asc(skills.sortOrder));
}

export async function getSkillById(id: string): Promise<Skill | null> {
  const rows = await getDb()
    .select()
    .from(skills)
    .where(eq(skills.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function createSkill(input: SkillInput): Promise<string> {
  const db = getDb();
  const now = new Date();
  const id = randomUUID();

  const [maxRow] = await db
    .select({ max: sql<number>`coalesce(max(${skills.sortOrder}), -1)` })
    .from(skills);

  await db.insert(skills).values({
    id,
    name: input.name,
    category: input.category,
    yearsLabel: input.yearsLabel,
    proficiency: input.proficiency,
    icon: input.icon,
    status: input.status,
    sortOrder: Number(maxRow?.max ?? -1) + 1,
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

export async function updateSkill(
  id: string,
  input: SkillInput,
): Promise<boolean> {
  const existing = await getSkillById(id);
  if (!existing) return false;

  await getDb()
    .update(skills)
    .set({
      name: input.name,
      category: input.category,
      yearsLabel: input.yearsLabel,
      proficiency: input.proficiency,
      icon: input.icon,
      status: input.status,
      updatedAt: new Date(),
    })
    .where(eq(skills.id, id));

  return true;
}

export async function deleteSkill(id: string): Promise<boolean> {
  const existing = await getSkillById(id);
  if (!existing) return false;

  await getDb().delete(skills).where(eq(skills.id, id));
  return true;
}

export async function setSkillStatus(
  id: string,
  status: CmsStatus,
): Promise<boolean> {
  const existing = await getSkillById(id);
  if (!existing) return false;

  await getDb()
    .update(skills)
    .set({ status, updatedAt: new Date() })
    .where(eq(skills.id, id));

  return true;
}

export async function moveSkill(
  id: string,
  direction: "up" | "down",
): Promise<boolean> {
  const db = getDb();
  const rows = await getSkills();
  const skill = rows.find((row) => row.id === id);

  if (!skill) return false;

  // The admin UI groups skills by category, so reordering must stay inside the
  // same category. Swapping across categories changes sortOrder without
  // changing the visible order inside either group.
  const categoryRows = rows.filter((row) => row.category === skill.category);
  const index = categoryRows.findIndex((row) => row.id === id);
  const target = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || target < 0 || target >= categoryRows.length) return false;

  const reordered = [...categoryRows];
  [reordered[index], reordered[target]] = [
    reordered[target],
    reordered[index],
  ];

  await db.transaction(async (tx) => {
    const now = new Date();

    for (const [nextIndex, row] of reordered.entries()) {
      await tx
        .update(skills)
        .set({ sortOrder: nextIndex, updatedAt: now })
        .where(eq(skills.id, row.id));
    }
  });

  return true;
}
