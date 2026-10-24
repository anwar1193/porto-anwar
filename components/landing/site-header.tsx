"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import { MaterialIcon } from "@/components/material-icon";
import { navItems } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [active, setActive] = useState(navItems[0]?.id ?? "about");
  const [open, setOpen] = useState(false);
  const scrollLockUntil = useRef(0);

  useEffect(() => {
    const updateActiveSection = () => {
      if (Date.now() < scrollLockUntil.current) return;

      const marker = window.scrollY + 140;
      const sections = navItems
        .map((item) => {
          const element = document.getElementById(item.id);
          if (!element) return null;

          return {
            id: item.id,
            top: element.getBoundingClientRect().top + window.scrollY,
          };
        })
        .filter(
          (section): section is { id: string; top: number } =>
            section !== null,
        )
        .sort((first, second) => first.top - second.top);

      if (sections.length === 0) return;

      const isAtPageBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (isAtPageBottom) {
        setActive(sections[sections.length - 1].id);
        return;
      }

      let current = sections[0].id;

      for (const section of sections) {
        if (section.top <= marker) current = section.id;
      }

      setActive(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    setActive(id);
    setOpen(false);

    const target = document.getElementById(id);
    if (!target) return;

    scrollLockUntil.current = Date.now() + 700;

    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", `#${id}`);
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-surface/85 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-margin md:px-margin-md lg:px-margin-lg">
        <Link href="/" className="group flex items-center gap-space-sm">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary-container shadow-[0_2px_10px_rgba(0,91,175,0.2)]">
            <span className="font-label-caps text-label-caps font-bold tracking-wider text-on-primary">
              AN
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-title-card text-title-card tracking-tight text-on-surface transition-colors group-hover:text-primary">
              Anwar<span className="text-primary">.dev</span>
            </span>
            <span className="hidden font-label-caps text-label-caps tracking-widest text-tertiary sm:block">
              FULLSTACK DEVELOPER
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-space-xs rounded-xl bg-surface-container-low/60 p-1 backdrop-blur-md xl:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => handleNavClick(event, item.id)}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "rounded-lg px-space-md py-space-xs transition-all",
                active === item.id
                  ? "bg-primary-container font-semibold text-on-primary-container"
                  : "font-body-muted text-body-muted text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Tutup navigasi" : "Buka navigasi"}
          className="flex size-10 items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface xl:hidden"
        >
          <MaterialIcon name={open ? "close" : "menu"} size={24} />
        </button>
      </div>

      {open ? (
        <div
          id="mobile-navigation"
          className="border-t border-outline-variant/40 bg-surface/95 px-margin py-space-md shadow-lg backdrop-blur-xl xl:hidden"
        >
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => handleNavClick(event, item.id)}
                aria-current={active === item.id ? "location" : undefined}
                className={cn(
                  "rounded-lg px-space-md py-space-sm font-body-muted text-body-muted transition-colors",
                  active === item.id
                    ? "bg-primary-container font-semibold text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                )}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-space-xs flex items-center gap-space-sm rounded-lg px-space-md py-space-sm font-body-muted text-body-muted text-primary transition-colors hover:bg-surface-container"
            >
              <MaterialIcon name="admin_panel_settings" size={18} />
              Admin CMS
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
