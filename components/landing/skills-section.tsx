import { MaterialIcon } from "@/components/material-icon";
import { SectionHeading } from "@/components/landing/section-heading";
import type { Skill } from "@/lib/cms/types";

export function SkillsSection({ skills }: { skills: Skill[] }) {
  return (
    <section id="skills" className="flex scroll-mt-24 flex-col gap-space-xl">
      <SectionHeading title="SKILLS" />

      {skills.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-outline-variant p-space-lg text-center font-body-muted text-body-muted text-on-surface-variant">
          Belum ada skill yang dipublikasikan.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-space-md sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="group flex flex-col items-center gap-space-xs rounded-2xl bg-surface-container-lowest p-space-lg text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-container-low text-primary transition-transform group-hover:scale-110">
                <MaterialIcon name={skill.icon} size={36} />
              </div>
              <span className="mt-space-xs font-title-card text-base font-bold text-on-surface">
                {skill.name}
              </span>
              <span className="font-tech-tag text-tech-tag font-bold text-primary">
                {skill.yearsLabel}
              </span>
              <span className="font-label-caps text-label-caps uppercase text-tertiary">
                of Experience
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
