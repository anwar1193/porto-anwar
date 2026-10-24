import { describe, expect, it } from "vitest";

import {
  achievementInputSchema,
  experienceInputSchema,
  projectInputSchema,
  skillInputSchema,
} from "./validation";

describe("projectInputSchema", () => {
  const base = {
    title: "Portfolio CMS",
    summary: "CRUD content from one panel.",
    category: "Fullstack Apps",
  };

  it("parses comma-separated tags into a trimmed array", () => {
    const result = projectInputSchema.parse({
      ...base,
      tags: " React, TypeScript ,  Drizzle ",
    });

    expect(result.tags).toEqual(["React", "TypeScript", "Drizzle"]);
  });

  it("accepts an internal image path and rejects a script URL", () => {
    expect(
      projectInputSchema.parse({ ...base, imageUrl: "/images/project.png" })
        .imageUrl,
    ).toBe("/images/project.png");

    expect(
      projectInputSchema.safeParse({ ...base, imageUrl: "javascript:alert(1)" })
        .success,
    ).toBe(false);
  });
});

describe("experienceInputSchema", () => {
  const base = {
    role: "Backend Engineer",
    organization: "Example Corp",
    description: "Built and maintained APIs.",
  };

  it("normalizes an empty end date to null for a current position", () => {
    const result = experienceInputSchema.parse({
      ...base,
      startDate: "2021-10",
      endDate: "",
      isCurrent: true,
    });

    expect(result.endDate).toBeNull();
  });

  it("rejects an end date on a current position", () => {
    const result = experienceInputSchema.safeParse({
      ...base,
      startDate: "2021-10",
      endDate: "2022-01",
      isCurrent: true,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an end date earlier than the start date", () => {
    const result = experienceInputSchema.safeParse({
      ...base,
      startDate: "2022-01",
      endDate: "2021-10",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a month outside the YYYY-MM format", () => {
    const result = experienceInputSchema.safeParse({
      ...base,
      startDate: "2021-13",
    });

    expect(result.success).toBe(false);
  });
});

describe("skill and achievement schemas", () => {
  it("coerces proficiency from a form string and rejects values over 100", () => {
    const valid = skillInputSchema.parse({
      name: "TypeScript",
      category: "Frontend",
      yearsLabel: "2 Years",
      proficiency: "88",
      icon: "code",
    });

    expect(valid.proficiency).toBe(88);

    const invalid = skillInputSchema.safeParse({
      name: "TypeScript",
      category: "Frontend",
      yearsLabel: "2 Years",
      proficiency: "101",
      icon: "code",
    });

    expect(invalid.success).toBe(false);
  });

  it("normalizes an empty issued-at value to null", () => {
    const result = achievementInputSchema.parse({
      kind: "certificate",
      title: "Cloud Practitioner",
      issuer: "AWS",
      issuedAt: "",
    });

    expect(result.issuedAt).toBeNull();
  });
});
