import { createHash, randomBytes } from "node:crypto";

export const SESSION_COOKIE_NAME = "anwar_admin_session";

const DEFAULT_SESSION_DAYS = 7;
const REMEMBER_SESSION_DAYS = 30;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function sessionExpiresAt(remember: boolean, now = new Date()): Date {
  const days = remember ? REMEMBER_SESSION_DAYS : DEFAULT_SESSION_DAYS;

  return new Date(now.getTime() + days * DAY_IN_MS);
}
