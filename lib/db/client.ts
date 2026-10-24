import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";

import * as schema from "./schema";

type Database = LibSQLDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  libsqlClient?: Client;
  drizzleDb?: Database;
};

function getDatabaseUrl(): string {
  const url = process.env.TURSO_DATABASE_URL;

  if (url) return url;

  if (process.env.NODE_ENV !== "production") {
    return "file:local.db";
  }

  throw new Error("TURSO_DATABASE_URL is not configured.");
}

export function getDb(): Database {
  if (globalForDb.drizzleDb) return globalForDb.drizzleDb;

  const client = createClient({
    url: getDatabaseUrl(),
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const db = drizzle(client, { schema });

  globalForDb.libsqlClient = client;
  globalForDb.drizzleDb = db;

  return db;
}

export function closeDb(): void {
  globalForDb.libsqlClient?.close();
  globalForDb.libsqlClient = undefined;
  globalForDb.drizzleDb = undefined;
}
