import Link from "next/link";

import { AnalyticsChart } from "@/components/admin/analytics-chart";
import { MetricCard } from "@/components/admin/metric-card";
import { RightColumn } from "@/components/admin/right-column";
import { StatusBadge } from "@/components/admin/status-badge";
import { MaterialIcon } from "@/components/material-icon";
import type {
  Achievement,
  CmsStats,
  Experience,
  Project,
  Skill,
} from "@/lib/cms/types";
import { formatMonth, formatPeriod } from "@/lib/cms/format";

type DashboardProps = {
  stats: CmsStats;
  recentProjects: Project[];
  recentExperiences: Experience[];
  skills: Skill[];
  recentAchievements: Achievement[];
};

const MODULE_LINKS = [
  {
    href: "/admin/projects",
    label: "Projects",
    description: "Case study & showcase",
    icon: "code_blocks",
  },
  {
    href: "/admin/experiences",
    label: "Experiences",
    description: "Karier & mentoring",
    icon: "timeline",
  },
  {
    href: "/admin/skills",
    label: "Skills",
    description: "Tech stack & proficiency",
    icon: "integration_instructions",
  },
  {
    href: "/admin/achievements",
    label: "Achievements",
    description: "Sertifikat & penghargaan",
    icon: "military_tech",
  },
];

export function Dashboard({
  stats,
  recentProjects,
  recentExperiences,
  skills,
  recentAchievements,
}: DashboardProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-8 sm:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-gradient-to-br from-primary-fixed to-secondary-fixed opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 right-48 size-48 rounded-full bg-secondary-container/20 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex max-w-2xl flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 font-tech-tag text-tech-tag text-primary">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary-container opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-secondary-container" />
                </span>
                CMS terhubung ke database
              </span>
              <span className="font-tech-tag text-tech-tag text-on-surface-variant">
                {stats.published} published • {stats.drafts} draft
              </span>
            </div>

            <h1 className="font-headline-section text-headline-section-mobile tracking-tight text-on-surface sm:text-headline-section">
              Halo, Anwar!{" "}
              <span className="inline-block cursor-default transition-transform hover:rotate-12">
                👋
              </span>
            </h1>
            <p className="font-body-default text-body-default text-on-surface-variant">
              Kelola konten portofolio dari satu panel. Semua perubahan yang
              dipublikasikan akan tampil di landing page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/experiences"
              className="inline-flex h-auto items-center gap-1.5 rounded-xl bg-surface-container-high px-4 py-2.5 font-tech-tag text-tech-tag text-on-surface shadow-sm transition-all hover:bg-surface-container-highest"
            >
              <MaterialIcon name="add_circle" size={18} className="text-primary" />
              <span>Catat Pengalaman</span>
            </Link>
            <Link
              href="/admin/projects"
              className="inline-flex h-auto items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 font-tech-tag text-tech-tag text-on-primary shadow-md transition-all hover:bg-primary-container"
            >
              <MaterialIcon name="add_box" size={18} />
              <span>Tambah Proyek</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Projects"
          value={stats.projects}
          icon="terminal"
          iconClassName="bg-primary-fixed text-primary"
          footer={
            <Link
              href="/admin/projects"
              className="font-tech-tag text-tech-tag text-primary hover:underline"
            >
              Kelola proyek
            </Link>
          }
        />
        <MetricCard
          label="Experiences"
          value={stats.experiences}
          icon="timeline"
          iconClassName="bg-secondary-fixed text-secondary"
          footer={
            <Link
              href="/admin/experiences"
              className="font-tech-tag text-tech-tag text-primary hover:underline"
            >
              Kelola pengalaman
            </Link>
          }
        />
        <MetricCard
          label="Skills"
          value={stats.skills}
          icon="hub"
          iconClassName="bg-surface-container-high text-primary-container"
          footer={
            <Link
              href="/admin/skills"
              className="font-tech-tag text-tech-tag text-primary hover:underline"
            >
              Kelola skill
            </Link>
          }
        />
        <MetricCard
          label="Achievements"
          value={stats.achievements}
          icon="military_tech"
          iconClassName="bg-surface-container-highest text-on-surface"
          footer={
            <Link
              href="/admin/achievements"
              className="font-tech-tag text-tech-tag text-primary hover:underline"
            >
              Kelola pencapaian
            </Link>
          }
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <AnalyticsChart />

          <div className="flex flex-col gap-5 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <MaterialIcon name="layers" size={20} className="text-primary" />
                  <h2 className="font-title-card text-title-card text-on-surface">
                    Proyek Terbaru
                  </h2>
                </div>
                <p className="mt-0.5 font-body-muted text-body-muted text-on-surface-variant">
                  Ringkasan konten proyek yang terakhir diperbarui.
                </p>
              </div>
              <Link
                href="/admin/projects"
                className="inline-flex items-center gap-1 font-tech-tag text-tech-tag font-semibold text-primary hover:underline"
              >
                Lihat semua
                <MaterialIcon name="arrow_forward" size={16} />
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href="/admin/projects"
                  className="group flex items-center gap-4 rounded-xl bg-surface-container-low/60 p-3 transition-all hover:bg-surface-container-high/70"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface-container">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-on-surface-variant">
                        <MaterialIcon name="deployed_code" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-title-card text-base font-semibold text-on-surface">
                        {project.title}
                      </h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="line-clamp-1 font-body-muted text-body-muted text-on-surface-variant">
                      {project.summary}
                    </p>
                  </div>
                  <MaterialIcon
                    name="chevron_right"
                    size={20}
                    className="shrink-0 text-on-surface-variant transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              ))}

              {recentProjects.length === 0 ? (
                <p className="rounded-xl border border-dashed border-outline-variant p-6 text-center font-body-muted text-body-muted text-on-surface-variant">
                  Belum ada proyek.{" "}
                  <Link href="/admin/projects" className="text-primary underline">
                    Tambahkan proyek pertama
                  </Link>
                  .
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MaterialIcon name="timeline" size={20} className="text-primary" />
                  <h2 className="font-title-card text-title-card text-on-surface">
                    Pengalaman Terbaru
                  </h2>
                </div>
                <Link
                  href="/admin/experiences"
                  className="font-tech-tag text-tech-tag text-primary hover:underline"
                >
                  Kelola
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                {recentExperiences.map((experience) => (
                  <div
                    key={experience.id}
                    className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-low/60 p-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-body-muted text-body-muted font-semibold text-on-surface">
                        {experience.role}
                      </p>
                      <p className="truncate font-tech-tag text-[11px] text-on-surface-variant">
                        {experience.organization} •{" "}
                        {formatPeriod(
                          experience.startDate,
                          experience.endDate,
                          experience.isCurrent,
                        )}
                      </p>
                    </div>
                    <StatusBadge status={experience.status} />
                  </div>
                ))}

                {recentExperiences.length === 0 ? (
                  <p className="font-body-muted text-body-muted text-on-surface-variant">
                    Belum ada pengalaman.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MaterialIcon
                    name="military_tech"
                    size={20}
                    className="text-primary"
                  />
                  <h2 className="font-title-card text-title-card text-on-surface">
                    Pencapaian Terbaru
                  </h2>
                </div>
                <Link
                  href="/admin/achievements"
                  className="font-tech-tag text-tech-tag text-primary hover:underline"
                >
                  Kelola
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                {recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-low/60 p-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-body-muted text-body-muted font-semibold text-on-surface">
                        {achievement.title}
                      </p>
                      <p className="truncate font-tech-tag text-[11px] text-on-surface-variant">
                        {achievement.issuer}
                        {achievement.issuedAt
                          ? ` • ${formatMonth(achievement.issuedAt)}`
                          : ""}
                      </p>
                    </div>
                    <StatusBadge status={achievement.status} />
                  </div>
                ))}

                {recentAchievements.length === 0 ? (
                  <p className="font-body-muted text-body-muted text-on-surface-variant">
                    Belum ada pencapaian.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:hidden">
            {MODULE_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col gap-1 rounded-xl bg-surface-container-lowest p-4 shadow-sm"
              >
                <MaterialIcon name={item.icon} size={20} className="text-primary" />
                <span className="font-body-muted text-body-muted font-semibold text-on-surface">
                  {item.label}
                </span>
                <span className="font-tech-tag text-[11px] text-on-surface-variant">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <RightColumn skills={skills} />
      </div>
    </div>
  );
}
