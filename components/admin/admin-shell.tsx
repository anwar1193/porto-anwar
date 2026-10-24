"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { logoutAction } from "@/app/admin/actions";
import {
  AdminSearchProvider,
  useAdminSearch,
} from "@/components/admin/search-context";
import { MaterialIcon } from "@/components/material-icon";
import { Input } from "@/components/ui/input";
import { adminAvatar } from "@/lib/images";
import { cn } from "@/lib/utils";

export type AdminUser = {
  name: string;
  email: string;
  role: string;
};

type NavItem = {
  id: string;
  label: string;
  icon: string;
  href?: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "grid_view", href: "/admin" },
  { id: "projects", label: "Projects", icon: "code_blocks", href: "/admin/projects" },
  {
    id: "experience",
    label: "Experiences & Career",
    icon: "timeline",
    href: "/admin/experiences",
  },
  {
    id: "skills",
    label: "Skills & Tech Stack",
    icon: "integration_instructions",
    href: "/admin/skills",
  },
  {
    id: "achievements",
    label: "Achievements & Certs",
    icon: "military_tech",
    href: "/admin/achievements",
  },
  { id: "settings", label: "Settings", icon: "tune" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col justify-between py-6">
      <div className="flex flex-col gap-6">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-center gap-3 px-6"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-on-primary shadow-[0_4px_16px_rgba(0,116,219,0.25)]">
            <MaterialIcon name="terminal" size={22} />
          </div>
          <div className="flex flex-col">
            <span className="font-title-card text-title-card leading-tight text-on-surface">
              Anwar CMS
            </span>
            <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary">
              Developer Studio
            </span>
          </div>
        </Link>

        <nav className="flex flex-col gap-1 px-4">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : Boolean(item.href && pathname.startsWith(item.href));
            const itemClassName = cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
              active
                ? "bg-primary-container font-semibold text-on-primary-container shadow-[0_2px_10px_rgba(0,116,219,0.18)]"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
            );

            const content = (
              <>
                <MaterialIcon
                  name={item.icon}
                  size={20}
                  className="transition-transform group-hover:scale-105"
                />
                <span className="font-body-muted text-body-muted font-medium">
                  {item.label}
                </span>
              </>
            );

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={onNavigate}
                  className={itemClassName}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  toast.info(`${item.label} akan tersedia pada modul berikutnya.`);
                  onNavigate?.();
                }}
                className={itemClassName}
              >
                {content}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-3 px-4">
        <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-3.5 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2.5">
            <div className="size-2.5 animate-pulse rounded-full bg-secondary-container" />
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                API Status
              </span>
              <span className="font-tech-tag text-tech-tag text-on-surface">
                Production Live
              </span>
            </div>
          </div>
          <MaterialIcon name="verified" size={18} className="text-secondary" />
        </div>

        <div className="flex items-center justify-between px-2 text-on-surface-variant">
          <span className="font-tech-tag text-tech-tag">
            v2.4.0 • DuckEngine
          </span>
          <button
            type="button"
            onClick={() => toast.info("Dokumentasi DuckEngine belum tersedia.")}
            className="flex items-center gap-0.5 font-tech-tag text-tech-tag text-primary transition-colors hover:text-on-surface"
          >
            Docs
            <MaterialIcon name="arrow_outward" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Topbar({
  onOpenMenu,
  user,
}: {
  onOpenMenu: () => void;
  user: AdminUser;
}) {
  const { query, setQuery } = useAdminSearch();
  const [avatarOk, setAvatarOk] = useState(true);

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 bg-surface/85 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:left-72">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:gap-4 sm:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Buka menu navigasi"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface lg:hidden"
        >
          <MaterialIcon name="menu" size={22} />
        </button>

        <div className="relative w-full max-w-md flex-1">
          <MaterialIcon
            name="search"
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Cari proyek, keahlian, atau sertifikat"
            placeholder="Search projects, skills, certificates..."
            className="h-9 w-full rounded-lg border-transparent bg-surface-container-low py-2 pr-4 pl-9 font-body-muted text-body-muted text-on-surface shadow-none placeholder:text-on-surface-variant focus-visible:bg-surface-container focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1.5 xl:flex">
            <div className="size-2 rounded-full bg-secondary-container" />
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
              Portfolio Sync: Active
            </span>
          </div>

          <button
            type="button"
            aria-label="Notifikasi"
            onClick={() => toast.info("3 notifikasi baru menunggu ditinjau.")}
            className="relative flex size-9 items-center justify-center rounded-lg text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
          >
            <MaterialIcon name="notifications" size={20} />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
          </button>

          <button
            type="button"
            aria-label="Status build"
            onClick={() =>
              toast.info("Build pipeline production: v2.4.0 live.")
            }
            className="hidden size-9 items-center justify-center rounded-lg text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface sm:flex"
          >
            <MaterialIcon name="deployed_code" size={20} />
          </button>

          <div className="flex items-center gap-3 pl-1 sm:pl-3">
            <Link
              href="/"
              title="Lihat portofolio publik"
              className="relative block"
            >
              {avatarOk ? (
                <img
                  src={adminAvatar}
                  alt={user.name}
                  onError={() => setAvatarOk(false)}
                  className="size-9 rounded-full object-cover shadow-[0_2px_8px_rgba(0,116,219,0.2)]"
                />
              ) : (
                <div className="flex size-9 items-center justify-center rounded-full bg-primary">
                  <MaterialIcon
                    name="person"
                    size={18}
                    className="text-on-primary"
                  />
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-secondary-container ring-2 ring-surface" />
            </Link>
            <div className="hidden flex-col text-left md:flex">
              <span className="font-body-muted text-body-muted font-semibold leading-snug text-on-surface">
                {user.name}
              </span>
              <span className="font-tech-tag text-tech-tag leading-none text-on-surface-variant">
                {user.role === "admin" ? "Administrator" : user.role}
              </span>
            </div>
            <form action={logoutAction} className="flex">
              <button
                type="submit"
                aria-label="Keluar dari dashboard"
                title="Keluar"
                className="flex size-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-error-container/60 hover:text-error"
              >
                <MaterialIcon name="logout" size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}

export function AdminShell({
  children,
  user,
}: {
  children: ReactNode;
  user: AdminUser;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <AdminSearchProvider>
      <div className="min-h-screen bg-surface text-on-surface">
        <aside className="fixed left-0 top-0 z-50 hidden h-full w-72 flex-col bg-surface-container-low lg:flex">
          <SidebarContent />
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <button
              type="button"
              aria-label="Tutup menu navigasi"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm"
            />
            <aside className="absolute left-0 top-0 h-full w-72 animate-in slide-in-from-left-4 bg-surface-container-low shadow-2xl duration-200">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        ) : null}

        <div className="lg:pl-72">
          <Topbar
            user={user}
            onOpenMenu={() => setMobileOpen(true)}
          />
          <main className="min-h-screen w-full bg-surface pt-16">
            {children}
          </main>
        </div>
      </div>
    </AdminSearchProvider>
  );
}
