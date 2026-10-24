"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/material-icon";
import { SectionHeading } from "@/components/landing/section-heading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatMonth } from "@/lib/cms/format";
import type { Achievement } from "@/lib/cms/types";

export function AchievementsSection({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const [selected, setSelected] = useState<Achievement | null>(null);

  return (
    <section
      id="achievements"
      className="flex scroll-mt-24 flex-col gap-space-xl"
    >
      <SectionHeading title="ACHIEVEMENTS" />

      {achievements.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-outline-variant p-space-lg text-center font-body-muted text-body-muted text-on-surface-variant">
          Belum ada pencapaian yang dipublikasikan.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative mb-space-md h-44 w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary-fixed via-surface-container to-secondary-fixed">
                {achievement.imageUrl ? (
                  <div
                    role="img"
                    aria-label={`${achievement.title} preview`}
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${achievement.imageUrl}")` }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-primary">
                    <MaterialIcon
                      name={
                        achievement.kind === "award"
                          ? "workspace_premium"
                          : "verified"
                      }
                      size={48}
                    />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded-lg bg-surface-container-lowest/95 px-space-md py-1.5 font-tech-tag text-tech-tag font-bold text-primary shadow-md">
                    Lihat Pratinjau
                  </span>
                </div>
                <span className="absolute right-space-sm top-space-sm rounded-full bg-surface-container-lowest/90 px-2.5 py-0.5 font-tech-tag text-tech-tag font-bold text-secondary shadow-sm backdrop-blur-md">
                  {achievement.kind === "award" ? "Award" : "Certificate"}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-space-xs">
                <div className="flex items-center justify-between text-secondary">
                  <span className="font-label-caps text-label-caps uppercase tracking-widest">
                    {achievement.issuer}
                  </span>
                  <MaterialIcon name="verified" size={18} />
                </div>
                <h4 className="font-title-card text-base font-bold text-on-surface transition-colors group-hover:text-primary">
                  {achievement.title}
                </h4>
                {achievement.issuedAt ? (
                  <span className="font-tech-tag text-tech-tag text-on-surface-variant">
                    {formatMonth(achievement.issuedAt)}
                  </span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setSelected(achievement)}
                aria-label={`Pratinjau ${achievement.title}`}
                className="absolute inset-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              />
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-w-2xl p-4 sm:max-w-2xl">
          <DialogTitle className="sr-only">
            {selected?.title ?? "Pratinjau pencapaian"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Pratinjau pencapaian yang diterbitkan oleh{" "}
            {selected?.issuer ?? "penyedia kredensial"}.
          </DialogDescription>

          {selected ? (
            <div className="flex flex-col gap-3">
              {selected.imageUrl ? (
                <div
                  role="img"
                  aria-label={selected.title}
                  className="aspect-[16/10] w-full rounded-lg bg-gradient-to-br from-primary-fixed via-surface-container to-secondary-fixed bg-cover bg-center"
                  style={{ backgroundImage: `url("${selected.imageUrl}")` }}
                />
              ) : (
                <div className="flex aspect-[16/10] w-full items-center justify-center rounded-lg bg-gradient-to-br from-primary-fixed via-surface-container to-secondary-fixed text-primary">
                  <MaterialIcon
                    name={
                      selected.kind === "award"
                        ? "workspace_premium"
                        : "verified"
                    }
                    size={64}
                  />
                </div>
              )}
              <div className="flex flex-col gap-1 px-2 pb-1">
                <p className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">
                  {selected.issuer}
                  {selected.issuedAt
                    ? ` • ${formatMonth(selected.issuedAt)}`
                    : ""}
                </p>
                <p className="font-title-card text-base font-bold text-on-surface">
                  {selected.title}
                </p>
                {selected.description ? (
                  <p className="font-body-muted text-body-muted text-on-surface-variant">
                    {selected.description}
                  </p>
                ) : null}
                {selected.credentialUrl ? (
                  <a
                    href={selected.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 font-tech-tag text-tech-tag font-bold text-on-primary transition-colors hover:bg-primary-container"
                  >
                    <MaterialIcon name="open_in_new" size={16} />
                    Verifikasi Kredensial
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
