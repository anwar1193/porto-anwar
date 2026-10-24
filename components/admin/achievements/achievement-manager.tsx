"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AchievementDialog } from "@/components/admin/achievements/achievement-dialog";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { ModuleHeader } from "@/components/admin/module-header";
import { useAdminSearch } from "@/components/admin/search-context";
import { StatusBadge } from "@/components/admin/status-badge";
import { MaterialIcon } from "@/components/material-icon";
import { Button } from "@/components/ui/button";
import {
  deleteAchievementAction,
  moveAchievementAction,
  setAchievementStatusAction,
} from "@/app/admin/achievements/actions";
import { formatMonth } from "@/lib/cms/format";
import type { Achievement } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

type AchievementManagerProps = {
  achievements: Achievement[];
};

export function AchievementManager({
  achievements,
}: AchievementManagerProps) {
  const router = useRouter();
  const { query, setQuery } = useAdminSearch();
  const [kind, setKind] = useState("all");
  const [status, setStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return achievements.filter((achievement) => {
      const matchesKind = kind === "all" || achievement.kind === kind;
      const matchesStatus = status === "all" || achievement.status === status;
      const haystack = [
        achievement.title,
        achievement.issuer,
        achievement.description ?? "",
        achievement.issuedAt ?? "",
        achievement.kind,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesKind &&
        matchesStatus &&
        (!normalized || haystack.includes(normalized))
      );
    });
  }, [achievements, kind, query, status]);

  const resetFilters = () => {
    setKind("all");
    setStatus("all");
    setQuery("");
  };

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (achievement: Achievement) => {
    setEditing(achievement);
    setDialogOpen(true);
  };

  const runAction = (
    achievement: Achievement,
    action: () => Promise<{ ok: boolean; error?: string }>,
    successMessage: string,
  ) => {
    setPendingId(achievement.id);

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

  const toggleStatus = (achievement: Achievement) => {
    const nextStatus =
      achievement.status === "published" ? "draft" : "published";

    runAction(
      achievement,
      () => setAchievementStatusAction(achievement.id, nextStatus),
      nextStatus === "published"
        ? `Pencapaian "${achievement.title}" dipublikasikan.`
        : `Pencapaian "${achievement.title}" disembunyikan dari publik.`,
    );
  };

  const move = (achievement: Achievement, direction: "up" | "down") => {
    runAction(
      achievement,
      () => moveAchievementAction(achievement.id, direction),
      direction === "up"
        ? "Pencapaian dipindahkan ke atas."
        : "Pencapaian dipindahkan ke bawah.",
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-8">
      <ModuleHeader
        icon="military_tech"
        title="Achievements & Certs"
        description="Kelola sertifikat dan penghargaan, lengkap dengan gambar pratinjau dan tautan verifikasi kredensial."
        count={achievements.length}
        addLabel="Tambah pencapaian"
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
            placeholder="Cari sertifikat, penerbit..."
            aria-label="Cari pencapaian"
            className="h-9 w-full rounded-lg bg-surface-container-low py-2 pr-3 pl-9 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value)}
            aria-label="Filter jenis pencapaian"
            className="h-9 cursor-pointer rounded-lg bg-surface-container-low px-3 font-tech-tag text-tech-tag text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="all">Semua jenis</option>
            <option value="certificate">Certificate</option>
            <option value="award">Award</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter status pencapaian"
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((achievement) => {
          const index = achievements.findIndex(
            (item) => item.id === achievement.id,
          );
          const pending = isPending && pendingId === achievement.id;

          return (
            <article
              key={achievement.id}
              className={cn(
                "group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md",
                pending && "opacity-70",
              )}
            >
              <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-primary-fixed via-surface-container to-secondary-fixed">
                {achievement.imageUrl ? (
                  <img
                    src={achievement.imageUrl}
                    alt=""
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-primary">
                    <MaterialIcon
                      name={
                        achievement.kind === "award"
                          ? "emoji_events"
                          : "workspace_premium"
                      }
                      size={44}
                    />
                  </div>
                )}

                <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-surface-container-lowest/90 px-2 py-0.5 font-label-caps text-[9px] font-bold uppercase tracking-wider text-primary backdrop-blur-sm">
                    {achievement.kind}
                  </span>
                  <StatusBadge status={achievement.status} />
                </div>
              </div>

              <div className="flex flex-grow flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">
                      {achievement.issuer}
                    </p>
                    <h2 className="mt-1 font-title-card text-base font-bold text-on-surface">
                      {achievement.title}
                    </h2>
                  </div>
                  <MaterialIcon
                    name={achievement.kind === "award" ? "emoji_events" : "verified"}
                    size={18}
                    className="shrink-0 text-secondary"
                  />
                </div>

                {achievement.issuedAt ? (
                  <p className="font-tech-tag text-tech-tag text-on-surface-variant">
                    Diterbitkan {formatMonth(achievement.issuedAt)}
                  </p>
                ) : null}

                {achievement.credentialUrl ? (
                  <a
                    href={achievement.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center gap-1 font-tech-tag text-tech-tag text-primary hover:underline"
                  >
                    <MaterialIcon name="open_in_new" size={14} />
                    Verifikasi kredensial
                  </a>
                ) : null}

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-outline-variant/40 pt-3">
                  <div className="flex items-center gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title="Naikkan urutan"
                      aria-label={`Naikkan urutan ${achievement.title}`}
                      disabled={index <= 0 || pending}
                      onClick={() => move(achievement, "up")}
                      className="size-7 rounded-lg text-on-surface-variant"
                    >
                      <MaterialIcon name="keyboard_arrow_up" size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title="Turunkan urutan"
                      aria-label={`Turunkan urutan ${achievement.title}`}
                      disabled={index >= achievements.length - 1 || pending}
                      onClick={() => move(achievement, "down")}
                      className="size-7 rounded-lg text-on-surface-variant"
                    >
                      <MaterialIcon name="keyboard_arrow_down" size={16} />
                    </Button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title="Sunting pencapaian"
                      aria-label={`Sunting ${achievement.title}`}
                      disabled={pending}
                      onClick={() => openEdit(achievement)}
                      className="size-8 rounded-lg bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary"
                    >
                      <MaterialIcon name="edit_note" size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title={
                        achievement.status === "published"
                          ? "Sembunyikan dari publik"
                          : "Publikasikan sekarang"
                      }
                      aria-label={
                        achievement.status === "published"
                          ? `Sembunyikan ${achievement.title}`
                          : `Publikasikan ${achievement.title}`
                      }
                      disabled={pending}
                      onClick={() => toggleStatus(achievement)}
                      className={cn(
                        "size-8 rounded-lg bg-surface-container",
                        achievement.status === "published"
                          ? "text-on-surface-variant"
                          : "text-on-surface hover:bg-secondary-container",
                      )}
                    >
                      <MaterialIcon
                        name={
                          achievement.status === "published"
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
                      title="Hapus pencapaian"
                      aria-label={`Hapus ${achievement.title}`}
                      disabled={pending}
                      onClick={() => setDeleteTarget(achievement)}
                      className="size-8 rounded-lg bg-surface-container text-on-surface-variant hover:bg-error hover:text-on-error"
                    >
                      <MaterialIcon name="delete_outline" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {filtered.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState
              icon="military_tech"
              title={
                achievements.length === 0
                  ? "Belum ada pencapaian"
                  : "Tidak ada hasil"
              }
              description={
                achievements.length === 0
                  ? "Tambahkan sertifikat atau penghargaan pertama untuk mulai membangun galeri kredensial."
                  : "Tidak ada pencapaian yang cocok dengan pencarian atau filter ini."
              }
              action={
                achievements.length === 0 ? (
                  <Button type="button" onClick={openCreate}>
                    <MaterialIcon name="add" size={16} />
                    Tambah pencapaian
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
          Menampilkan {filtered.length} dari {achievements.length} pencapaian
        </span>
        <span>
          {
            achievements.filter(
              (achievement) => achievement.status === "published",
            ).length
          }{" "}
          published
        </span>
      </div>

      <AchievementDialog
        open={dialogOpen}
        achievement={editing}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Hapus pencapaian ini?"
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
            const result = await deleteAchievementAction(target.id);

            if (!result.ok) {
              toast.error(result.error);
              return;
            }

            toast.success(`Pencapaian "${target.title}" dihapus.`);
            setDeleteTarget(null);
            router.refresh();
          });
        }}
      />
    </div>
  );
}
