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
import { certificates, type Certificate } from "@/lib/content";

export function AchievementsSection() {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <section
      id="achievements"
      className="flex scroll-mt-24 flex-col gap-space-xl"
    >
      <SectionHeading title="ACHIEVEMENTS" />

      <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((certificate) => (
          <div
            key={certificate.title}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative mb-space-md h-44 w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary-fixed via-surface-container to-secondary-fixed">
              <div
                role="img"
                aria-label={`${certificate.title} preview`}
                className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url("${certificate.image}")` }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded-lg bg-surface-container-lowest/95 px-space-md py-1.5 font-tech-tag text-tech-tag font-bold text-primary shadow-md">
                  Verify Credential
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 p-space-xs">
              <div className="flex items-center justify-between text-secondary">
                <span className="font-label-caps text-label-caps uppercase tracking-widest">
                  {certificate.issuer}
                </span>
                <MaterialIcon name="verified" size={18} />
              </div>
              <h4 className="font-title-card text-base font-bold text-on-surface transition-colors group-hover:text-primary">
                {certificate.title}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setSelected(certificate)}
              aria-label={`Pratinjau sertifikat ${certificate.title}`}
              className="absolute inset-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            />
          </div>
        ))}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-w-2xl p-4 sm:max-w-2xl">
          <DialogTitle className="sr-only">
            {selected?.title ?? "Certificate preview"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Pratinjau sertifikat yang diterbitkan oleh{" "}
            {selected?.issuer ?? "penyedia kredensial"}.
          </DialogDescription>

          {selected ? (
            <div className="flex flex-col gap-3">
              <div
                role="img"
                aria-label={selected.title}
                className="aspect-[16/10] w-full rounded-lg bg-gradient-to-br from-primary-fixed via-surface-container to-secondary-fixed bg-cover bg-center"
                style={{ backgroundImage: `url("${selected.image}")` }}
              />
              <div className="px-2 pb-1">
                <p className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">
                  {selected.issuer}
                </p>
                <p className="mt-1 font-title-card text-base font-bold text-on-surface">
                  {selected.title}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
