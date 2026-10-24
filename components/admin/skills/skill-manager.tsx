"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { ModuleHeader } from "@/components/admin/module-header";
import { useAdminSearch } from "@/components/admin/search-context";
import { SkillDialog } from "@/components/admin/skills/skill-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { MaterialIcon } from "@/components/material-icon";
import { Button } from "@/components/ui/button";
import {
  deleteSkillAction,
  moveSkillAction,
  setSkillStatusAction,
} from "@/app/admin/skills/actions";
import type { Skill } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

type SkillManagerProps = {
  skills: Skill[];
};

export function SkillManager({ skills }: SkillManagerProps) {
  const router = useRouter();
  const { query, setQuery } = useAdminSearch();
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(
    () => Array.from(new Set(skills.map((skill) => skill.category))),
    [skills],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchesCategory = category === "all" || skill.category === category;
      const matchesStatus = status === "all" || skill.status === status;
      const haystack = [
        skill.name,
        skill.category,
        skill.yearsLabel,
        skill.icon,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        matchesStatus &&
        (!normalized || haystack.includes(normalized))
      );
    });
  }, [category, query, skills, status]);

  const grouped = useMemo(() => {
    const groups = new Map<string, Skill[]>();

    for (const skill of filtered) {
      const bucket = groups.get(skill.category) ?? [];
      bucket.push(skill);
      groups.set(skill.category, bucket);
    }

    return Array.from(groups.entries());
  }, [filtered]);

  const resetFilters = () => {
    setCategory("all");
    setStatus("all");
    setQuery("");
  };

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setDialogOpen(true);
  };

  const runAction = (
    skill: Skill,
    action: () => Promise<{ ok: boolean; error?: string }>,
    successMessage: string,
  ) => {
    setPendingId(skill.id);

    startTransition(async () => {
      const result = await action();
      setPendingId(null);

      if (!result.ok) {
        toast.error(result.error ?? "Aksi gagal dijalankan.");
        return;
      }

      toast.success(successMessage);
      router.refresh();
    });
  };

  const toggleStatus = (skill: Skill) => {
    const nextStatus = skill.status === "published" ? "draft" : "published";

    runAction(
      skill,
      () => setSkillStatusAction(skill.id, nextStatus),
      nextStatus === "published"
        ? `Skill "${skill.name}" dipublikasikan.`
        : `Skill "${skill.name}" disembunyikan dari publik.`,
    );
  };

  const move = (skill: Skill, direction: "up" | "down") => {
    runAction(
      skill,
      () => moveSkillAction(skill.id, direction),
      direction === "up"
        ? "Skill dipindahkan ke atas."
        : "Skill dipindahkan ke bawah.",
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-8">
      <ModuleHeader
        icon="integration_instructions"
        title="Skills & Tech Stack"
        description="Atur teknologi yang dikuasai, kelompokkan berdasarkan kategori, dan tentukan urutan tampilannya di landing page."
        count={skills.length}
        addLabel="Tambah skill"
        onAdd={openCreate}
      />

      <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="relative flex-1 sm:max-w-sm">
          <MaterialIcon
            name="search"
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari skill..."
            aria-label="Cari skill"
            className="h-9 w-full rounded-lg bg-surface-container-low py-2 pr-3 pl-9 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter kategori skill"
            className="h-9 cursor-pointer rounded-lg bg-surface-container-low px-3 font-tech-tag text-tech-tag text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="all">Semua kategori</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter status skill"
            className="h-9 cursor-pointer rounded-lg bg-surface-container-low px-3 font-tech-tag text-tech-tag text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="all">Semua status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <Button
            type="button"
            variant="ghost"
            onClick={resetFilters}
            className="h-9 rounded-lg font-tech-tag text-tech-tag text-on-surface-variant"
          >
            <MaterialIcon name="restart_alt" size={16} />
            Reset
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {grouped.map(([categoryName, items]) => (
          <section key={categoryName} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-title-card text-title-card font-semibold text-on-surface">
                {categoryName}
              </h2>
              <span className="rounded-full bg-surface-container px-2 py-0.5 font-tech-tag text-tech-tag text-on-surface-variant">
                {items.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {items.map((skill) => {
                const categorySkills = skills.filter(
                  (item) => item.category === skill.category,
                );
                const index = categorySkills.findIndex(
                  (item) => item.id === skill.id,
                );
                const pending = isPending && pendingId === skill.id;

                return (
                  <article
                    key={skill.id}
                    className={cn(
                      "group flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm transition-all hover:shadow-md",
                      pending && "opacity-70",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-primary transition-transform group-hover:scale-105">
                          <MaterialIcon name={skill.icon} size={26} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate font-title-card text-base font-bold text-on-surface">
                              {skill.name}
                            </h3>
                            <StatusBadge status={skill.status} />
                          </div>
                          <p className="font-tech-tag text-tech-tag text-primary">
                            {skill.yearsLabel}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Naikkan urutan"
                          aria-label={`Naikkan urutan ${skill.name}`}
                          disabled={index <= 0 || pending}
                          onClick={() => move(skill, "up")}
                          className="size-7 rounded-lg text-on-surface-variant"
                        >
                          <MaterialIcon name="keyboard_arrow_up" size={16} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Turunkan urutan"
                          aria-label={`Turunkan urutan ${skill.name}`}
                          disabled={index >= categorySkills.length - 1 || pending}
                          onClick={() => move(skill, "down")}
                          className="size-7 rounded-lg text-on-surface-variant"
                        >
                          <MaterialIcon name="keyboard_arrow_down" size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <span className="w-9 text-right font-tech-tag text-[11px] text-on-surface-variant">
                        {skill.proficiency}%
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 border-t border-outline-variant/40 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Sunting skill"
                        aria-label={`Sunting ${skill.name}`}
                        disabled={pending}
                        onClick={() => openEdit(skill)}
                        className="size-8 rounded-lg bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary"
                      >
                        <MaterialIcon name="edit_note" size={16} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title={
                          skill.status === "published"
                            ? "Sembunyikan dari publik"
                            : "Publikasikan sekarang"
                        }
                        aria-label={
                          skill.status === "published"
                            ? `Sembunyikan ${skill.name}`
                            : `Publikasikan ${skill.name}`
                        }
                        disabled={pending}
                        onClick={() => toggleStatus(skill)}
                        className={cn(
                          "size-8 rounded-lg bg-surface-container",
                          skill.status === "published"
                            ? "text-on-surface-variant"
                            : "text-on-surface hover:bg-secondary-container",
                        )}
                      >
                        <MaterialIcon
                          name={
                            skill.status === "published"
                              ? "visibility_off"
                              : "publish"
                          }
                          size={16}
                        />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Hapus skill"
                        aria-label={`Hapus ${skill.name}`}
                        disabled={pending}
                        onClick={() => setDeleteTarget(skill)}
                        className="size-8 rounded-lg bg-surface-container text-on-surface-variant hover:bg-error hover:text-on-error"
                      >
                        <MaterialIcon name="delete_outline" size={16} />
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        {filtered.length === 0 ? (
          <EmptyState
            icon="integration_instructions"
            title={skills.length === 0 ? "Belum ada skill" : "Tidak ada hasil"}
            description={
              skills.length === 0
                ? "Tambahkan skill pertama untuk mulai membangun tech stack portofolio."
                : "Tidak ada skill yang cocok dengan pencarian atau filter ini."
            }
            action={
              skills.length === 0 ? (
                <Button type="button" onClick={openCreate}>
                  <MaterialIcon name="add" size={16} />
                  Tambah skill
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={resetFilters}>
                  Reset filter
                </Button>
              )
            }
          />
        ) : null}
      </div>

      <div className="flex items-center justify-between font-tech-tag text-tech-tag text-on-surface-variant">
        <span>
          Menampilkan {filtered.length} dari {skills.length} skill
        </span>
        <span>
          {skills.filter((skill) => skill.status === "published").length}{" "}
          published
        </span>
      </div>

      <SkillDialog
        open={dialogOpen}
        skill={editing}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Hapus skill ini?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" akan dihapus permanen dari database dan landing page. Tindakan ini tidak bisa dibatalkan.`
            : ""
        }
        pending={isPending}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={() => {
          if (!deleteTarget) return;

          const target = deleteTarget;

          startTransition(async () => {
            const result = await deleteSkillAction(target.id);

            if (!result.ok) {
              toast.error(result.error);
              return;
            }

            toast.success(`Skill "${target.name}" dihapus.`);
            setDeleteTarget(null);
            router.refresh();
          });
        }}
      />
    </div>
  );
}
