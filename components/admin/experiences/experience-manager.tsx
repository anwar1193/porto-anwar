"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { ExperienceDialog } from "@/components/admin/experiences/experience-dialog";
import { ModuleHeader } from "@/components/admin/module-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminSearch } from "@/components/admin/search-context";
import { MaterialIcon } from "@/components/material-icon";
import { Button } from "@/components/ui/button";
import {
  deleteExperienceAction,
  moveExperienceAction,
  setExperienceStatusAction,
} from "@/app/admin/experiences/actions";
import { formatPeriod } from "@/lib/cms/format";
import type { Experience } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

type ExperienceManagerProps = {
  experiences: Experience[];
};

export function ExperienceManager({ experiences }: ExperienceManagerProps) {
  const router = useRouter();
  const { query, setQuery } = useAdminSearch();
  const [status, setStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return experiences.filter((experience) => {
      const matchesStatus = status === "all" || experience.status === status;
      const haystack = [
        experience.role,
        experience.organization,
        experience.location ?? "",
        experience.description,
        experience.startDate,
        experience.endDate ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [experiences, query, status]);

  const resetFilters = () => {
    setStatus("all");
    setQuery("");
  };

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (experience: Experience) => {
    setEditing(experience);
    setDialogOpen(true);
  };

  const runAction = (
    experience: Experience,
    action: () => Promise<{ ok: boolean; error?: string }>,
    successMessage: string,
  ) => {
    setPendingId(experience.id);

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

  const toggleStatus = (experience: Experience) => {
    const nextStatus = experience.status === "published" ? "draft" : "published";

    runAction(
      experience,
      () => setExperienceStatusAction(experience.id, nextStatus),
      nextStatus === "published"
        ? `Pengalaman "${experience.role}" dipublikasikan.`
        : `Pengalaman "${experience.role}" disembunyikan dari publik.`,
    );
  };

  const move = (experience: Experience, direction: "up" | "down") => {
    runAction(
      experience,
      () => moveExperienceAction(experience.id, direction),
      direction === "up"
        ? "Pengalaman dipindahkan ke atas."
        : "Pengalaman dipindahkan ke bawah.",
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-8">
      <ModuleHeader
        icon="timeline"
        title="Experiences & Career"
        description="Kelola riwayat karier, mentoring, dan pengalaman profesional yang tampil pada bagian experiences di landing page."
        count={experiences.length}
        addLabel="Tambah pengalaman"
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
            placeholder="Cari peran, organisasi..."
            aria-label="Cari pengalaman"
            className="h-9 w-full rounded-lg bg-surface-container-low py-2 pr-3 pl-9 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter status pengalaman"
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((experience) => {
          const index = experiences.findIndex(
            (item) => item.id === experience.id,
          );
          const pending = isPending && pendingId === experience.id;

          return (
            <article
              key={experience.id}
              className={cn(
                "group flex flex-col justify-between gap-4 rounded-xl bg-surface-container-lowest p-5 shadow-sm transition-all hover:shadow-md",
                pending && "opacity-70",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl",
                      experience.isCurrent
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container text-primary",
                    )}
                  >
                    <MaterialIcon name={experience.icon} size={22} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-title-card text-title-card font-bold text-on-surface">
                        {experience.role}
                      </h2>
                      {experience.isCurrent ? (
                        <span className="size-2 animate-pulse rounded-full bg-secondary-container" />
                      ) : null}
                      <StatusBadge status={experience.status} />
                    </div>
                    <p className="font-tech-tag text-tech-tag font-semibold text-primary">
                      {experience.organization}
                      {experience.location ? ` • ${experience.location}` : ""}
                    </p>
                    <p className="mt-1 font-tech-tag text-tech-tag text-on-surface-variant">
                      {formatPeriod(
                        experience.startDate,
                        experience.endDate,
                        experience.isCurrent,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Naikkan urutan"
                    aria-label={`Naikkan urutan ${experience.role}`}
                    disabled={index <= 0 || pending}
                    onClick={() => move(experience, "up")}
                    className="size-8 rounded-lg text-on-surface-variant"
                  >
                    <MaterialIcon name="keyboard_arrow_up" size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Turunkan urutan"
                    aria-label={`Turunkan urutan ${experience.role}`}
                    disabled={index >= experiences.length - 1 || pending}
                    onClick={() => move(experience, "down")}
                    className="size-8 rounded-lg text-on-surface-variant"
                  >
                    <MaterialIcon name="keyboard_arrow_down" size={18} />
                  </Button>
                </div>
              </div>

              <p className="line-clamp-3 font-body-muted text-body-muted leading-relaxed text-on-surface-variant">
                {experience.description}
              </p>

              <div className="flex flex-wrap items-center justify-end gap-1.5 border-t border-outline-variant/40 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => openEdit(experience)}
                  disabled={pending}
                  className="rounded-lg bg-surface-container font-tech-tag text-tech-tag"
                >
                  <MaterialIcon name="edit_note" size={16} />
                  Sunting
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStatus(experience)}
                  disabled={pending}
                  className="rounded-lg bg-surface-container font-tech-tag text-tech-tag"
                >
                  <MaterialIcon
                    name={
                      experience.status === "published"
                        ? "visibility_off"
                        : "publish"
                    }
                    size={16}
                  />
                  {experience.status === "published" ? "Unpublish" : "Publish"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(experience)}
                  disabled={pending}
                  className="rounded-lg bg-surface-container font-tech-tag text-tech-tag text-on-surface-variant hover:bg-error hover:text-on-error"
                >
                  <MaterialIcon name="delete_outline" size={16} />
                  Hapus
                </Button>
              </div>
            </article>
          );
        })}

        {filtered.length === 0 ? (
          <div className="lg:col-span-2">
            <EmptyState
              icon="timeline"
              title={
                experiences.length === 0
                  ? "Belum ada pengalaman"
                  : "Tidak ada hasil"
              }
              description={
                experiences.length === 0
                  ? "Tambahkan peran pertama untuk mulai membangun timeline karier."
                  : "Tidak ada pengalaman yang cocok dengan pencarian atau filter ini."
              }
              action={
                experiences.length === 0 ? (
                  <Button type="button" onClick={openCreate}>
                    <MaterialIcon name="add" size={16} />
                    Tambah pengalaman
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={resetFilters}>
                    Reset filter
                  </Button>
                )
              }
            />
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between font-tech-tag text-tech-tag text-on-surface-variant">
        <span>
          Menampilkan {filtered.length} dari {experiences.length} pengalaman
        </span>
        <span>
          {
            experiences.filter(
              (experience) => experience.status === "published",
            ).length
          }{" "}
          published
        </span>
      </div>

      <ExperienceDialog
        open={dialogOpen}
        experience={editing}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Hapus pengalaman ini?"
        description={
          deleteTarget
            ? `"${deleteTarget.role}" di ${deleteTarget.organization} akan dihapus permanen dari database dan landing page. Tindakan ini tidak bisa dibatalkan.`
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
            const result = await deleteExperienceAction(target.id);

            if (!result.ok) {
              toast.error(result.error);
              return;
            }

            toast.success(`Pengalaman "${target.role}" dihapus.`);
            setDeleteTarget(null);
            router.refresh();
          });
        }}
      />
    </div>
  );
}
