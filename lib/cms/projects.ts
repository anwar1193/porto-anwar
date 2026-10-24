import { randomUUID } from "node:crypto";

import { asc, desc, eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";

import type { CmsStatus, Project } from "./types";
import type { ProjectInput } from "./validation";

export async function getProjects(options: { publishedOnly?: boolean } = {}): Promise<Project[]> {
  const db = getDb();
  const query = db.select().from(projects);

  if (options.publishedOnly) {
    return query
      .where(eq(projects.status, "published"))
      .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
  }

  return query.orderBy(asc(projects.sortOrder), desc(projects.createdAt));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const rows = await getDb()
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function createProject(input: ProjectInput): Promise<string> {
  const db = getDb();
  const now = new Date();
  const id = randomUUID();

  const [maxRow] = await db
    .select({ max: sql<number>`coalesce(max(${projects.sortOrder}), -1)` })
    .from(projects);

  await db.insert(projects).values({
    id,
    title: input.title,
    summary: input.summary,
    description: input.description,
    category: input.category,
    tags: input.tags,
    imageUrl: input.imageUrl,
    repoUrl: input.repoUrl,
    liveUrl: input.liveUrl,
    badge: input.badge,
    status: input.status,
    sortOrder: Number(maxRow?.max ?? -1) + 1,
    publishedAt: input.status === "published" ? now : null,
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<boolean> {
  const existing = await getProjectById(id);

  if (!existing) return false;

  await getDb()
    .update(projects)
    .set({
      title: input.title,
      summary: input.summary,
      description: input.description,
      category: input.category,
      tags: input.tags,
      imageUrl: input.imageUrl,
      repoUrl: input.repoUrl,
      liveUrl: input.liveUrl,
      badge: input.badge,
      status: input.status,
      publishedAt:
        input.status === "published"
          ? (existing.publishedAt ?? new Date())
          : null,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  return true;
}

export async function deleteProject(id: string): Promise<boolean> {
  const existing = await getProjectById(id);
  if (!existing) return false;

  await getDb().delete(projects).where(eq(projects.id, id));
  return true;
}

export async function setProjectStatus(
  id: string,
  status: CmsStatus,
): Promise<boolean> {
  const existing = await getProjectById(id);
  if (!existing) return false;

  await getDb()
    .update(projects)
    .set({
      status,
      publishedAt:
        status === "published" ? (existing.publishedAt ?? new Date()) : null,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  return true;
}

export async function moveProject(
  id: string,
  direction: "up" | "down",
): Promise<boolean> {
  const db = getDb();
  const rows = await getProjects();
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
        .update(projects)
        .set({ sortOrder: nextIndex, updatedAt: now })
        .where(eq(projects.id, row.id));
    }
  });

  return true;
}
