export function getClientIp(forwardedFor: string | null | undefined): string {
  const first = forwardedFor?.split(",")[0]?.trim();

  return first || "unknown";
}
