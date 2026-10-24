import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string[];
  hint?: string;
  className?: string;
  children: ReactNode;
};

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-2 text-sm font-medium text-on-surface"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p className="font-tech-tag text-[11px] text-on-surface-variant">
          {hint}
        </p>
      ) : null}
      {error?.length ? (
        <p className="font-tech-tag text-[11px] font-semibold text-error">
          {error[0]}
        </p>
      ) : null}
    </div>
  );
}
