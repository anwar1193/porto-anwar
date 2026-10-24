"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { MaterialIcon } from "@/components/material-icon";
import { Switch } from "@/components/ui/switch";
import type { Skill } from "@/lib/cms/types";
import { inboxMessages } from "@/lib/content";
import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-secondary text-on-secondary",
  tertiary: "bg-tertiary-container text-on-tertiary",
} as const;

export function RightColumn({ skills }: { skills: Skill[] }) {
  const [available, setAvailable] = useState(true);
  const visibleSkills = skills.slice(0, 4);

  return (
    <div className="flex flex-col gap-8 lg:col-span-4">
      <div className="flex flex-col gap-5 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
            Status Ketersediaan
          </span>
          <MaterialIcon name="badge" size={20} className="text-secondary" />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="size-3.5 rounded-full bg-secondary-container" />
              <div className="absolute size-5 animate-ping rounded-full bg-secondary-container/40" />
            </div>
            <div className="flex flex-col">
              <span className="font-stat-number text-stat-number leading-tight text-on-surface">
                {available ? "Open for Hire" : "Sedang Sibuk"}
              </span>
              <span className="font-tech-tag text-tech-tag text-primary">
                {available
                  ? "Full-time / Freelance Active"
                  : "Sedang Tidak Menerima Tawaran (Busy)"}
              </span>
            </div>
          </div>
          <Switch
            checked={available}
            onCheckedChange={setAvailable}
            aria-label="Ubah status ketersediaan"
          />
        </div>

        <div className="flex items-center gap-3.5 rounded-xl bg-primary-fixed/40 p-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm">
            <MaterialIcon name="cruelty_free" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-body-muted text-body-muted font-semibold text-on-surface">
              Konten tersinkron dengan database
            </span>
            <span className="font-tech-tag text-tech-tag text-on-surface-variant">
              Perubahan published langsung tampil di landing page.
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MaterialIcon name="inbox" size={20} className="text-primary" />
            <h2 className="font-title-card text-title-card text-on-surface">
              Pesan Masuk Terbaru
            </h2>
          </div>
          <span className="rounded-full bg-primary px-2 py-0.5 font-tech-tag text-tech-tag font-bold text-on-primary">
            3 Baru
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {inboxMessages.map((message, index) => (
            <div
              key={message.name}
              className="flex flex-col gap-2 rounded-xl bg-surface-container-low/70 p-3.5 transition-all hover:bg-surface-container-high"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full font-label-caps text-[11px] font-bold",
                      TONE_CLASSES[message.tone],
                    )}
                  >
                    {message.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-muted text-body-muted font-semibold leading-none text-on-surface">
                      {message.name}
                    </span>
                    <span className="font-tech-tag text-[11px] text-on-surface-variant">
                      {message.role}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "whitespace-nowrap font-tech-tag text-[11px]",
                    index === 0 ? "text-primary" : "text-on-surface-variant",
                  )}
                >
                  {message.time}
                </span>
              </div>

              <p className="line-clamp-2 font-body-muted text-[13px] text-on-surface-variant">
                {message.message}
              </p>

              <div className="flex items-center justify-end gap-2 pt-1">
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent(
                    "Tanggapan Portfolio Anwar",
                  )}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-surface-container px-3 py-1 font-tech-tag text-tech-tag text-primary transition-all hover:bg-primary hover:text-on-primary"
                >
                  <MaterialIcon name="reply" size={14} />
                  <span>Balas via Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => toast.info("CRUD inbox belum termasuk pada versi ini.")}
          className="w-full rounded-xl bg-surface-container py-2.5 text-center font-tech-tag text-tech-tag text-on-surface-variant transition-colors hover:bg-surface-container-high"
        >
          Lihat Semua Pesan Masuk (9)
        </button>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MaterialIcon name="hub" size={20} className="text-primary" />
            <h2 className="font-title-card text-title-card text-on-surface">
              Keahlian &amp; Tech Stack
            </h2>
          </div>
          <Link
            href="/admin/skills"
            className="font-tech-tag text-tech-tag text-primary transition-colors hover:text-on-surface"
          >
            Kelola
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {visibleSkills.map((skill) => (
            <div key={skill.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2 font-tech-tag text-tech-tag">
                <span className="flex items-center gap-1.5 font-medium text-on-surface">
                  <span className="size-2 rounded-full bg-primary" />
                  {skill.name}
                </span>
                <span className="whitespace-nowrap text-on-surface-variant">
                  {skill.proficiency}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
            </div>
          ))}

          {visibleSkills.length === 0 ? (
            <p className="font-body-muted text-body-muted text-on-surface-variant">
              Belum ada skill published.{" "}
              <Link href="/admin/skills" className="text-primary underline">
                Tambahkan skill
              </Link>
              .
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-3 font-tech-tag text-[12px] text-on-surface-variant">
          <span>
            Total skill: <strong>{skills.length}</strong>
          </span>
          <MaterialIcon name="sync" size={16} className="text-primary" />
        </div>
      </div>
    </div>
  );
}
