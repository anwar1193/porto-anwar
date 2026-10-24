import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "./session-token";

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();

  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function setSessionCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
}
