"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useAdminSearch } from "@/components/admin/search-context";
import { MaterialIcon } from "@/components/material-icon";
import { Button } from "@/components/ui/button";
import type { AdminProject } from "@/lib/content";
import { cn } from "@/lib/utils";

type ProjectManagerProps = {
  projects: AdminProject[];
  onAdd: () => void;
  onEdit: (project: AdminProject) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ProjectManager({
  projects,
  onAdd,
  onEdit,
  onToggleStatus,
  onDelete,
}: ProjectManagerProps) {
  const { query, setQuery } = useAdminSearch();
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      counts.set(project.category, (counts.get(project.category) ?? 0) + 1);
    }
    return Array.from(counts.entries());
  }, [projects]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        category === "all" || project.category === category;
      const haystack = [
        project.title,
        project.summary,
        project.category,
        project.status,
        ...project.tags,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [category, projects, query]);

  const resetFilters = () => {
    setCategory("all");
    setQuery("");
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-surface-container-lowest p-7 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="layers" size={20} className="text-primary" />
            <h2 className="font-title-card text-title-card text-on-surface">
              Manajemen Proyek Portofolio Terkini
            </h2>
          </div>
          <p className="mt-0.5 font-body-muted text-body-muted text-on-surface-variant">
            Daftar proyek aktif yang dipublikasikan di feed utama dan showcase
            teknis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MaterialIcon
              name="filter_list"
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter kategori proyek"
              className="cursor-pointer appearance-none rounded-xl bg-surface-container-low py-2 pr-8 pl-8 font-tech-tag text-tech-tag text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="all">Semua Kategori ({projects.length})</option>
              {categories.map(([name, count]) => (
                <option key={name} value={name}>
                  {name} ({count})
                </option>
              ))}
            </select>
            <MaterialIcon
              name="expand_more"
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
          </div>
          <Button
            type="button"
            onClick={onAdd}
            className="hidden h-9 rounded-xl bg-primary px-4 font-tech-tag text-tech-tag text-on-primary shadow-sm transition-all hover:bg-primary-container sm:inline-flex"
          >
            <MaterialIcon name="add" size={18} />
            <span>Proyek</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((project) => {
          const published = project.status === "Published";

          return (
            <div
              key={project.id}
              className="group flex flex-col justify-between gap-4 rounded-xl bg-surface-container-low/60 p-4 transition-all hover:bg-surface-container-high/70 md:flex-row md:items-center"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface-container shadow-sm">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt=""
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-surface-container-highest text-on-surface-variant">
                      <MaterialIcon
                        name={project.icon ?? "deployed_code"}
                        size={28}
                      />
                    </div>
                  )}
                  <span
                    className={cn(
                      "absolute bottom-1 right-1 rounded px-1 py-0.5 font-label-caps text-[9px] font-bold uppercase",
                      published
                        ? "bg-on-surface/80 text-surface"
                        : "bg-surface-variant text-on-surface-variant",
                    )}
                  >
                    {project.tag ?? "NEW"}
                  </span>
                </div>

                <div className="flex min-w-0 flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-title-card text-title-card font-semibold text-on-surface">
                      {project.title}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-label-caps text-label-caps uppercase tracking-wider",
                        published
                          ? "bg-secondary-fixed text-on-secondary-fixed"
                          : "bg-surface-container-highest text-on-surface-variant",
                      )}
                    >
                      {published ? "Published" : "Draft Mode"}
                    </span>
                  </div>
                  <p className="truncate font-body-muted text-body-muted text-on-surface-variant">
                    {project.summary}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {project.tags.map((tag) => (
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

              <div className="flex shrink-0 items-center justify-between gap-5 pt-2 md:justify-end md:pt-0">
                <div className="flex flex-col md:items-end">
                  <span
                    className={cn(
                      "font-stat-number text-stat-number",
                      published ? "text-on-surface" : "text-on-surface-variant",
                    )}
                  >
                    {project.views}
                  </span>
                  <span className="font-tech-tag text-tech-tag text-on-surface-variant">
                    {published ? "Views & Demos" : "Belum Publik"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Sunting Proyek"
                    onClick={() => onEdit(project)}
                    className="size-9 rounded-lg bg-surface-container text-on-surface transition-all hover:bg-primary hover:text-on-primary"
                  >
                    <MaterialIcon name="edit_note" size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title={
                      published
                        ? "Sembunyikan dari Publik"
                        : "Publikasikan Sekarang"
                    }
                    onClick={() => onToggleStatus(project.id)}
                    className={cn(
                      "size-9 rounded-lg bg-surface-container transition-all",
                      published
                        ? "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
                        : "text-on-surface hover:bg-secondary-container hover:text-on-secondary-container",
                    )}
                  >
                    <MaterialIcon
                      name={published ? "visibility" : "publish"}
                      size={18}
                    />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Hapus Proyek"
                    onClick={() => onDelete(project.id)}
                    className="size-9 rounded-lg bg-surface-container text-on-surface-variant transition-all hover:bg-error hover:text-on-error"
                  >
                    <MaterialIcon name="delete_outline" size={18} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-outline-variant bg-surface-container-low/50 px-6 py-10 text-center">
            <MaterialIcon name="search_off" size={32} className="text-outline" />
            <p className="font-body-muted text-body-muted text-on-surface-variant">
              Tidak ada proyek yang cocok dengan filter ini.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="rounded-lg"
            >
              Reset filter
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="font-tech-tag text-tech-tag text-on-surface-variant">
          Menampilkan {filtered.length} dari {projects.length} proyek portofolio
        </span>
        <button
          type="button"
          onClick={() => {
            resetFilters();
            toast.success("Menampilkan seluruh proyek portofolio.");
          }}
          className="inline-flex items-center gap-1.5 font-tech-tag text-tech-tag font-semibold text-primary transition-colors hover:text-on-surface"
        >
          <span>Buka Seluruh Proyek</span>
          <MaterialIcon name="arrow_forward" size={16} />
        </button>
      </div>
    </div>
  );
}
