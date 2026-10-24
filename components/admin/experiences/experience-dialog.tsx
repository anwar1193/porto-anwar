"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { FormField } from "@/components/admin/form-field";
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
import type { Experience } from "@/lib/cms/types";
import {
  createExperienceAction,
  updateExperienceAction,
} from "@/app/admin/experiences/actions";

const ICON_SUGGESTIONS = [
  "work",
  "terminal",
  "dns",
  "layers",
  "devices",
  "school",
  "cloud",
  "database",
];

type ExperienceDialogProps = {
  open: boolean;
  experience: Experience | null;
  onOpenChange: (open: boolean) => void;
};

export function ExperienceDialog({
  open,
  experience,
  onOpenChange,
}: ExperienceDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isCurrent, setIsCurrent] = useState(experience?.isCurrent ?? false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const resetFeedback = () => {
    setFormError(null);
    setFieldErrors({});
  };

  useEffect(() => {
    if (!open) return;

    setIsCurrent(experience?.isCurrent ?? false);
    setFormError(null);
    setFieldErrors({});
  }, [experience, open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();

    const formData = new FormData(event.currentTarget);
    const input = {
      role: String(formData.get("role") ?? ""),
      organization: String(formData.get("organization") ?? ""),
      location: String(formData.get("location") ?? ""),
      startDate: String(formData.get("startDate") ?? ""),
      endDate: isCurrent ? "" : String(formData.get("endDate") ?? ""),
      isCurrent,
      description: String(formData.get("description") ?? ""),
      icon: String(formData.get("icon") ?? "work"),
      status: String(formData.get("status") ?? "draft"),
    };

    startTransition(async () => {
      const result: ActionResult = experience
        ? await updateExperienceAction(experience.id, input)
        : await createExperienceAction(input);

      if (!result.ok) {
        setFormError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
        return;
      }

      toast.success(
        experience
          ? `Pengalaman "${input.role}" diperbarui.`
          : `Pengalaman "${input.role}" ditambahkan.`,
      );
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!pending) {
          resetFeedback();
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {experience ? "Sunting Pengalaman" : "Tambah Pengalaman"}
          </DialogTitle>
          <DialogDescription>
            Catat riwayat karier, peran mentoring, atau pengalaman profesional
            lain yang relevan.
          </DialogDescription>
        </DialogHeader>

        <form
          key={experience?.id ?? "new-experience"}
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
            <FormField label="Peran" htmlFor="experience-role" error={fieldErrors.role}>
              <Input
                id="experience-role"
                name="role"
                required
                maxLength={160}
                defaultValue={experience?.role ?? ""}
                placeholder="Backend Engineer"
              />
            </FormField>

            <FormField
              label="Organisasi"
              htmlFor="experience-organization"
              error={fieldErrors.organization}
            >
              <Input
                id="experience-organization"
                name="organization"
                required
                maxLength={160}
                defaultValue={experience?.organization ?? ""}
                placeholder="PT. Indonesia Hakiki Pertama"
              />
            </FormField>
          </div>

          <FormField
            label="Lokasi"
            htmlFor="experience-location"
            error={fieldErrors.location}
            hint="Opsional, misalnya Bandung atau Remote."
          >
            <Input
              id="experience-location"
              name="location"
              maxLength={160}
              defaultValue={experience?.location ?? ""}
              placeholder="Remote"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Tanggal mulai"
              htmlFor="experience-start"
              error={fieldErrors.startDate}
            >
              <Input
                id="experience-start"
                name="startDate"
                type="month"
                required
                defaultValue={toMonthInput(experience?.startDate)}
              />
            </FormField>

            <FormField
              label="Tanggal selesai"
              htmlFor="experience-end"
              error={fieldErrors.endDate}
              hint={isCurrent ? "Tidak perlu diisi untuk posisi yang masih aktif." : undefined}
            >
              <Input
                id="experience-end"
                name="endDate"
                type="month"
                disabled={isCurrent}
                defaultValue={toMonthInput(experience?.endDate)}
              />
            </FormField>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-surface-container-low p-3">
            <input
              type="checkbox"
              name="isCurrent"
              checked={isCurrent}
              onChange={(event) => setIsCurrent(event.target.checked)}
              className="size-4 accent-primary"
            />
            <span className="flex flex-col">
              <span className="font-body-muted text-body-muted font-semibold text-on-surface">
                Masih aktif di posisi ini
              </span>
              <span className="font-tech-tag text-[11px] text-on-surface-variant">
                Tanggal selesai akan otomatis dikosongkan.
              </span>
            </span>
          </label>

          <FormField
            label="Deskripsi peran"
            htmlFor="experience-description"
            error={fieldErrors.description}
          >
            <textarea
              id="experience-description"
              name="description"
              required
              maxLength={3000}
              rows={4}
              defaultValue={experience?.description ?? ""}
              placeholder="Tanggung jawab dan pencapaian utama."
              className="min-h-24 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Icon"
              htmlFor="experience-icon"
              error={fieldErrors.icon}
              hint="Nama Material Symbols, misalnya work atau terminal."
            >
              <Input
                id="experience-icon"
                name="icon"
                maxLength={60}
                list="experience-icon-options"
                defaultValue={experience?.icon ?? "work"}
              />
              <datalist id="experience-icon-options">
                {ICON_SUGGESTIONS.map((icon) => (
                  <option key={icon} value={icon} />
                ))}
              </datalist>
            </FormField>

            <FormField
              label="Status"
              htmlFor="experience-status"
              error={fieldErrors.status}
            >
              <select
                id="experience-status"
                name="status"
                defaultValue={experience?.status ?? "draft"}
                className="h-8 w-full cursor-pointer rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </FormField>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={pending}>
              <MaterialIcon name="save" size={16} />
              {pending
                ? "Menyimpan..."
                : experience
                  ? "Simpan perubahan"
                  : "Tambah pengalaman"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
