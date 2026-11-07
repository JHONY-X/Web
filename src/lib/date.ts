function formatISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return formatISO(new Date());
}

export function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatISO(date);
}

export function daysAgo(days: number): string {
  return daysFromNow(-days);
}

export function timestampAgo(days: number, time: string): string {
  return `${daysAgo(days)} ${time}`;
}
