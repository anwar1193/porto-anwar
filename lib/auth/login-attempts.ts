import { and, count, eq, gte, lt } from "drizzle-orm";

import { getDb } from "../db/client";
import { loginAttempts } from "../db/schema";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const ATTEMPT_RETENTION_MS = 24 * 60 * 60 * 1000;

type LoginIdentity = {
  email: string;
  ipAddress: string;
};

export async function isLoginRateLimited({
  email,
  ipAddress,
  now = new Date(),
}: LoginIdentity & { now?: Date }): Promise<boolean> {
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

  const rows = await getDb()
    .select({ total: count() })
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.email, email),
        eq(loginAttempts.ipAddress, ipAddress),
        eq(loginAttempts.success, false),
        gte(loginAttempts.attemptedAt, windowStart),
      ),
    );

  return Number(rows[0]?.total ?? 0) >= RATE_LIMIT_MAX_ATTEMPTS;
}

export async function recordLoginAttempt({
  email,
  ipAddress,
  success,
  attemptedAt = new Date(),
}: LoginIdentity & { success: boolean; attemptedAt?: Date }): Promise<void> {
  await getDb().insert(loginAttempts).values({
    email,
    ipAddress,
    success,
    attemptedAt,
  });
}

export async function clearFailedLoginAttempts(
  email: string,
  ipAddress: string,
): Promise<void> {
  await getDb()
    .delete(loginAttempts)
    .where(
      and(
        eq(loginAttempts.email, email),
        eq(loginAttempts.ipAddress, ipAddress),
        eq(loginAttempts.success, false),
      ),
    );
}

export async function cleanupOldLoginAttempts(now = new Date()): Promise<void> {
  const cutoff = new Date(now.getTime() - ATTEMPT_RETENTION_MS);

  await getDb()
    .delete(loginAttempts)
    .where(lt(loginAttempts.attemptedAt, cutoff));
}
