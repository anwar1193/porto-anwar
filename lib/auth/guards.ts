import { cache } from "react";
import { redirect } from "next/navigation";

import { getSessionToken } from "./cookies";
import { validateSession, type SessionUser } from "./session";
import { sanitizeNextPath } from "./validation";

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = await getSessionToken();

  return validateSession(token);
});

export async function requireAdmin(
  nextPath = "/admin",
): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (user) return user;

  const token = await getSessionToken();
  const params = new URLSearchParams({
    next: sanitizeNextPath(nextPath),
  });

  if (token) {
    params.set("reason", "expired");
  }

  redirect(`/login?${params.toString()}`);
}
