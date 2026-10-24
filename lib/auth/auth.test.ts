import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "./password";
import {
  createSessionToken,
  hashSessionToken,
  sessionExpiresAt,
} from "./session-token";
import { normalizeEmail, sanitizeNextPath } from "./validation";

describe("password hashing", () => {
  it("hashes a password with bcrypt cost 12 and verifies it", async () => {
    const hash = await hashPassword("correct horse battery staple");

    expect(hash).not.toBe("correct horse battery staple");
    expect(hash).toMatch(/^\$2[aby]\$12\$/);
    await expect(verifyPassword("correct horse battery staple", hash)).resolves.toBe(
      true,
    );
    await expect(verifyPassword("wrong password", hash)).resolves.toBe(false);
  });
});

describe("session tokens", () => {
  it("creates a 32-byte random token and stores only its SHA-256 hash", () => {
    const first = createSessionToken();
    const second = createSessionToken();

    expect(first).toHaveLength(43);
    expect(second).toHaveLength(43);
    expect(first).not.toBe(second);
    expect(hashSessionToken(first)).toMatch(/^[a-f0-9]{64}$/);
    expect(hashSessionToken(first)).toBe(hashSessionToken(first));
    expect(hashSessionToken(first)).not.toBe(hashSessionToken(second));
  });

  it("expires in 7 days by default and 30 days with remember me", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");

    expect(sessionExpiresAt(false, now).toISOString()).toBe(
      "2026-01-08T00:00:00.000Z",
    );
    expect(sessionExpiresAt(true, now).toISOString()).toBe(
      "2026-01-31T00:00:00.000Z",
    );
  });
});

describe("login validation", () => {
  it("normalizes email casing and surrounding whitespace", () => {
    expect(normalizeEmail("  Admin@Example.COM  ")).toBe("admin@example.com");
  });

  it("only allows internal paths for post-login redirects", () => {
    expect(sanitizeNextPath("/admin")).toBe("/admin");
    expect(sanitizeNextPath("/admin/projects?tab=all")).toBe(
      "/admin/projects?tab=all",
    );
    expect(sanitizeNextPath("https://evil.example/phish")).toBe("/admin");
    expect(sanitizeNextPath("//evil.example/phish")).toBe("/admin");
    expect(sanitizeNextPath("javascript:alert(1)")).toBe("/admin");
    expect(sanitizeNextPath(undefined)).toBe("/admin");
  });
});
