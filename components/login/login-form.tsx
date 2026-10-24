"use client";

import { useState, type FormEvent } from "react";

import { loginAction } from "@/app/login/actions";
import { MaterialIcon } from "@/components/material-icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type LoginFormProps = {
  nextPath?: string;
  initialMessage?: string;
};

export function LoginForm({
  nextPath = "/admin",
  initialMessage,
}: LoginFormProps) {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(initialMessage ?? "");
  const [isError, setIsError] = useState(Boolean(initialMessage));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const result = await loginAction({
        email: identity,
        password,
        remember,
        next: nextPath,
      });

      if (result?.error) {
        setIsError(true);
        setMessage(result.error);
      }
    } catch {
      setIsError(true);
      setMessage("Tidak dapat memproses login. Coba lagi sebentar lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        aria-live="polite"
        className={cn(
          "mb-6 items-start gap-3 rounded-lg p-3.5",
          message ? "flex" : "hidden",
          isError
            ? "bg-error-container/60 text-on-error-container"
            : "bg-surface-container-low text-on-surface",
        )}
      >
        <MaterialIcon
          name={isError ? "error" : "info"}
          size={20}
          className={cn(
            "mt-0.5",
            isError ? "text-error" : "text-primary",
          )}
        />
        <div className="flex-1">
          <p className="font-body-muted text-body-muted leading-tight">
            {message}
          </p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label
            htmlFor="identity"
            className="block font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant"
          >
            Email
          </Label>
          <div className="relative flex items-center">
            <MaterialIcon
              name="mail"
              size={20}
              className="pointer-events-none absolute left-3.5 z-10 text-outline"
            />
            <Input
              id="identity"
              name="email"
              type="email"
              required
              autoComplete="username"
              placeholder="anwar@domain.com"
              value={identity}
              onChange={(event) => setIdentity(event.target.value)}
              className="h-auto w-full rounded-lg border-transparent bg-surface-container-low py-3 pr-4 pl-11 font-body-default text-body-default text-on-surface shadow-sm transition-all placeholder:text-outline focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="block font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant"
            >
              Password
            </Label>
            <a
              href="mailto:contact@anwar.dev?subject=Reset%20Password%20Anwar%20CMS"
              className="font-tech-tag text-tech-tag text-primary transition-colors hover:text-primary-container hover:underline"
            >
              Lupa password?
            </a>
          </div>
          <div className="relative flex items-center">
            <MaterialIcon
              name="lock"
              size={20}
              className="pointer-events-none absolute left-3.5 z-10 text-outline"
            />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-auto w-full rounded-lg border-transparent bg-surface-container-low py-3 pr-11 pl-11 font-body-default text-body-default text-on-surface shadow-sm transition-all placeholder:text-outline focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
              className="absolute right-3 flex items-center justify-center rounded p-1 text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
            >
              <MaterialIcon
                name={showPassword ? "visibility_off" : "visibility"}
                size={20}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Label
            htmlFor="remember"
            className="flex cursor-pointer select-none items-center gap-2.5 font-body-muted text-body-muted font-normal text-on-surface-variant"
          >
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(Boolean(checked))}
            />
            <span>Ingat saya di perangkat ini</span>
          </Label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="group mt-2 h-auto w-full rounded-lg bg-gradient-to-r from-primary via-primary-container to-secondary px-6 py-3.5 font-title-card text-body-default text-on-primary shadow-md transition-all hover:shadow-xl hover:shadow-primary/25 active:scale-[0.99]"
        >
          <span>{loading ? "Mengautentikasi..." : "Masuk ke Dashboard"}</span>
          <MaterialIcon
            name={loading ? "progress_activity" : "arrow_forward"}
            size={20}
            className={cn(
              "transition-transform",
              loading ? "animate-spin" : "group-hover:translate-x-1",
            )}
          />
        </Button>
      </form>
    </>
  );
}
