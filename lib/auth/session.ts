import { eq, lt } from "drizzle-orm";

import { getDb } from "../db/client";
import { sessions, users } from "../db/schema";
import {
  createSessionToken,
  hashSessionToken,
  sessionExpiresAt,
} from "./session-token";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type CreateSessionOptions = {
  remember?: boolean;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function createSession(
  userId: string,
  options: CreateSessionOptions = {},
): Promise<{ token: string; expiresAt: Date }> {
  const token = createSessionToken();
  const expiresAt = sessionExpiresAt(Boolean(options.remember));
  const now = new Date();

  await getDb().insert(sessions).values({
    id: hashSessionToken(token),
    userId,
    expiresAt,
    createdAt: now,
    ipAddress: options.ipAddress ?? null,
    userAgent: options.userAgent ?? null,
  });

  return { token, expiresAt };
}

export async function validateSession(
  token: string | null | undefined,
): Promise<SessionUser | null> {
  if (!token) return null;

  const sessionId = hashSessionToken(token);
  const db = getDb();

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  const row = rows[0];

  if (!row) return null;

  if (row.expiresAt.getTime() <= Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
  };
}

export async function destroySession(
  token: string | null | undefined,
): Promise<void> {
  if (!token) return;

  await getDb()
    .delete(sessions)
    .where(eq(sessions.id, hashSessionToken(token)));
}

export async function cleanupExpiredSessions(): Promise<void> {
  await getDb().delete(sessions).where(lt(sessions.expiresAt, new Date()));
}
