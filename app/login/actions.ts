"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { setSessionCookie } from "@/lib/auth/cookies";
import {
  clearFailedLoginAttempts,
  cleanupOldLoginAttempts,
  isLoginRateLimited,
  recordLoginAttempt,
} from "@/lib/auth/login-attempts";
import { verifyPassword } from "@/lib/auth/password";
import { getClientIp } from "@/lib/auth/request";
import {
  cleanupExpiredSessions,
  createSession,
} from "@/lib/auth/session";
import {
  loginSchema,
  normalizeEmail,
  sanitizeNextPath,
} from "@/lib/auth/validation";
import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

const GENERIC_LOGIN_ERROR = "Email atau password salah.";
const RATE_LIMIT_ERROR =
  "Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit.";
const DUMMY_PASSWORD_HASH =
  "$2b$12$6xeiWnYdB096nHinloLBVudO1kkycW/VP9piOj5rvnUdlTKsdAQxe";

type LoginInput = {
  email: string;
  password: string;
  remember: boolean;
  next?: string;
};

export async function loginAction(input: LoginInput): Promise<{ error: string }> {
  const parsed = loginSchema.safeParse({
    email: input.email,
    password: input.password,
    remember: input.remember,
    next: input.next,
  });

  if (!parsed.success) {
    return { error: GENERIC_LOGIN_ERROR };
  }

  const email = normalizeEmail(parsed.data.email);
  const requestHeaders = await headers();
  const ipAddress = getClientIp(requestHeaders.get("x-forwarded-for"));
  const userAgent = requestHeaders.get("user-agent")?.slice(0, 500) ?? null;

  if (await isLoginRateLimited({ email, ipAddress })) {
    return { error: RATE_LIMIT_ERROR };
  }

  const rows = await getDb()
    .select({
      id: users.id,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = rows[0];

  if (!user) {
    await verifyPassword(parsed.data.password, DUMMY_PASSWORD_HASH);
    await recordLoginAttempt({ email, ipAddress, success: false });

    return { error: GENERIC_LOGIN_ERROR };
  }

  const passwordMatches = await verifyPassword(
    parsed.data.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    await recordLoginAttempt({ email, ipAddress, success: false });

    return { error: GENERIC_LOGIN_ERROR };
  }

  await recordLoginAttempt({ email, ipAddress, success: true });
  await clearFailedLoginAttempts(email, ipAddress);

  const { token, expiresAt } = await createSession(user.id, {
    remember: parsed.data.remember,
    ipAddress,
    userAgent,
  });

  await Promise.allSettled([
    cleanupExpiredSessions(),
    cleanupOldLoginAttempts(),
  ]);

  await setSessionCookie(token, expiresAt);

  redirect(sanitizeNextPath(parsed.data.next));
}
