import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/guards";
import {
  buildUploadTokenOptions,
  hasBlobCredentials,
  isCmsUploadPathname,
} from "@/lib/cms/image-upload";

function isHandleUploadBody(value: unknown): value is HandleUploadBody {
  if (!value || typeof value !== "object" || !("type" in value)) {
    return false;
  }

  const candidate = value as { type?: unknown; payload?: unknown };

  if (!candidate.payload || typeof candidate.payload !== "object") {
    return false;
  }

  if (candidate.type === "blob.generate-client-token") {
    const payload = candidate.payload as {
      pathname?: unknown;
      multipart?: unknown;
    };

    return (
      typeof payload.pathname === "string" &&
      typeof payload.multipart === "boolean"
    );
  }

  if (candidate.type === "blob.upload-completed") {
    return true;
  }

  return false;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body permintaan tidak valid." },
      { status: 400 },
    );
  }

  if (!isHandleUploadBody(body)) {
    return NextResponse.json(
      { error: "Jenis permintaan upload tidak valid." },
      { status: 400 },
    );
  }

  if (body.type === "blob.generate-client-token") {
    // Hanya pembuatan token yang butuh sesi admin. Callback
    // `blob.upload-completed` dikirim oleh layanan Blob tanpa cookie sesi.
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isCmsUploadPathname(body.payload.pathname)) {
      return NextResponse.json(
        { error: "Path upload gambar tidak valid." },
        { status: 400 },
      );
    }
  }

  if (!hasBlobCredentials()) {
    console.error(
      "Blob upload is not configured: set BLOB_READ_WRITE_TOKEN, or BLOB_STORE_ID with VERCEL_OIDC_TOKEN.",
    );

    return NextResponse.json(
      {
        error:
          "Upload gambar belum dikonfigurasi di server: set BLOB_READ_WRITE_TOKEN, lalu restart server.",
      },
      { status: 503 },
    );
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!isCmsUploadPathname(pathname)) {
          throw new Error("Path upload gambar tidak valid.");
        }

        return buildUploadTokenOptions();
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Blob upload token generation failed", error);

    return NextResponse.json(
      { error: "Gagal menyiapkan upload gambar." },
      { status: 500 },
    );
  }
}
