// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  upload: vi.fn(),
}));

vi.mock("@vercel/blob/client", () => ({
  upload: mocks.upload,
}));

import { ImageUploadField } from "./image-upload-field";

type FieldProps = {
  defaultValue?: string;
  onUploadingChange?: (uploading: boolean) => void;
};

function renderField(props: FieldProps = {}) {
  return render(
    <ImageUploadField
      id="project-image"
      name="imageUrl"
      label="Gambar proyek"
      prefix="projects"
      {...props}
    />,
  );
}

function fileInput() {
  return screen.getByLabelText("Gambar proyek") as HTMLInputElement;
}

function hiddenInput() {
  return document.querySelector(
    'input[name="imageUrl"]',
  ) as HTMLInputElement;
}

function imageFile(name = "my-photo.png", type = "image/png") {
  return new File([new Uint8Array([1, 2, 3])], name, { type });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.upload.mockResolvedValue({
    url: "https://store.public.blob.vercel-storage.com/cms/projects/my-photo.png",
  });
});

afterEach(() => {
  cleanup();
});

describe("ImageUploadField", () => {
  it("rejects an unsupported file type without uploading", async () => {
    renderField();

    fireEvent.change(fileInput(), {
      target: { files: [imageFile("evil.svg", "image/svg+xml")] },
    });

    expect(await screen.findByText(/format gambar/i)).toBeTruthy();
    expect(mocks.upload).not.toHaveBeenCalled();
  });

  it("uploads a valid image and writes the blob URL to the hidden input", async () => {
    const onUploadingChange = vi.fn();
    renderField({ onUploadingChange });

    fireEvent.change(fileInput(), {
      target: { files: [imageFile()] },
    });

    await waitFor(() => {
      expect(hiddenInput().value).toBe(
        "https://store.public.blob.vercel-storage.com/cms/projects/my-photo.png",
      );
    });

    expect(mocks.upload).toHaveBeenCalledWith(
      "cms/projects/my-photo.png",
      expect.any(File),
      expect.objectContaining({
        access: "public",
        handleUploadUrl: "/api/blob/upload",
      }),
    );
    expect(onUploadingChange).toHaveBeenCalledWith(true);
    expect(onUploadingChange).toHaveBeenLastCalledWith(false);
  });

  it("shows an existing image and clears it with the remove button", () => {
    renderField({ defaultValue: "https://example.com/old.png" });

    expect(hiddenInput().value).toBe("https://example.com/old.png");

    fireEvent.click(screen.getByRole("button", { name: /hapus/i }));

    expect(hiddenInput().value).toBe("");
  });

  it("allows pasting an image URL as a fallback", () => {
    renderField();

    fireEvent.click(screen.getByText("Gunakan URL"));
    fireEvent.change(screen.getByPlaceholderText("https://..."), {
      target: { value: "https://example.com/manual.png" },
    });

    expect(hiddenInput().value).toBe("https://example.com/manual.png");
  });

  it("shows the upload error returned by the client", async () => {
    mocks.upload.mockRejectedValue(new Error("Upload gagal di server."));
    renderField();

    fireEvent.change(fileInput(), {
      target: { files: [imageFile()] },
    });

    expect(await screen.findByText("Upload gagal di server.")).toBeTruthy();
    expect(hiddenInput().value).toBe("");
  });

  it("explains that the blob token is missing instead of showing the raw SDK error", async () => {
    mocks.upload.mockRejectedValue(
      new Error("Vercel Blob: Failed to retrieve the client token"),
    );
    renderField();

    fireEvent.change(fileInput(), {
      target: { files: [imageFile()] },
    });

    expect(await screen.findByText(/BLOB_READ_WRITE_TOKEN/)).toBeTruthy();
    expect(screen.queryByText(/Failed to retrieve the client token/)).toBeNull();
  });
});
