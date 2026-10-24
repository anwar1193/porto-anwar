import Link from "next/link";

import { MaterialIcon } from "@/components/material-icon";
import { socialLinks } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-space-3xl w-full bg-surface-container-low/70 py-space-2xl shadow-[0_-1px_12px_rgba(0,0,0,0.02)]">
      <div className="mx-auto max-w-[1240px] px-margin md:px-margin-md lg:px-margin-lg">
        <div className="flex flex-col items-center justify-between gap-space-lg pb-space-xl md:flex-row">
          <div className="flex items-center gap-space-md">
            <div className="flex size-10 items-center justify-center rounded-xl bg-surface-container-high text-primary">
              <MaterialIcon name="terminal" size={22} />
            </div>
            <div>
              <p className="font-title-card text-title-card text-on-surface">
                Anwar.dev
              </p>
              <p className="font-body-muted text-body-muted text-on-surface-variant">
                Engineering resilient distributed architectures &amp; elegant
                interfaces.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-md">
            {socialLinks.map((link) => {
              const isMail = link.href.startsWith("mailto:");
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={isMail ? undefined : "_blank"}
                  rel={isMail ? undefined : "noreferrer"}
                  aria-label={link.label}
                  className="flex size-9 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-primary"
                >
                  <MaterialIcon name={link.icon} size={18} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-space-sm border-t border-outline-variant/40 pt-space-lg text-center sm:flex-row sm:text-left">
          <p className="flex items-center justify-center gap-1.5 font-body-muted text-body-muted text-tertiary sm:justify-start">
            <span>Made with</span>
            <span className="text-error">❤️</span>
            <span>Motivated on my first love, Designed for Anwar</span>
          </p>
          <div className="flex items-center gap-space-md">
            <p className="font-label-caps text-label-caps uppercase tracking-wider text-tertiary">
              © 2025 ANWAR.DEV • All Rights Reserved
            </p>
            <Link
              href="/login"
              className="font-label-caps text-label-caps uppercase tracking-wider text-primary transition-colors hover:text-primary-container hover:underline"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
