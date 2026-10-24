export function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-space-md">
      <h2 className="whitespace-nowrap font-headline-section text-headline-section-mobile font-bold tracking-tight text-on-surface sm:text-headline-section">
        # {title}
      </h2>
      <div className="h-0.5 w-full rounded-full bg-gradient-to-r from-primary via-secondary-container to-transparent" />
    </div>
  );
}
