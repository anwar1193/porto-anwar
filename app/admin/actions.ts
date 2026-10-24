"use server";

import { redirect } from "next/navigation";

import { clearSessionCookie, getSessionToken } from "@/lib/auth/cookies";
import { destroySession } from "@/lib/auth/session";

export async function logoutAction(): Promise<void> {
  const token = await getSessionToken();

  await destroySession(token);
  await clearSessionCookie();

  redirect("/login");
}
