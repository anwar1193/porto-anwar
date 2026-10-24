import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const cmsStatus = ["draft", "published"] as const;
export type CmsStatus = (typeof cmsStatus)[number];

export const achievementKinds = ["certificate", "award"] as const;
export type AchievementKind = (typeof achievementKinds)[number];

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    lastSeenAt: integer("last_seen_at", { mode: "timestamp" }),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_expires_at_idx").on(table.expiresAt),
  ],
);

export const loginAttempts = sqliteTable(
  "login_attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email"),
    ipAddress: text("ip_address"),
    attemptedAt: integer("attempted_at", { mode: "timestamp" }).notNull(),
    success: integer("success", { mode: "boolean" }).notNull().default(false),
  },
  (table) => [
    index("login_attempts_email_attempted_at_idx").on(
      table.email,
      table.attemptedAt,
    ),
    index("login_attempts_ip_attempted_at_idx").on(
      table.ipAddress,
      table.attemptedAt,
    ),
  ],
);

export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    description: text("description"),
    category: text("category").notNull(),
    tags: text("tags", { mode: "json" })
      .$type<string[]>()
      .notNull()
      .default([]),
    imageUrl: text("image_url"),
    repoUrl: text("repo_url"),
    liveUrl: text("live_url"),
    badge: text("badge"),
    status: text("status", { enum: cmsStatus }).notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    publishedAt: integer("published_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("projects_status_sort_idx").on(table.status, table.sortOrder),
    index("projects_category_idx").on(table.category),
  ],
);

export const experiences = sqliteTable(
  "experiences",
  {
    id: text("id").primaryKey(),
    role: text("role").notNull(),
    organization: text("organization").notNull(),
    location: text("location"),
    startDate: text("start_date").notNull(),
    endDate: text("end_date"),
    isCurrent: integer("is_current", { mode: "boolean" })
      .notNull()
      .default(false),
    description: text("description").notNull(),
    icon: text("icon").notNull().default("work"),
    status: text("status", { enum: cmsStatus }).notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("experiences_status_sort_idx").on(table.status, table.sortOrder),
  ],
);

export const skills = sqliteTable(
  "skills",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    yearsLabel: text("years_label").notNull(),
    proficiency: integer("proficiency").notNull().default(0),
    icon: text("icon").notNull(),
    status: text("status", { enum: cmsStatus }).notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("skills_status_sort_idx").on(table.status, table.sortOrder),
    index("skills_category_idx").on(table.category),
  ],
);

export const achievements = sqliteTable(
  "achievements",
  {
    id: text("id").primaryKey(),
    kind: text("kind", { enum: achievementKinds })
      .notNull()
      .default("certificate"),
    title: text("title").notNull(),
    issuer: text("issuer").notNull(),
    issuedAt: text("issued_at"),
    imageUrl: text("image_url"),
    credentialUrl: text("credential_url"),
    description: text("description"),
    status: text("status", { enum: cmsStatus }).notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("achievements_status_sort_idx").on(table.status, table.sortOrder),
    index("achievements_kind_idx").on(table.kind),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type ProjectRow = typeof projects.$inferSelect;
export type ExperienceRow = typeof experiences.$inferSelect;
export type SkillRow = typeof skills.$inferSelect;
export type AchievementRow = typeof achievements.$inferSelect;
