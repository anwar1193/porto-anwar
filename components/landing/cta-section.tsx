import { MaterialIcon } from "@/components/material-icon";

export function CtaSection() {
  return (
    <section
      id="contact"
      className="relative flex scroll-mt-24 flex-col items-center justify-center overflow-hidden px-space-md py-space-2xl text-center"
    >
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-xl rounded-full bg-gradient-to-tr from-secondary-container/15 via-primary/10 to-transparent blur-3xl" />

      <div className="group relative flex cursor-pointer flex-col items-center">
        <div className="relative flex size-36 items-center justify-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 120 120"
            className="size-32 drop-shadow-[0_12px_20px_rgba(255,193,7,0.35)] transition-transform duration-300 group-hover:scale-110"
          >
            <path
              d="M40 70 C30 70 20 80 25 95 C30 110 80 115 95 95 C105 80 95 65 80 65 C75 55 70 40 55 40 C40 40 38 52 40 70 Z"
              fill="#FFD54F"
            />
            <circle cx="58" cy="46" r="24" fill="#FFCA28" />
            <circle cx="48" cy="54" r="4" fill="#FF8A65" opacity="0.6" />
            <circle cx="70" cy="54" r="4" fill="#FF8A65" opacity="0.6" />
            <path d="M48 50 Q58 56 68 50 Q58 64 48 50 Z" fill="#FF7043" />
            <rect x="42" y="38" width="16" height="11" rx="3" fill="#212121" />
            <rect x="60" y="38" width="16" height="11" rx="3" fill="#212121" />
            <line
              x1="56"
              y1="43"
              x2="62"
              y2="43"
              stroke="#212121"
              strokeWidth="2.5"
            />
            <line
              x1="44"
              y1="40"
              x2="52"
              y2="47"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.8"
            />
            <line
              x1="62"
              y1="40"
              x2="70"
              y2="47"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
          <span className="absolute -top-1 right-2 animate-pulse text-xl">✨</span>
          <span className="absolute -left-2 bottom-2 animate-bounce text-lg">😎</span>
        </div>
      </div>

      <h3 className="mt-space-sm font-headline-section text-headline-section-mobile font-bold text-on-surface sm:text-headline-section">
        Interested?
      </h3>
      <p className="mt-space-xs max-w-md font-body-default text-body-default text-on-surface-variant">
        {
          "Have a challenging backend architecture or fullstack role? Let's talk about software and build resilient apps."
        }
      </p>

      <div className="mt-space-lg">
        <a
          href="/anwar-cv.pdf"
          download
          className="inline-flex items-center gap-space-sm rounded-2xl bg-gradient-to-r from-primary to-primary-container px-space-2xl py-3.5 font-label-caps text-label-caps uppercase tracking-wider text-on-primary shadow-[0_10px_28px_-4px_rgba(0,91,175,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_36px_-6px_rgba(0,91,175,0.5)]"
        >
          <MaterialIcon name="download" size={22} />
          <span>Download CV</span>
        </a>
      </div>

      <div className="mt-space-2xl flex flex-col items-center pt-space-md">
        <p className="flex flex-wrap items-center justify-center gap-1.5 font-body-muted text-body-muted font-medium text-secondary">
          <span>Made with</span>
          <span className="text-error">❤️</span>
          <span>Motivated</span>
        </p>
        <p className="font-body-muted text-body-muted text-on-surface-variant">
          on my first love, Designed by Me
        </p>
      </div>
    </section>
  );
}
