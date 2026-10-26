"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { upload } from "@vercel/blob/client";

import { FormField } from "@/components/admin/form-field";
import { MaterialIcon } from "@/components/material-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buildImagePathname,
  describeImageUploadError,
  validateImageFile,
} from "@/lib/cms/image-upload";

type ImageUploadFieldProps = {
  id: string;
  name: string;
  label: string;
  prefix: string;
  hint?: string;
  error?: string[];
  defaultValue?: string;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
};

export function ImageUploadField({
  id,
  name,
  label,
  prefix,
  hint = "JPG, PNG, WebP, atau GIF. Maksimal 5 MB.",
  error,
  defaultValue = "",
  disabled = false,
  onUploadingChange,
}: ImageUploadFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setUploadingState = (value: boolean) => {
    setUploading(value);
    onUploadingChange?.(value);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validationError = validateImageFile(file);

    if (validationError) {
      setLocalError(validationError);
      event.target.value = "";
      return;
    }

    setLocalError(null);
    setUploadingState(true);
    setProgress(0);

    try {
      const blob = await upload(buildImagePathname(prefix, file.name), file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        onUploadProgress: ({ percentage }) => {
          setProgress(Math.round(percentage));
        },
      });

      setUrl(blob.url);
    } catch (uploadError) {
      setLocalError(describeImageUploadError(uploadError));
    } finally {
      setUploadingState(false);
      setProgress(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const busy = disabled || uploading;
  const shownError = localError ? [localError] : error;

  return (
    <FormField label={label} htmlFor={id} error={shownError} hint={hint}>
      <input type="hidden" name={name} value={url} readOnly />

      <div className="flex flex-col gap-3 rounded-lg border border-dashed border-input bg-surface-container-lowest/40 p-3">
        {url ? (
          <div className="flex items-center gap-3">
            <img
              src={url}
              alt=""
              className="size-20 shrink-0 rounded-lg border border-outline-variant/40 object-cover"
            />
            <div className="flex min-w-0 flex-col gap-2">
              <span className="truncate font-tech-tag text-[11px] text-on-surface-variant">
                {url}
              </span>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={openFilePicker}
                >
                  <MaterialIcon name="swap_horiz" size={16} />
                  Ganti gambar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  onClick={() => {
                    setUrl("");
                    setLocalError(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  <MaterialIcon name="delete" size={16} />
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openFilePicker}
            disabled={busy}
            className="flex flex-col items-center gap-1 rounded-lg px-4 py-6 text-center transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-60"
          >
            <MaterialIcon name="upload" size={26} className="text-primary" />
            <span className="font-body-muted text-body-muted font-medium text-on-surface">
              Pilih gambar
            </span>
            <span className="font-tech-tag text-[11px] text-on-surface-variant">
              JPG, PNG, WebP, atau GIF · maks. 5 MB
            </span>
          </button>
        )}

        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={busy}
          onChange={handleFileChange}
        />

        {uploading ? (
          <div className="flex flex-col gap-1.5" aria-live="polite">
            <div className="flex items-center justify-between font-tech-tag text-[11px] text-on-surface-variant">
              <span>Mengunggah gambar...</span>
              <span>{progress ?? 0}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-highest">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-200"
                style={{ width: `${progress ?? 0}%` }}
              />
            </div>
          </div>
        ) : null}

        <details className="group">
          <summary className="cursor-pointer select-none font-tech-tag text-[11px] font-medium text-primary hover:underline">
            Gunakan URL
          </summary>
          <div className="mt-2">
            <Input
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                setLocalError(null);
              }}
              disabled={busy}
              placeholder="https://..."
              aria-label={`${label} (URL)`}
            />
            <p className="mt-1 font-tech-tag text-[11px] text-on-surface-variant">
              Tempel URL gambar yang sudah ada. Kosongkan untuk menghapus.
            </p>
          </div>
        </details>
      </div>
    </FormField>
  );
}
