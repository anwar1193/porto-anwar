import { loadEnvConfig } from "@next/env";

import { closeDb, getDb } from "../lib/db/client";
import {
  achievements,
  experiences,
  projects,
  skills,
} from "../lib/db/schema";
import {
  seedAchievements,
  seedExperiences,
  seedProjects,
  seedSkills,
} from "../lib/cms/seed-data";

loadEnvConfig(process.cwd());

async function seedContent() {
  const db = getDb();
  const now = new Date();

  const [existingProjectRows, existingExperienceRows, existingSkillRows, existingAchievementRows] =
    await Promise.all([
      db.select({ id: projects.id }).from(projects),
      db.select({ id: experiences.id }).from(experiences),
      db.select({ id: skills.id }).from(skills),
      db.select({ id: achievements.id }).from(achievements),
    ]);

  const existingProjectIds = new Set(existingProjectRows.map((row) => row.id));
  const existingExperienceIds = new Set(
    existingExperienceRows.map((row) => row.id),
  );
  const existingSkillIds = new Set(existingSkillRows.map((row) => row.id));
  const existingAchievementIds = new Set(
    existingAchievementRows.map((row) => row.id),
  );

  await db
    .insert(projects)
    .values(
      seedProjects.map((project) => ({
        ...project,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(experiences)
    .values(
      seedExperiences.map((experience) => ({
        ...experience,
        createdAt: now,
        updatedAt: now,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(skills)
    .values(
      seedSkills.map((skill) => ({
        ...skill,
        createdAt: now,
        updatedAt: now,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(achievements)
    .values(
      seedAchievements.map((achievement) => ({
        ...achievement,
        createdAt: now,
        updatedAt: now,
      })),
    )
    .onConflictDoNothing();

  const insertedProjects = seedProjects.filter(
    (project) => !existingProjectIds.has(project.id),
  ).length;
  const insertedExperiences = seedExperiences.filter(
    (experience) => !existingExperienceIds.has(experience.id),
  ).length;
  const insertedSkills = seedSkills.filter(
    (skill) => !existingSkillIds.has(skill.id),
  ).length;
  const insertedAchievements = seedAchievements.filter(
    (achievement) => !existingAchievementIds.has(achievement.id),
  ).length;

  console.log(
    `Seed selesai: ${insertedProjects} projects, ${insertedExperiences} experiences, ${insertedSkills} skills, ${insertedAchievements} achievements.`,
  );
  console.log("Baris dengan ID yang sudah ada dilewati (tidak menimpa edit admin).");
}

seedContent()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => {
    closeDb();
  });
