import { MaterialIcon } from "@/components/material-icon";
import { SectionHeading } from "@/components/landing/section-heading";
import { landingProjects } from "@/lib/content";

export function ProjectsSection() {
  return (
    <section id="projects" className="flex scroll-mt-24 flex-col gap-space-xl">
      <SectionHeading title="PROJECTS" />

      <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
        {landingProjects.map((project) => (
          <article
            key={project.title}
            className="group flex flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl"
          >
            <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary-fixed via-surface-container to-secondary-fixed">
              <div
                role="img"
                aria-label={`${project.title} preview`}
                className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url("${project.image}")` }}
              />
              <div className="absolute right-space-sm top-space-sm rounded-lg bg-surface-container-lowest/90 p-1.5 text-primary shadow-sm backdrop-blur-md">
                <MaterialIcon name="open_in_new" size={20} />
              </div>
            </div>

            <div className="flex flex-grow flex-col justify-between gap-space-md p-space-lg">
              <div className="flex flex-col gap-space-xs">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-container px-2.5 py-0.5 font-tech-tag text-tech-tag text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-space-xs font-title-card text-title-card font-bold text-on-surface transition-colors group-hover:text-primary">
                  {project.title}
                </h3>
                <p className="line-clamp-2 font-body-muted text-body-muted text-on-surface-variant">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-space-xs">
                <span className="font-label-caps text-label-caps uppercase text-tertiary">
                  {project.category}
                </span>
                <div className="flex items-center gap-space-sm text-tertiary transition-colors group-hover:text-primary">
                  <MaterialIcon name="code" size={20} />
                  <MaterialIcon name="launch" size={20} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
