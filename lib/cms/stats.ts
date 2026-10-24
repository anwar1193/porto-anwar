import { count } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import {
  achievements,
  experiences,
  projects,
  skills,
} from "@/lib/db/schema";

import type { CmsStats } from "./types";

type StatusCount = { status: string; total: number };

function summarize(rows: StatusCount[]) {
  return rows.reduce(
    (accumulator, row) => {
      accumulator.total += row.total;

      if (row.status === "published") {
        accumulator.published += row.total;
      } else if (row.status === "draft") {
        accumulator.drafts += row.total;
      }

      return accumulator;
    },
    { total: 0, drafts: 0, published: 0 },
  );
}

export async function getCmsStats(): Promise<CmsStats> {
  const db = getDb();

  const [projectRows, experienceRows, skillRows, achievementRows] =
    await Promise.all([
      db
        .select({ status: projects.status, total: count() })
        .from(projects)
        .groupBy(projects.status),
      db
        .select({ status: experiences.status, total: count() })
        .from(experiences)
        .groupBy(experiences.status),
      db
        .select({ status: skills.status, total: count() })
        .from(skills)
        .groupBy(skills.status),
      db
        .select({ status: achievements.status, total: count() })
        .from(achievements)
        .groupBy(achievements.status),
    ]);

  const projectStats = summarize(projectRows);
  const experienceStats = summarize(experienceRows);
  const skillStats = summarize(skillRows);
  const achievementStats = summarize(achievementRows);

  return {
    projects: projectStats.total,
    experiences: experienceStats.total,
    skills: skillStats.total,
    achievements: achievementStats.total,
    drafts:
      projectStats.drafts +
      experienceStats.drafts +
      skillStats.drafts +
      achievementStats.drafts,
    published:
      projectStats.published +
      experienceStats.published +
      skillStats.published +
      achievementStats.published,
  };
}
