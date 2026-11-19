const DAY_ABBREVIATIONS: Record<string, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

export function formatText(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function formatDays(days: string[]): string {
  return days
    .map((day) => DAY_ABBREVIATIONS[day.toUpperCase()] ?? formatText(day))
    .join(", ");
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? "p.m." : "a.m.";
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`;
}
