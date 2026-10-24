"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { ModuleHeader } from "@/components/admin/module-header";
import { ProjectDialog } from "@/components/admin/projects/project-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminSearch } from "@/components/admin/search-context";
import { MaterialIcon } from "@/components/material-icon";
import { Button } from "@/components/ui/button";
import {
  deleteProjectAction,
  moveProjectAction,
  setProjectStatusAction,
} from "@/app/admin/projects/actions";
import type { Project } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

type ProjectManagerProps = {
  projects: Project[];
};

export function ProjectManager({ projects }: ProjectManagerProps) {
  const router = useRouter();
  const { query, setQuery } = useAdminSearch();
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(
    () => Array.from(new Set(projects.map((project) => project.category))),
    [projects],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        category === "all" || project.category === category;
      const matchesStatus = status === "all" || project.status === status;
      const haystack = [
        project.title,
        project.summary,
        project.description ?? "",
        project.category,
        project.badge ?? "",
        ...project.tags,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        matchesStatus &&
        (!normalized || haystack.includes(normalized))
      );
    });
  }, [category, projects, query, status]);

  const resetFilters = () => {
    setCategory("all");
    setStatus("all");
    setQuery("");
  };

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setDialogOpen(true);
  };

  const runAction = (
    project: Project,
    action: () => Promise<{ ok: boolean; error?: string }>,
    successMessage: string,
  ) => {
    setPendingId(project.id);

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

  const toggleStatus = (project: Project) => {
    const nextStatus = project.status === "published" ? "draft" : "published";

    runAction(
      project,
      () => setProjectStatusAction(project.id, nextStatus),
      nextStatus === "published"
        ? `"${project.title}" dipublikasikan.`
        : `"${project.title}" disembunyikan dari publik.`,
    );
  };

  const move = (project: Project, direction: "up" | "down") => {
    runAction(
      project,
      () => moveProjectAction(project.id, direction),
      direction === "up"
        ? "Proyek dipindahkan ke atas."
        : "Proyek dipindahkan ke bawah.",
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-8">
      <ModuleHeader
        icon="code_blocks"
        title="Projects"
        description="Kelola showcase proyek: tulis ringkasan, atur teknologi, publikasikan, dan urutkan tampilannya di landing page."
        count={projects.length}
        addLabel="Tambah proyek"
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
            placeholder="Cari proyek..."
            aria-label="Cari proyek"
            className="h-9 w-full rounded-lg bg-surface-container-low py-2 pr-3 pl-9 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter kategori proyek"
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
            aria-label="Filter status proyek"
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

      <div className="flex flex-col gap-3">
        {filtered.map((project) => {
          const index = projects.findIndex((item) => item.id === project.id);
          const pending = isPending && pendingId === project.id;

          return (
            <article
              key={project.id}
              className={cn(
                "group flex flex-col justify-between gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm transition-all hover:shadow-md md:flex-row md:items-center",
                pending && "opacity-70",
              )}
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface-container shadow-sm">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt=""
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-surface-container-highest text-on-surface-variant">
                      <MaterialIcon name="deployed_code" size={28} />
                    </div>
                  )}
                  {project.badge ? (
                    <span className="absolute bottom-1 right-1 rounded bg-on-surface/80 px-1 py-0.5 font-label-caps text-[9px] font-bold uppercase text-surface">
                      {project.badge}
                    </span>
                  ) : null}
                </div>

                <div className="flex min-w-0 flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-title-card text-title-card font-semibold text-on-surface">
                      {project.title}
                    </h2>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="line-clamp-1 font-body-muted text-body-muted text-on-surface-variant">
                    {project.summary}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-surface-container px-2 py-0.5 font-tech-tag text-tech-tag text-tertiary">
                      {project.category}
                    </span>
                    {project.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-surface-container px-2 py-0.5 font-tech-tag text-tech-tag text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-1.5 md:justify-end">
                <div className="flex items-center rounded-lg bg-surface-container">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Naikkan urutan"
                    aria-label={`Naikkan urutan ${project.title}`}
                    disabled={index <= 0 || pending}
                    onClick={() => move(project, "up")}
                    className="size-8 rounded-lg text-on-surface-variant"
                  >
                    <MaterialIcon name="keyboard_arrow_up" size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Turunkan urutan"
                    aria-label={`Turunkan urutan ${project.title}`}
                    disabled={index >= projects.length - 1 || pending}
                    onClick={() => move(project, "down")}
                    className="size-8 rounded-lg text-on-surface-variant"
                  >
                    <MaterialIcon name="keyboard_arrow_down" size={18} />
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title="Sunting proyek"
                  aria-label={`Sunting ${project.title}`}
                  disabled={pending}
                  onClick={() => openEdit(project)}
                  className="size-9 rounded-lg bg-surface-container text-on-surface transition-all hover:bg-primary hover:text-on-primary"
                >
                  <MaterialIcon name="edit_note" size={18} />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title={
                    project.status === "published"
                      ? "Sembunyikan dari publik"
                      : "Publikasikan sekarang"
                  }
                  aria-label={
                    project.status === "published"
                      ? `Sembunyikan ${project.title}`
                      : `Publikasikan ${project.title}`
                  }
                  disabled={pending}
                  onClick={() => toggleStatus(project)}
                  className={cn(
                    "size-9 rounded-lg bg-surface-container transition-all",
                    project.status === "published"
                      ? "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
                      : "text-on-surface hover:bg-secondary-container hover:text-on-secondary-container",
                  )}
                >
                  <MaterialIcon
                    name={
                      project.status === "published" ? "visibility_off" : "publish"
                    }
                    size={18}
                  />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title="Hapus proyek"
                  aria-label={`Hapus ${project.title}`}
                  disabled={pending}
                  onClick={() => setDeleteTarget(project)}
                  className="size-9 rounded-lg bg-surface-container text-on-surface-variant transition-all hover:bg-error hover:text-on-error"
                >
                  <MaterialIcon name="delete_outline" size={18} />
                </Button>
              </div>
            </article>
          );
        })}

        {filtered.length === 0 ? (
          <EmptyState
            icon="search_off"
            title={projects.length === 0 ? "Belum ada proyek" : "Tidak ada hasil"}
            description={
              projects.length === 0
                ? "Tambahkan proyek pertama untuk mulai membangun showcase portofolio."
                : "Tidak ada proyek yang cocok dengan pencarian atau filter ini."
            }
            action={
              projects.length === 0 ? (
                <Button type="button" onClick={openCreate}>
                  <MaterialIcon name="add" size={16} />
                  Tambah proyek
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
          Menampilkan {filtered.length} dari {projects.length} proyek
        </span>
        <span>
          {projects.filter((project) => project.status === "published").length}{" "}
          published
        </span>
      </div>

      <ProjectDialog
        open={dialogOpen}
        project={editing}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Hapus proyek ini?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" akan dihapus permanen dari database dan landing page. Tindakan ini tidak bisa dibatalkan.`
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
            const result = await deleteProjectAction(target.id);

            if (!result.ok) {
              toast.error(result.error);
              return;
            }

            toast.success(`"${target.title}" dihapus.`);
            setDeleteTarget(null);
            router.refresh();
          });
        }}
      />
    </div>
  );
}
