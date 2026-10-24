import type { ReactNode } from "react";

import { MaterialIcon } from "@/components/material-icon";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-outline-variant bg-surface-container-low/50 px-6 py-12 text-center">
      <MaterialIcon name={icon} size={36} className="text-outline" />
      <div>
        <p className="font-title-card text-title-card font-semibold text-on-surface">
          {title}
        </p>
        <p className="mt-1 max-w-md font-body-muted text-body-muted text-on-surface-variant">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
