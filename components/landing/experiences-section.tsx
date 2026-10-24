import { MaterialIcon } from "@/components/material-icon";
import { SectionHeading } from "@/components/landing/section-heading";
import { formatPeriod } from "@/lib/cms/format";
import type { Experience } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

export function ExperiencesSection({
  experiences,
}: {
  experiences: Experience[];
}) {
  return (
    <section
      id="experiences"
      className="flex scroll-mt-24 flex-col gap-space-xl"
    >
      <SectionHeading title="EXPERIENCES" />

      {experiences.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-outline-variant p-space-lg text-center font-body-muted text-body-muted text-on-surface-variant">
          Belum ada pengalaman yang dipublikasikan.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              className="group relative flex flex-col justify-between gap-space-md overflow-hidden rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-space-md">
                <div className="flex items-center gap-space-sm">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                      experience.isCurrent
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container text-primary",
                    )}
                  >
                    <MaterialIcon name={experience.icon} size={22} />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-title-card text-title-card font-bold text-on-surface">
                        {experience.role}
                      </h3>
                      {experience.isCurrent ? (
                        <span className="size-2 animate-pulse rounded-full bg-secondary-container" />
                      ) : null}
                    </div>
                    <span
                      className={cn(
                        "font-tech-tag text-tech-tag font-semibold",
                        experience.isCurrent ? "text-primary" : "text-secondary",
                      )}
                    >
                      {experience.organization}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "whitespace-nowrap rounded-full px-space-md py-1 font-tech-tag text-tech-tag",
                    experience.isCurrent
                      ? "bg-primary-fixed font-bold text-on-primary-fixed-variant"
                      : "bg-surface-container text-tertiary",
                  )}
                >
                  {formatPeriod(
                    experience.startDate,
                    experience.endDate,
                    experience.isCurrent,
                  )}
                </span>
              </div>
              <p className="font-body-default text-body-default leading-relaxed text-on-surface-variant">
                {experience.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
