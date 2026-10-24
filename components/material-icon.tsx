import { cn } from "@/lib/utils";

type MaterialIconProps = {
  name: string;
  size?: number;
  className?: string;
};

/**
 * Material Symbols ligature icon. The explicit inline font size wins over the
 * icon font stylesheet, which ships its own 24px rule.
 */
export function MaterialIcon({
  name,
  size = 20,
  className,
}: MaterialIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "material-symbols-outlined select-none leading-none",
        className,
      )}
      style={{ fontSize: `${size}px` }}
    >
      {name}
    </span>
  );
}
