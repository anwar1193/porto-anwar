export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const CMS_UPLOAD_PREFIX = "cms/";

const SAFE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

type UploadCandidate = {
  type: string;
  size: number;
};

export function validateImageFile(file: UploadCandidate): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    return "Format gambar harus JPG, PNG, WebP, atau GIF.";
  }

  if (file.size > IMAGE_MAX_BYTES) {
    return "Ukuran gambar maksimal 5 MB.";
  }

  return null;
}

function sanitizeSegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildImagePathname(prefix: string, fileName: string): string {
  const safePrefix =
    prefix.toLowerCase().replace(/[^a-z0-9-]/g, "") || "misc";

  const baseName = fileName.split(/[\\/]/).pop() ?? "";
  const dotIndex = baseName.lastIndexOf(".");
  const rawName = dotIndex > 0 ? baseName.slice(0, dotIndex) : baseName;
  const rawExtension =
    dotIndex > 0 ? baseName.slice(dotIndex + 1).toLowerCase() : "";

  const name = sanitizeSegment(rawName) || "image";
  const extension = SAFE_EXTENSIONS.has(rawExtension)
    ? `.${rawExtension}`
    : "";

  return `${CMS_UPLOAD_PREFIX}${safePrefix}/${name}${extension}`;
}

export function buildUploadTokenOptions(): {
  allowedContentTypes: string[];
  maximumSizeInBytes: number;
  addRandomSuffix: boolean;
} {
  return {
    allowedContentTypes: [...ALLOWED_IMAGE_TYPES],
    maximumSizeInBytes: IMAGE_MAX_BYTES,
    addRandomSuffix: true,
  };
}

export function isCmsUploadPathname(pathname: string): boolean {
  return (
    typeof pathname === "string" &&
    pathname.startsWith(CMS_UPLOAD_PREFIX) &&
    !pathname.includes("..") &&
    !pathname.includes("\\")
  );
}

type BlobEnv = {
  BLOB_READ_WRITE_TOKEN?: string;
  [key: string]: string | undefined;
};

function isSet(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * `handleUpload` in the installed SDK always signs tokens with a read-write
 * token; OIDC (`BLOB_STORE_ID` + `VERCEL_OIDC_TOKEN`) is not supported for
 * the token route, so it must not pass this preflight.
 */
export function hasBlobCredentials(
  env: BlobEnv = process.env as BlobEnv,
): boolean {
  return isSet(env.BLOB_READ_WRITE_TOKEN);
}

export function describeImageUploadError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes("retrieve the client token")) {
      return "Upload gambar belum dikonfigurasi di server: set BLOB_READ_WRITE_TOKEN, lalu restart server.";
    }

    return error.message;
  }

  return "Gagal mengunggah gambar. Coba lagi.";
}
