import { randomUUID } from "node:crypto";

import { loadEnvConfig } from "@next/env";
import { eq } from "drizzle-orm";

import { hashPassword } from "../lib/auth/password";
import { getDb } from "../lib/db/client";
import { users } from "../lib/db/schema";

loadEnvConfig(process.cwd());

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const name = process.env.ADMIN_NAME?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !name || !password) {
    throw new Error(
      "ADMIN_EMAIL, ADMIN_NAME, and ADMIN_PASSWORD are required to seed the admin user.",
    );
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  }

  const passwordHash = await hashPassword(password);
  const now = new Date();
  const db = getDb();

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing[0]) {
    await db
      .update(users)
      .set({ name, passwordHash, updatedAt: now })
      .where(eq(users.id, existing[0].id));

    console.log(`Updated admin user ${email}.`);
    return;
  }

  await db.insert(users).values({
    id: randomUUID(),
    email,
    passwordHash,
    name,
    role: "admin",
    createdAt: now,
    updatedAt: now,
  });

  console.log(`Created admin user ${email}.`);
}

seedAdmin().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
