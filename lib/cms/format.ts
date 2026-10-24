const MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatMonth(value: string): string {
  const match = MONTH_PATTERN.exec(value);

  if (!match) return value;

  const year = Number(match[1]);
  const month = Number(match[2]);

  return monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatPeriod(
  startDate: string,
  endDate: string | null,
  isCurrent: boolean,
): string {
  const start = formatMonth(startDate);

  if (isCurrent) return `${start} — Present`;
  if (!endDate) return start;

  return `${start} — ${formatMonth(endDate)}`;
}

export function toMonthInput(value: string | null | undefined): string {
  return value ?? "";
}

export function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}
