import { readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@libsql/client";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.TURSO_DATABASE_URL = "file:test-login-attempts.db";
});

import { closeDb, getDb } from "../db/client";
import { loginAttempts } from "../db/schema";
import {
  clearFailedLoginAttempts,
  cleanupOldLoginAttempts,
  isLoginRateLimited,
  recordLoginAttempt,
} from "./login-attempts";
import { getClientIp } from "./request";

const TEST_DB = "test-login-attempts.db";
const EMAIL = "admin@test.dev";
const IP = "127.0.0.1";

async function prepareDatabase() {
  rmSync(TEST_DB, { force: true });
  rmSync(`${TEST_DB}-shm`, { force: true });
  rmSync(`${TEST_DB}-wal`, { force: true });

  const client = createClient({ url: `file:${TEST_DB}` });
  const migrationFile = readdirSync("drizzle")
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .at(-1);

  if (!migrationFile) throw new Error("No migration file found.");

  const migration = readFileSync(join("drizzle", migrationFile), "utf8");

  for (const statement of migration.split("--> statement-breakpoint")) {
    if (statement.trim()) await client.execute(statement);
  }

  await client.close();
}

describe("login rate limiting", () => {
  beforeAll(async () => {
    closeDb();
    await prepareDatabase();
  });

  beforeEach(async () => {
    await getDb().delete(loginAttempts);
  });

  it("allows four failed attempts and blocks the fifth within 15 minutes", async () => {
    const now = new Date("2026-01-01T12:00:00.000Z");

    for (let index = 0; index < 4; index += 1) {
      await recordLoginAttempt({
        email: EMAIL,
        ipAddress: IP,
        success: false,
        attemptedAt: now,
      });
    }

    await expect(
      isLoginRateLimited({ email: EMAIL, ipAddress: IP, now }),
    ).resolves.toBe(false);

    await recordLoginAttempt({
      email: EMAIL,
      ipAddress: IP,
      success: false,
      attemptedAt: now,
    });

    await expect(
      isLoginRateLimited({ email: EMAIL, ipAddress: IP, now }),
    ).resolves.toBe(true);
  });

  it("ignores failed attempts older than 15 minutes", async () => {
    const now = new Date("2026-01-01T12:00:00.000Z");
    const old = new Date(now.getTime() - 16 * 60 * 1000);

    for (let index = 0; index < 5; index += 1) {
      await recordLoginAttempt({
        email: EMAIL,
        ipAddress: IP,
        success: false,
        attemptedAt: old,
      });
    }

    await expect(
      isLoginRateLimited({ email: EMAIL, ipAddress: IP, now }),
    ).resolves.toBe(false);
  });

  it("clears failed attempts after a successful login", async () => {
    await recordLoginAttempt({
      email: EMAIL,
      ipAddress: IP,
      success: false,
    });

    await clearFailedLoginAttempts(EMAIL, IP);

    const rows = await getDb().select().from(loginAttempts);
    expect(rows).toHaveLength(0);
  });

  it("removes login attempts older than 24 hours", async () => {
    const now = new Date("2026-01-02T12:00:00.000Z");

    await recordLoginAttempt({
      email: EMAIL,
      ipAddress: IP,
      success: true,
      attemptedAt: new Date(now.getTime() - 25 * 60 * 60 * 1000),
    });
    await recordLoginAttempt({
      email: EMAIL,
      ipAddress: IP,
      success: true,
      attemptedAt: now,
    });

    await cleanupOldLoginAttempts(now);

    const rows = await getDb().select().from(loginAttempts);
    expect(rows).toHaveLength(1);
  });
});

describe("client IP extraction", () => {
  it("uses the first forwarded address and falls back to unknown", () => {
    expect(getClientIp("203.0.113.10, 10.0.0.1")).toBe("203.0.113.10");
    expect(getClientIp(" 203.0.113.10 ")).toBe("203.0.113.10");
    expect(getClientIp(null)).toBe("unknown");
  });
});
