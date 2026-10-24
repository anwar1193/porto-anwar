import { MaterialIcon } from "@/components/material-icon";
import { SectionHeading } from "@/components/landing/section-heading";
import { experiences } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ExperiencesSection() {
  return (
    <section
      id="experiences"
      className="flex scroll-mt-24 flex-col gap-space-xl"
    >
      <SectionHeading title="EXPERIENCES" />

      <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2">
        {experiences.map((experience) => (
          <div
            key={`${experience.role}-${experience.org}`}
            className="group relative flex flex-col justify-between gap-space-md overflow-hidden rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-space-md">
              <div className="flex items-center gap-space-sm">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                    experience.active
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
                    {experience.active ? (
                      <span className="size-2 animate-pulse rounded-full bg-secondary-container" />
                    ) : null}
                  </div>
                  <span
                    className={cn(
                      "font-tech-tag text-tech-tag font-semibold",
                      experience.active ? "text-primary" : "text-secondary",
                    )}
                  >
                    {experience.org}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  "whitespace-nowrap rounded-full px-space-md py-1 font-tech-tag text-tech-tag",
                  experience.active
                    ? "bg-primary-fixed font-bold text-on-primary-fixed-variant"
                    : "bg-surface-container text-tertiary",
                )}
              >
                {experience.period}
              </span>
            </div>
            <p className="font-body-default text-body-default leading-relaxed text-on-surface-variant">
              {experience.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
