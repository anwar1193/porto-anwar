import type { ReactNode } from "react";

import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  icon: string;
  iconClassName?: string;
  footer: ReactNode;
};

export function MetricCard({
  label,
  value,
  icon,
  iconClassName,
  footer,
}: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
            {label}
          </span>
          <span className="mt-1 font-display-hero-mobile text-display-hero-mobile font-extrabold tracking-tight text-on-surface">
            {value}
          </span>
        </div>
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            iconClassName,
          )}
        >
          <MaterialIcon name={icon} size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 pt-3">
        {footer}
      </div>
    </div>
  );
}
