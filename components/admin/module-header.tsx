import type { ReactNode } from "react";

import { MaterialIcon } from "@/components/material-icon";
import { Button } from "@/components/ui/button";

type ModuleHeaderProps = {
  icon: string;
  title: string;
  description: string;
  count: number;
  addLabel: string;
  onAdd: () => void;
  children?: ReactNode;
};

export function ModuleHeader({
  icon,
  title,
  description,
  count,
  addLabel,
  onAdd,
  children,
}: ModuleHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-5 rounded-2xl bg-surface-container-lowest p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
          <MaterialIcon name={icon} size={26} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-headline-section text-headline-section-mobile tracking-tight text-on-surface sm:text-headline-section">
              {title}
            </h1>
            <span className="rounded-full bg-surface-container px-2.5 py-0.5 font-tech-tag text-tech-tag font-semibold text-on-surface-variant">
              {count} item
            </span>
          </div>
          <p className="mt-1 max-w-2xl font-body-default text-body-default text-on-surface-variant">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {children}
        <Button
          type="button"
          onClick={onAdd}
          className="h-auto rounded-xl bg-primary px-4 py-2.5 font-tech-tag text-tech-tag text-on-primary shadow-md transition-all hover:bg-primary-container"
        >
          <MaterialIcon name="add" size={18} />
          <span>{addLabel}</span>
        </Button>
      </div>
    </div>
  );
}
