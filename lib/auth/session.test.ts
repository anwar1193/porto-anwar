import { randomUUID } from "node:crypto";
import { readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.TURSO_DATABASE_URL = "file:test-session.db";
});

import { getDb, closeDb } from "../db/client";
import { sessions, users } from "../db/schema";
import { createSession, destroySession, validateSession } from "./session";
import { hashSessionToken } from "./session-token";

const TEST_DB = "test-session.db";
let userId: string;
let userEmail: string;

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

describe("database-backed sessions", () => {
  beforeAll(async () => {
    closeDb();
    await prepareDatabase();

    userId = randomUUID();
    userEmail = "admin@test.dev";

    await getDb().insert(users).values({
      id: userId,
      email: userEmail,
      passwordHash: "$2b$12$not-used-in-this-test",
      name: "Test Admin",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  beforeEach(async () => {
    await getDb().delete(sessions);
  });

  it("stores only the hashed token and validates it back to the user", async () => {
    const { token } = await createSession(userId, {
      remember: false,
      ipAddress: "127.0.0.1",
      userAgent: "vitest",
    });

    const rows = await getDb().select().from(sessions);

    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe(hashSessionToken(token));
    expect(rows[0].id).not.toBe(token);

    await expect(validateSession(token)).resolves.toMatchObject({
      id: userId,
      email: userEmail,
      name: "Test Admin",
      role: "admin",
    });

    await destroySession(token);
    await expect(validateSession(token)).resolves.toBeNull();
  });

  it("rejects and removes an expired session", async () => {
    const token = "expired-session-token";
    const sessionId = hashSessionToken(token);

    await getDb().insert(sessions).values({
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() - 60_000),
      createdAt: new Date(Date.now() - 120_000),
    });

    await expect(validateSession(token)).resolves.toBeNull();

    const rows = await getDb()
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId));

    expect(rows).toHaveLength(0);
  });
});

afterAll(() => {
  closeDb();
  rmSync(TEST_DB, { force: true });
  rmSync(`${TEST_DB}-shm`, { force: true });
  rmSync(`${TEST_DB}-wal`, { force: true });
});
