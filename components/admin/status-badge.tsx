import type { CmsStatus } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: CmsStatus }) {
  const published = status === "published";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-label-caps text-label-caps uppercase tracking-wider",
        published
          ? "bg-secondary-fixed text-on-secondary-fixed"
          : "bg-surface-container-highest text-on-surface-variant",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          published ? "bg-secondary" : "bg-outline",
        )}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}
