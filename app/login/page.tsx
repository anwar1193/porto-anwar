import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login/login-form";
import { MaterialIcon } from "@/components/material-icon";
import { getCurrentUser } from "@/lib/auth/guards";
import { sanitizeNextPath } from "@/lib/auth/validation";

export const metadata: Metadata = {
  title: "Login CMS",
  description: "Masuk ke portal manajemen konten portofolio Anwar.",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    reason?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/admin");
  }

  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);
  const initialMessage =
    params.reason === "expired"
      ? "Sesi Anda telah berakhir. Silakan masuk kembali."
      : undefined;

  return (
    <div className="flex min-h-screen flex-col justify-between bg-background text-foreground">
      <header className="w-full py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-on-primary">
              <MaterialIcon name="terminal" size={20} />
            </div>
            <span className="font-title-card text-title-card text-on-surface">
              Anwar CMS
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 font-body-muted text-body-muted text-on-surface-variant transition-colors hover:text-primary"
          >
            <MaterialIcon name="arrow_back" size={18} />
            <span>Back to Live Portfolio</span>
          </Link>
        </div>
      </header>

      <main className="flex w-full flex-1 items-center justify-center bg-background px-6 py-8">
        <div className="relative flex w-full flex-col items-center justify-center">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[340px] w-[580px] -translate-x-1/2 rounded-full bg-secondary-container/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-1/4 h-[280px] w-[380px] rounded-full bg-primary-fixed/25 blur-2xl" />

          <div className="relative w-full max-w-[460px]">
            <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-8 shadow-xl sm:p-10">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary-container via-secondary-container to-primary" />

              <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-on-primary shadow-md shadow-primary/20">
                    <MaterialIcon name="terminal" size={22} />
                  </div>
                  <span className="font-headline-section text-title-card tracking-tight text-on-surface">
                    Anwar<span className="text-primary">.dev</span>
                  </span>
                  <span className="rounded-full bg-primary-fixed px-2.5 py-1 font-label-caps text-label-caps uppercase text-on-primary-fixed-variant">
                    CMS Admin
                  </span>
                </div>
                <h1 className="mb-2 font-headline-section text-headline-section-mobile text-on-surface sm:text-headline-section">
                  Selamat Datang Kembali
                </h1>
                <p className="max-w-xs font-body-muted text-body-muted text-on-surface-variant">
                  Masuk ke portal manajemen konten portofolio Anwar
                </p>
              </div>

              <LoginForm
                nextPath={nextPath}
                initialMessage={initialMessage}
              />

              <div className="-mx-8 -mb-8 mt-8 flex flex-col items-center gap-3 bg-surface-container-low/60 p-6 text-center sm:-mx-10 sm:-mb-10">
                <div className="flex items-center gap-2 font-tech-tag text-tech-tag text-on-surface-variant">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-secondary" />
                  </span>
                  <span>Server-Validated Session</span>
                  <span className="text-outline">/</span>
                  <span className="flex items-center gap-1">
                    <MaterialIcon
                      name="verified_user"
                      size={14}
                      className="text-secondary"
                    />
                    256-Bit SSL Encrypted
                  </span>
                </div>
                <Link
                  href="/"
                  className="mt-1 inline-flex items-center gap-1.5 font-body-muted text-body-muted font-medium text-primary transition-colors hover:text-primary-container hover:underline"
                >
                  <MaterialIcon name="keyboard_backspace" size={18} />
                  <span>Kembali ke Portofolio Publik</span>
                </Link>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 font-tech-tag text-tech-tag text-on-surface-variant">
              <div className="flex size-6 items-center justify-center rounded-full bg-surface-container-high text-primary">
                🦆
              </div>
              <span>Anwar Duck Engine v2.4 • Production Ready</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center">
        <div className="mx-auto max-w-7xl px-6 font-tech-tag text-tech-tag text-on-surface-variant">
          © 2025 Anwar Portfolio CMS Engine • Protected Administrative Gateway
        </div>
      </footer>
    </div>
  );
}
