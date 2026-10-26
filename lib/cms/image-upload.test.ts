import { describe, expect, it } from "vitest";

import {
  ALLOWED_IMAGE_TYPES,
  IMAGE_MAX_BYTES,
  buildImagePathname,
  buildUploadTokenOptions,
  describeImageUploadError,
  hasBlobCredentials,
  isCmsUploadPathname,
  validateImageFile,
} from "./image-upload";

describe("validateImageFile", () => {
  it("accepts a supported image under the size limit", () => {
    expect(
      validateImageFile({ type: "image/png", size: 1024 }),
    ).toBeNull();
  });

  it("rejects SVG because it can carry executable content", () => {
    expect(
      validateImageFile({ type: "image/svg+xml", size: 1024 }),
    ).toMatch(/format/i);
  });

  it("rejects non-image files", () => {
    expect(
      validateImageFile({ type: "application/pdf", size: 1024 }),
    ).toMatch(/format/i);
  });

  it("rejects an empty MIME type", () => {
    expect(validateImageFile({ type: "", size: 1024 })).toMatch(/format/i);
  });

  it("rejects an image above the size limit", () => {
    expect(
      validateImageFile({ type: "image/jpeg", size: IMAGE_MAX_BYTES + 1 }),
    ).toMatch(/ukuran|size/i);
  });

  it("accepts an image exactly at the size limit", () => {
    expect(
      validateImageFile({ type: "image/jpeg", size: IMAGE_MAX_BYTES }),
    ).toBeNull();
  });

  it("only allows the documented content types", () => {
    expect([...ALLOWED_IMAGE_TYPES]).toEqual([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ]);
  });
});

describe("buildImagePathname", () => {
  it("builds a prefixed, sanitized path", () => {
    expect(buildImagePathname("projects", "My Photo.PNG")).toBe(
      "cms/projects/my-photo.png",
    );
  });

  it("strips directory components to prevent traversal", () => {
    expect(buildImagePathname("projects", "../../etc/evil.png")).toBe(
      "cms/projects/evil.png",
    );
  });

  it("sanitizes the prefix", () => {
    expect(buildImagePathname("../Bad Prefix!", "shot.webp")).toBe(
      "cms/badprefix/shot.webp",
    );
  });

  it("falls back to a generic name when the filename is unusable", () => {
    expect(buildImagePathname("achievements", "!!!.png")).toBe(
      "cms/achievements/image.png",
    );
  });

  it("drops an unrecognized extension", () => {
    expect(buildImagePathname("achievements", "certificate.exe")).toBe(
      "cms/achievements/certificate",
    );
  });

  it("collapses repeated dashes and trims them", () => {
    expect(buildImagePathname("skills", "---a---b---.jpeg")).toBe(
      "cms/skills/a-b.jpeg",
    );
  });
});

describe("buildUploadTokenOptions", () => {
  it("limits uploads to the allowed image types and size", () => {
    expect(buildUploadTokenOptions()).toEqual({
      allowedContentTypes: [...ALLOWED_IMAGE_TYPES],
      maximumSizeInBytes: IMAGE_MAX_BYTES,
      addRandomSuffix: true,
    });
  });
});

describe("hasBlobCredentials", () => {
  it("accepts a read-write token", () => {
    expect(
      hasBlobCredentials({ BLOB_READ_WRITE_TOKEN: "vercel_blob_rw_test" }),
    ).toBe(true);
  });

  it("rejects OIDC-only configuration because the token route needs a read-write token", () => {
    expect(
      hasBlobCredentials({
        BLOB_STORE_ID: "store_test",
        VERCEL_OIDC_TOKEN: "oidc_test",
      }),
    ).toBe(false);
  });

  it("rejects a store id without an OIDC token", () => {
    expect(hasBlobCredentials({ BLOB_STORE_ID: "store_test" })).toBe(false);
  });

  it("rejects empty or whitespace values", () => {
    expect(
      hasBlobCredentials({
        BLOB_READ_WRITE_TOKEN: "",
        BLOB_STORE_ID: "  ",
        VERCEL_OIDC_TOKEN: " ",
      }),
    ).toBe(false);
  });

  it("rejects a missing configuration", () => {
    expect(hasBlobCredentials({})).toBe(false);
  });
});

describe("describeImageUploadError", () => {
  it("explains how to fix a missing blob token", () => {
    expect(
      describeImageUploadError(
        new Error("Vercel Blob: Failed to retrieve the client token"),
      ),
    ).toMatch(/BLOB_READ_WRITE_TOKEN/);
  });

  it("also recognizes the SDK's variant with a double space", () => {
    expect(
      describeImageUploadError(
        new Error("Vercel Blob: Failed to  retrieve the client token"),
      ),
    ).toMatch(/BLOB_READ_WRITE_TOKEN/);
  });

  it("keeps other error messages as they are", () => {
    expect(describeImageUploadError(new Error("Jaringan bermasalah."))).toBe(
      "Jaringan bermasalah.",
    );
  });

  it("falls back for non-error values", () => {
    expect(describeImageUploadError("boom")).toMatch(/coba lagi/i);
  });
});

describe("isCmsUploadPathname", () => {
  it("accepts a pathname under the cms prefix", () => {
    expect(isCmsUploadPathname("cms/projects/my-photo.png")).toBe(true);
  });

  it("rejects a pathname outside the cms prefix", () => {
    expect(isCmsUploadPathname("projects/my-photo.png")).toBe(false);
  });

  it("rejects traversal segments", () => {
    expect(isCmsUploadPathname("cms/../secret.png")).toBe(false);
  });

  it("rejects backslashes", () => {
    expect(isCmsUploadPathname("cms\\projects\\secret.png")).toBe(false);
  });

  it("rejects an empty pathname", () => {
    expect(isCmsUploadPathname("")).toBe(false);
  });
});
