import { MaterialIcon } from "@/components/material-icon";
import { portrait } from "@/lib/content";

const socialCards = [
  {
    label: "Github",
    meta: "@darektoa",
    href: "https://github.com/darektoa",
    icon: "code",
    featured: true,
  },
  {
    label: "LinkedIn",
    meta: "Connect Pro",
    href: "https://linkedin.com",
    icon: "work",
    featured: false,
  },
  {
    label: "Instagram",
    meta: "Moments",
    href: "https://instagram.com",
    icon: "photo_camera",
    featured: false,
    arrow: true,
  },
];

export function Hero() {
  return (
    <section
      id="about"
      className="grid scroll-mt-24 grid-cols-1 items-center gap-space-xl pt-space-lg lg:grid-cols-12"
    >
      <div className="flex flex-col items-start gap-space-md lg:col-span-7">
        <div className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-high/60 px-space-md py-space-xs shadow-sm backdrop-blur-md">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary-container opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-secondary-container" />
          </span>
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary">
            Open for High-Impact Projects
          </span>
        </div>

        <div className="mt-space-xs flex flex-col gap-space-xs">
          <h1 className="font-display-hero text-display-hero-mobile tracking-tight text-primary sm:text-display-hero">
            {"IT'S ME, ANWAR"}
          </h1>
          <p className="flex items-center gap-2 font-title-card text-title-card font-semibold text-on-surface">
            <span>{"I'm an enthusiastic programmer"}</span>
            <span className="text-xl">🙌</span>
          </p>
        </div>

        <p className="mt-space-xs max-w-xl font-body-default text-body-default leading-relaxed text-on-surface-variant">
          {"I'm a software engineering graduate, let's talk about software. Don't ask any privacy, I really love the privacy "}
          <span className="text-error">😍</span>
        </p>

        <div className="mt-space-md flex flex-wrap items-center gap-space-md">
          <a
            href="/anwar-cv.pdf"
            download
            className="flex items-center gap-space-sm rounded-xl bg-gradient-to-r from-primary to-primary-container px-space-xl py-3 font-label-caps text-label-caps uppercase tracking-wider text-on-primary shadow-[0_8px_24px_-4px_rgba(0,91,175,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-4px_rgba(0,91,175,0.45)]"
          >
            <MaterialIcon name="download" size={20} />
            <span>Download CV</span>
          </a>

          <div className="flex items-center gap-space-xs rounded-xl bg-surface-container-lowest px-space-md py-2 shadow-sm">
            <span className="font-stat-number text-stat-number text-primary">3+</span>
            <span className="font-tech-tag text-tech-tag text-on-surface-variant">
              Years Building Systems
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-space-md lg:col-span-5 lg:items-end">
        <div className="flex w-full flex-col items-center justify-end gap-space-md md:flex-row">
          <div className="group relative flex-shrink-0">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-primary/20 to-secondary-container/20 opacity-70 blur-xl transition-opacity group-hover:opacity-100" />
            <div className="relative flex h-64 w-48 items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-surface-container-low to-surface shadow-xl sm:h-72 sm:w-52">
              <img
                src={portrait}
                alt="Anwar, software engineer"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-xl bg-surface-container-lowest/90 px-2.5 py-1.5 shadow-sm backdrop-blur-md">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-on-surface">Anwar</span>
                  <span className="font-label-caps text-[10px] uppercase tracking-wider text-primary">
                    Software Engineer
                  </span>
                </div>
                <span className="size-2 animate-pulse rounded-full bg-secondary-container" />
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-[200px] flex-grow flex-col gap-space-sm">
            {socialCards.map((card) =>
              card.featured ? (
                <a
                  key={card.label}
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-space-sm rounded-2xl bg-gradient-to-br from-primary to-primary-container p-space-md text-on-primary shadow-[0_8px_20px_-4px_rgba(0,91,175,0.35)] transition-all hover:-translate-y-0.5"
                >
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-on-primary/15 backdrop-blur-sm transition-transform group-hover:scale-105">
                    <MaterialIcon name={card.icon} size={22} />
                  </div>
                  <div className="flex flex-col overflow-hidden text-left">
                    <span className="font-title-card text-sm font-bold tracking-tight">
                      {card.label}
                    </span>
                    <span className="truncate font-tech-tag text-xs text-on-primary/80">
                      {card.meta}
                    </span>
                  </div>
                </a>
              ) : (
                <a
                  key={card.label}
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl bg-surface-container-lowest p-space-md text-on-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-space-sm">
                    <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary transition-transform group-hover:scale-105">
                      <MaterialIcon name={card.icon} size={22} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-title-card text-sm font-bold tracking-tight">
                        {card.label}
                      </span>
                      <span className="font-tech-tag text-xs text-on-surface-variant">
                        {card.meta}
                      </span>
                    </div>
                  </div>
                  {card.arrow ? (
                    <MaterialIcon
                      name="arrow_forward"
                      size={18}
                      className="text-primary transition-transform group-hover:translate-x-1"
                    />
                  ) : null}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
