"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { FormField } from "@/components/admin/form-field";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { MaterialIcon } from "@/components/material-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toMonthInput } from "@/lib/cms/format";
import type { ActionResult } from "@/lib/cms/action-result";
import type { Achievement } from "@/lib/cms/types";
import {
  createAchievementAction,
  updateAchievementAction,
} from "@/app/admin/achievements/actions";

type AchievementDialogProps = {
  open: boolean;
  achievement: Achievement | null;
  onOpenChange: (open: boolean) => void;
};

export function AchievementDialog({
  open,
  achievement,
  onOpenChange,
}: AchievementDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const busy = pending || uploadingImage;

  const resetFeedback = () => {
    setFormError(null);
    setFieldErrors({});
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();

    if (uploadingImage) {
      toast.info("Tunggu sampai gambar selesai diunggah.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const input = {
      kind: String(formData.get("kind") ?? "certificate"),
      title: String(formData.get("title") ?? ""),
      issuer: String(formData.get("issuer") ?? ""),
      issuedAt: String(formData.get("issuedAt") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      credentialUrl: String(formData.get("credentialUrl") ?? ""),
      description: String(formData.get("description") ?? ""),
      status: String(formData.get("status") ?? "draft"),
    };

    startTransition(async () => {
      const result: ActionResult = achievement
        ? await updateAchievementAction(achievement.id, input)
        : await createAchievementAction(input);

      if (!result.ok) {
        setFormError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
        return;
      }

      toast.success(
        achievement
          ? `Pencapaian "${input.title}" diperbarui.`
          : `Pencapaian "${input.title}" ditambahkan.`,
      );
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!busy) {
          resetFeedback();
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {achievement ? "Sunting Pencapaian" : "Tambah Pencapaian"}
          </DialogTitle>
          <DialogDescription>
            Kelola sertifikat dan penghargaan yang tampil pada bagian
            achievements di landing page.
          </DialogDescription>
        </DialogHeader>

        <form
          key={achievement?.id ?? "new-achievement"}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {formError ? (
            <div className="flex items-start gap-2 rounded-lg bg-error-container/60 p-3 font-body-muted text-body-muted text-error">
              <MaterialIcon name="error" size={18} />
              <span>{formError}</span>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Jenis"
              htmlFor="achievement-kind"
              error={fieldErrors.kind}
            >
              <select
                id="achievement-kind"
                name="kind"
                defaultValue={achievement?.kind ?? "certificate"}
                className="h-8 w-full cursor-pointer rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="certificate">Certificate</option>
                <option value="award">Award</option>
              </select>
            </FormField>

            <FormField
              label="Status"
              htmlFor="achievement-status"
              error={fieldErrors.status}
            >
              <select
                id="achievement-status"
                name="status"
                defaultValue={achievement?.status ?? "draft"}
                className="h-8 w-full cursor-pointer rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </FormField>
          </div>

          <FormField
            label="Judul"
            htmlFor="achievement-title"
            error={fieldErrors.title}
          >
            <Input
              id="achievement-title"
              name="title"
              required
              maxLength={200}
              defaultValue={achievement?.title ?? ""}
              placeholder="Dicoding - Backend Facilitator Certificate"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Penerbit"
              htmlFor="achievement-issuer"
              error={fieldErrors.issuer}
            >
              <Input
                id="achievement-issuer"
                name="issuer"
                required
                maxLength={160}
                defaultValue={achievement?.issuer ?? ""}
                placeholder="Dicoding Indonesia"
              />
            </FormField>

            <FormField
              label="Tanggal terbit"
              htmlFor="achievement-issued"
              error={fieldErrors.issuedAt}
              hint="Opsional."
            >
              <Input
                id="achievement-issued"
                name="issuedAt"
                type="month"
                defaultValue={toMonthInput(achievement?.issuedAt)}
              />
            </FormField>
          </div>

          <ImageUploadField
            id="achievement-image"
            name="imageUrl"
            label="Gambar sertifikat / penghargaan"
            prefix="achievements"
            hint="JPG, PNG, WebP, atau GIF. Maksimal 5 MB."
            defaultValue={achievement?.imageUrl ?? ""}
            error={fieldErrors.imageUrl}
            disabled={pending}
            onUploadingChange={setUploadingImage}
          />

          <FormField
            label="URL verifikasi kredensial"
            htmlFor="achievement-credential"
            error={fieldErrors.credentialUrl}
            hint="Opsional. Tautan ke halaman verifikasi penerbit."
          >
            <Input
              id="achievement-credential"
              name="credentialUrl"
              defaultValue={achievement?.credentialUrl ?? ""}
              placeholder="https://..."
            />
          </FormField>

          <FormField
            label="Deskripsi"
            htmlFor="achievement-description"
            error={fieldErrors.description}
            hint="Opsional."
          >
            <textarea
              id="achievement-description"
              name="description"
              maxLength={3000}
              rows={3}
              defaultValue={achievement?.description ?? ""}
              className="min-h-20 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </FormField>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={busy}>
              <MaterialIcon name="save" size={16} />
              {pending
                ? "Menyimpan..."
                : uploadingImage
                  ? "Mengunggah gambar..."
                  : achievement
                    ? "Simpan perubahan"
                    : "Tambah pencapaian"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
