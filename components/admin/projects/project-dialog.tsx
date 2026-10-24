"use client";

import { useState, useTransition, type FormEvent } from "react";
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
import type { ActionResult } from "@/lib/cms/action-result";
import type { Project } from "@/lib/cms/types";
import {
  createProjectAction,
  updateProjectAction,
} from "@/app/admin/projects/actions";

const CATEGORY_SUGGESTIONS = [
  "Fullstack Apps",
  "Backend Microservices",
  "Data Engineering",
  "Frontend",
  "Community Web",
  "Agency Site",
];

type ProjectDialogProps = {
  open: boolean;
  project: Project | null;
  onOpenChange: (open: boolean) => void;
};

export function ProjectDialog({
  open,
  project,
  onOpenChange,
}: ProjectDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const resetFeedback = () => {
    setFormError(null);
    setFieldErrors({});
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();

    const formData = new FormData(event.currentTarget);
    const input = {
      title: String(formData.get("title") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      description: String(formData.get("description") ?? ""),
      category: String(formData.get("category") ?? ""),
      tags: String(formData.get("tags") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      repoUrl: String(formData.get("repoUrl") ?? ""),
      liveUrl: String(formData.get("liveUrl") ?? ""),
      badge: String(formData.get("badge") ?? ""),
      status: String(formData.get("status") ?? "draft"),
    };

    startTransition(async () => {
      const result: ActionResult = project
        ? await updateProjectAction(project.id, input)
        : await createProjectAction(input);

      if (!result.ok) {
        setFormError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
        return;
      }

      toast.success(
        project
          ? `Proyek "${input.title}" diperbarui.`
          : `Proyek "${input.title}" ditambahkan.`,
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
            {project ? "Sunting Proyek" : "Tambah Proyek Baru"}
          </DialogTitle>
          <DialogDescription>
            {project
              ? "Perbarui metadata proyek yang tampil di landing page."
              : "Proyek baru bisa disimpan sebagai draft atau langsung dipublikasikan."}
          </DialogDescription>
        </DialogHeader>

        <form
          key={project?.id ?? "new-project"}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {formError ? (
            <div className="flex items-start gap-2 rounded-lg bg-error-container/60 p-3 font-body-muted text-body-muted text-error">
              <MaterialIcon name="error" size={18} />
              <span>{formError}</span>
            </div>
          ) : null}

          <FormField
            label="Judul proyek"
            htmlFor="project-title"
            error={fieldErrors.title}
          >
            <Input
              id="project-title"
              name="title"
              required
              maxLength={160}
              defaultValue={project?.title ?? ""}
              placeholder="ERP Cloud Enterprise Platform"
            />
          </FormField>

          <FormField
            label="Ringkasan"
            htmlFor="project-summary"
            error={fieldErrors.summary}
            hint="Tampil sebagai deskripsi singkat di kartu proyek."
          >
            <textarea
              id="project-summary"
              name="summary"
              required
              maxLength={400}
              rows={3}
              defaultValue={project?.summary ?? ""}
              placeholder="Ringkasan arsitektur dan dampak proyek."
              className="min-h-20 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </FormField>

          <FormField
            label="Deskripsi lengkap"
            htmlFor="project-description"
            error={fieldErrors.description}
            hint="Opsional. Bisa berisi detail teknis atau hasil yang terukur."
          >
            <textarea
              id="project-description"
              name="description"
              maxLength={5000}
              rows={4}
              defaultValue={project?.description ?? ""}
              className="min-h-24 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Kategori"
              htmlFor="project-category"
              error={fieldErrors.category}
            >
              <Input
                id="project-category"
                name="category"
                required
                maxLength={80}
                list="project-category-options"
                defaultValue={project?.category ?? ""}
                placeholder="Fullstack Apps"
              />
              <datalist id="project-category-options">
                {CATEGORY_SUGGESTIONS.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </FormField>

            <FormField
              label="Tech stack / tags"
              htmlFor="project-tags"
              error={fieldErrors.tags}
              hint="Pisahkan dengan koma."
            >
              <Input
                id="project-tags"
                name="tags"
                defaultValue={project?.tags.join(", ") ?? ""}
                placeholder="Laravel, React, PostgreSQL"
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Status"
              htmlFor="project-status"
              error={fieldErrors.status}
            >
              <select
                id="project-status"
                name="status"
                defaultValue={project?.status ?? "draft"}
                className="h-8 w-full cursor-pointer rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </FormField>

            <FormField
              label="Badge"
              htmlFor="project-badge"
              error={fieldErrors.badge}
              hint="Label pendek, misalnya NEW atau WIP."
            >
              <Input
                id="project-badge"
                name="badge"
                maxLength={24}
                defaultValue={project?.badge ?? ""}
                placeholder="NEW"
              />
            </FormField>
          </div>

          <FormField
            label="URL gambar"
            htmlFor="project-image"
            error={fieldErrors.imageUrl}
            hint="Gunakan https://... atau path internal /..."
          >
            <Input
              id="project-image"
              name="imageUrl"
              type="text"
              inputMode="url"
              defaultValue={project?.imageUrl ?? ""}
              placeholder="https://example.com/project.png"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="URL repository"
              htmlFor="project-repo"
              error={fieldErrors.repoUrl}
            >
              <Input
                id="project-repo"
                name="repoUrl"
                type="text"
                inputMode="url"
                defaultValue={project?.repoUrl ?? ""}
                placeholder="https://github.com/..."
              />
            </FormField>

            <FormField
              label="URL demo / live"
              htmlFor="project-live"
              error={fieldErrors.liveUrl}
            >
              <Input
                id="project-live"
                name="liveUrl"
                type="text"
                inputMode="url"
                defaultValue={project?.liveUrl ?? ""}
                placeholder="https://..."
              />
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
                : project
                  ? "Simpan perubahan"
                  : "Tambah proyek"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
