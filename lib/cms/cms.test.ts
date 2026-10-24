import { readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@libsql/client";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.TURSO_DATABASE_URL = "file:test-cms.db";
});

import { closeDb, getDb } from "../db/client";
import {
  achievements,
  experiences,
  projects,
  skills,
} from "../db/schema";
import {
  createAchievement,
  deleteAchievement,
  getAchievements,
} from "./achievements";
import {
  createExperience,
  deleteExperience,
  getExperienceById,
} from "./experiences";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  moveProject,
  setProjectStatus,
  updateProject,
} from "./projects";
import { createSkill, deleteSkill, getSkills, moveSkill, setSkillStatus } from "./skills";
import { getCmsStats } from "./stats";
import {
  achievementInputSchema,
  experienceInputSchema,
  projectInputSchema,
  skillInputSchema,
} from "./validation";

const TEST_DB = "test-cms.db";

async function prepareDatabase() {
  rmSync(TEST_DB, { force: true });
  rmSync(`${TEST_DB}-shm`, { force: true });
  rmSync(`${TEST_DB}-wal`, { force: true });

  const client = createClient({ url: `file:${TEST_DB}` });
  const migrationFiles = readdirSync("drizzle")
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (migrationFiles.length === 0) throw new Error("No migration file found.");

  for (const migrationFile of migrationFiles) {
    const migration = readFileSync(join("drizzle", migrationFile), "utf8");

    for (const statement of migration.split("--> statement-breakpoint")) {
      if (statement.trim()) await client.execute(statement);
    }
  }

  await client.close();
}

function projectInput(overrides: Record<string, unknown> = {}) {
  return projectInputSchema.parse({
    title: "Project",
    summary: "A project summary.",
    category: "Fullstack Apps",
    status: "draft",
    ...overrides,
  });
}

describe("CMS data layer", () => {
  beforeAll(async () => {
    closeDb();
    await prepareDatabase();
  });

  beforeEach(async () => {
    const db = getDb();
    await db.delete(achievements);
    await db.delete(experiences);
    await db.delete(skills);
    await db.delete(projects);
  });

  it("creates drafts that stay out of public queries until published", async () => {
    const id = await createProject(projectInput());

    expect(await getProjectById(id)).toMatchObject({
      title: "Project",
      status: "draft",
      publishedAt: null,
    });
    expect(await getProjects({ publishedOnly: true })).toEqual([]);

    await setProjectStatus(id, "published");

    const published = await getProjects({ publishedOnly: true });

    expect(published.map((project) => project.id)).toEqual([id]);
    expect(published[0].publishedAt).toBeInstanceOf(Date);
  });

  it("updates a published project without clearing publishedAt", async () => {
    const id = await createProject(projectInput({ status: "published" }));
    const before = await getProjectById(id);

    await updateProject(
      id,
      projectInput({ title: "Updated title", status: "published" }),
    );

    const after = await getProjectById(id);

    expect(after?.title).toBe("Updated title");
    expect(after?.publishedAt?.getTime()).toBe(before?.publishedAt?.getTime());
  });

  it("reorders projects and deletes them", async () => {
    const first = await createProject(projectInput({ title: "First" }));
    const second = await createProject(projectInput({ title: "Second" }));

    expect((await getProjects()).map((project) => project.title)).toEqual([
      "First",
      "Second",
    ]);

    expect(await moveProject(second, "up")).toBe(true);
    expect((await getProjects()).map((project) => project.title)).toEqual([
      "Second",
      "First",
    ]);

    expect(await deleteProject(first)).toBe(true);
    await expect(getProjectById(first)).resolves.toBeNull();
  });

  it("creates an experience and clears endDate for a current role", async () => {
    const input = experienceInputSchema.parse({
      role: "Backend Engineer",
      organization: "Example Corp",
      startDate: "2021-10",
      endDate: "",
      isCurrent: true,
      description: "Built APIs.",
      status: "published",
    });

    const id = await createExperience(input);
    const experience = await getExperienceById(id);

    expect(experience).toMatchObject({
      role: "Backend Engineer",
      endDate: null,
      isCurrent: true,
    });

    expect(await deleteExperience(id)).toBe(true);
    await expect(getExperienceById(id)).resolves.toBeNull();
  });

  it("keeps draft skills and published achievements separate in public queries", async () => {
    const skillInput = skillInputSchema.parse({
      name: "TypeScript",
      category: "Frontend",
      yearsLabel: "2 Years",
      proficiency: 88,
      icon: "code",
      status: "draft",
    });
    const achievementInput = achievementInputSchema.parse({
      kind: "certificate",
      title: "Cloud Practitioner",
      issuer: "AWS",
      status: "published",
    });

    const skillId = await createSkill(skillInput);
    const achievementId = await createAchievement(achievementInput);

    expect(await getAchievements({ publishedOnly: true })).toHaveLength(1);

    await setSkillStatus(skillId, "published");

    const stats = await getCmsStats();

    expect(stats).toMatchObject({
      projects: 0,
      experiences: 0,
      skills: 1,
      achievements: 1,
      drafts: 0,
      published: 2,
    });

    expect(await deleteSkill(skillId)).toBe(true);
    expect(await deleteAchievement(achievementId)).toBe(true);
  });

  it("reorders skills within their category only", async () => {
    const alphaFirst = await createSkill(
      skillInputSchema.parse({
        name: "Alpha First",
        category: "Alpha",
        yearsLabel: "1 Year",
        proficiency: 80,
        icon: "code",
        status: "published",
      }),
    );
    const alphaSecond = await createSkill(
      skillInputSchema.parse({
        name: "Alpha Second",
        category: "Alpha",
        yearsLabel: "1 Year",
        proficiency: 80,
        icon: "code",
        status: "published",
      }),
    );
    const betaFirst = await createSkill(
      skillInputSchema.parse({
        name: "Beta First",
        category: "Beta",
        yearsLabel: "1 Year",
        proficiency: 80,
        icon: "code",
        status: "published",
      }),
    );

    expect((await getSkills()).map((skill) => skill.name)).toEqual([
      "Alpha First",
      "Alpha Second",
      "Beta First",
    ]);

    // The first skill in a category has nowhere to move within that category.
    expect(await moveSkill(betaFirst, "up")).toBe(false);

    expect(await moveSkill(alphaFirst, "down")).toBe(true);
    expect((await getSkills()).map((skill) => skill.name)).toEqual([
      "Alpha Second",
      "Alpha First",
      "Beta First",
    ]);

    await deleteSkill(alphaFirst);
    await deleteSkill(alphaSecond);
    await deleteSkill(betaFirst);
  });

  it("resets sort order when moving content and reports aggregate stats", async () => {
    const draftProject = await createProject(projectInput({ status: "draft" }));
    const publishedProject = await createProject(
      projectInput({ title: "Published", status: "published" }),
    );

    await setProjectStatus(draftProject, "published");

    const stats = await getCmsStats();

    expect(stats).toMatchObject({
      projects: 2,
      drafts: 0,
      published: 2,
    });

    expect(await deleteProject(publishedProject)).toBe(true);
  });
});

afterAll(() => {
  closeDb();
  rmSync(TEST_DB, { force: true });
  rmSync(`${TEST_DB}-shm`, { force: true });
  rmSync(`${TEST_DB}-wal`, { force: true });
});
