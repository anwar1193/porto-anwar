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
import type { Skill } from "@/lib/cms/types";
import {
  createSkillAction,
  updateSkillAction,
} from "@/app/admin/skills/actions";

const CATEGORY_SUGGESTIONS = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Tools",
  "Design",
];

const ICON_SUGGESTIONS = [
  "html",
  "css",
  "javascript",
  "php",
  "fork_right",
  "dataset",
  "deployed_code",
  "developer_board",
  "grid_view",
  "waves",
  "database",
  "storage",
  "draw",
];

type SkillDialogProps = {
  open: boolean;
  skill: Skill | null;
  onOpenChange: (open: boolean) => void;
};

export function SkillDialog({ open, skill, onOpenChange }: SkillDialogProps) {
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
      name: String(formData.get("name") ?? ""),
      category: String(formData.get("category") ?? ""),
      yearsLabel: String(formData.get("yearsLabel") ?? ""),
      proficiency: String(formData.get("proficiency") ?? "0"),
      icon: String(formData.get("icon") ?? ""),
      status: String(formData.get("status") ?? "draft"),
    };

    startTransition(async () => {
      const result: ActionResult = skill
        ? await updateSkillAction(skill.id, input)
        : await createSkillAction(input);

      if (!result.ok) {
        setFormError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error);
        return;
      }

      toast.success(
        skill ? `Skill "${input.name}" diperbarui.` : `Skill "${input.name}" ditambahkan.`,
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{skill ? "Sunting Skill" : "Tambah Skill"}</DialogTitle>
          <DialogDescription>
            Kelola teknologi yang tampil pada bagian skills di landing page.
          </DialogDescription>
        </DialogHeader>

        <form
          key={skill?.id ?? "new-skill"}
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
            <FormField label="Nama skill" htmlFor="skill-name" error={fieldErrors.name}>
              <Input
                id="skill-name"
                name="name"
                required
                maxLength={100}
                defaultValue={skill?.name ?? ""}
                placeholder="Laravel"
              />
            </FormField>

            <FormField
              label="Kategori"
              htmlFor="skill-category"
              error={fieldErrors.category}
            >
              <Input
                id="skill-category"
                name="category"
                required
                maxLength={80}
                list="skill-category-options"
                defaultValue={skill?.category ?? ""}
                placeholder="Backend"
              />
              <datalist id="skill-category-options">
                {CATEGORY_SUGGESTIONS.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Label pengalaman"
              htmlFor="skill-years"
              error={fieldErrors.yearsLabel}
              hint="Contoh: 3 Years atau 6 Months."
            >
              <Input
                id="skill-years"
                name="yearsLabel"
                required
                maxLength={40}
                defaultValue={skill?.yearsLabel ?? ""}
                placeholder="3 Years"
              />
            </FormField>

            <FormField
              label="Proficiency (0–100)"
              htmlFor="skill-proficiency"
              error={fieldErrors.proficiency}
            >
              <Input
                id="skill-proficiency"
                name="proficiency"
                type="number"
                min={0}
                max={100}
                step={1}
                defaultValue={skill?.proficiency ?? 80}
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Icon"
              htmlFor="skill-icon"
              error={fieldErrors.icon}
              hint="Nama Material Symbols, misalnya database."
            >
              <Input
                id="skill-icon"
                name="icon"
                required
                maxLength={60}
                list="skill-icon-options"
                defaultValue={skill?.icon ?? "deployed_code"}
              />
              <datalist id="skill-icon-options">
                {ICON_SUGGESTIONS.map((icon) => (
                  <option key={icon} value={icon} />
                ))}
              </datalist>
            </FormField>

            <FormField
              label="Status"
              htmlFor="skill-status"
              error={fieldErrors.status}
            >
              <select
                id="skill-status"
                name="status"
                defaultValue={skill?.status ?? "draft"}
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
                : skill
                  ? "Simpan perubahan"
                  : "Tambah skill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
