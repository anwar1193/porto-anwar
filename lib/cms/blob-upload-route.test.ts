import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  handleUpload: vi.fn(),
}));

vi.mock("@/lib/auth/guards", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));

vi.mock("@vercel/blob/client", () => ({
  handleUpload: mocks.handleUpload,
}));

import { POST } from "@/app/api/blob/upload/route";

function buildRequest(body: unknown): Request {
  return new Request("http://localhost/api/blob/upload", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const tokenEvent = {
  type: "blob.generate-client-token",
  payload: {
    pathname: "cms/projects/my-photo.png",
    multipart: false,
    clientPayload: null,
  },
};

const completedEvent = {
  type: "blob.upload-completed",
  payload: {
    blob: {
      url: "https://store.public.blob.vercel-storage.com/cms/projects/my-photo.png",
      pathname: "cms/projects/my-photo.png",
      contentType: "image/png",
      contentDisposition: "inline",
    },
    tokenPayload: null,
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_test");
  mocks.handleUpload.mockResolvedValue({
    type: "blob.generate-client-token",
    clientToken: "client-token",
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/blob/upload", () => {
  it("rejects token generation without an admin session", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);

    const response = await POST(buildRequest(tokenEvent));

    expect(response.status).toBe(401);
    expect(mocks.handleUpload).not.toHaveBeenCalled();
  });

  it("issues a client token for an authenticated admin", async () => {
    mocks.getCurrentUser.mockResolvedValue({ id: "user-1" });

    const response = await POST(buildRequest(tokenEvent));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      type: "blob.generate-client-token",
      clientToken: "client-token",
    });
    expect(mocks.handleUpload).toHaveBeenCalledOnce();
  });

  it("rejects a pathname outside the cms prefix", async () => {
    mocks.getCurrentUser.mockResolvedValue({ id: "user-1" });

    const response = await POST(
      buildRequest({
        ...tokenEvent,
        payload: { ...tokenEvent.payload, pathname: "../secret.png" },
      }),
    );

    expect(response.status).toBe(400);
    expect(mocks.handleUpload).not.toHaveBeenCalled();
  });

  it("accepts the upload-completed callback without a session", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);
    mocks.handleUpload.mockResolvedValue({
      type: "blob.upload-completed",
      response: "ok",
    });

    const response = await POST(buildRequest(completedEvent));

    expect(response.status).toBe(200);
    expect(mocks.handleUpload).toHaveBeenCalledOnce();
  });

  it("rejects a malformed body", async () => {
    const response = await POST(buildRequest("{not-json"));

    expect(response.status).toBe(400);
    expect(mocks.handleUpload).not.toHaveBeenCalled();
  });

  it("rejects a token event without a payload", async () => {
    mocks.getCurrentUser.mockResolvedValue({ id: "user-1" });

    const response = await POST(
      buildRequest({ type: "blob.generate-client-token" }),
    );

    expect(response.status).toBe(400);
    expect(mocks.handleUpload).not.toHaveBeenCalled();
  });

  it("rejects a token event with a non-string pathname", async () => {
    mocks.getCurrentUser.mockResolvedValue({ id: "user-1" });

    const response = await POST(
      buildRequest({
        ...tokenEvent,
        payload: { ...tokenEvent.payload, pathname: 42 },
      }),
    );

    expect(response.status).toBe(400);
    expect(mocks.handleUpload).not.toHaveBeenCalled();
  });

  it("returns 503 when the blob credentials are missing", async () => {
    mocks.getCurrentUser.mockResolvedValue({ id: "user-1" });
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
    vi.stubEnv("BLOB_STORE_ID", "");
    vi.stubEnv("VERCEL_OIDC_TOKEN", "");

    const response = await POST(buildRequest(tokenEvent));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: expect.stringMatching(/BLOB_READ_WRITE_TOKEN/),
    });
    expect(mocks.handleUpload).not.toHaveBeenCalled();
  });

  it("returns 500 when the blob SDK fails", async () => {
    mocks.getCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.handleUpload.mockRejectedValue(new Error("no token"));

    const response = await POST(buildRequest(tokenEvent));

    expect(response.status).toBe(500);
  });
});
