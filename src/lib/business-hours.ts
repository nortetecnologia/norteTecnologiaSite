export interface DaySchedule {
  open: boolean;
  openTime: string;
  closeTime: string;
  hasLunch: boolean;
  lunchStart: string;
  lunchEnd: string;
}

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type WeekSchedule = Record<WeekDay, DaySchedule>;

export const DAYS_ORDER: WeekDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABELS: Record<WeekDay, string> = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const DEFAULT_SCHEDULE: WeekSchedule = {
  monday:    { open: true,  openTime: "08:00", closeTime: "18:00", hasLunch: true,  lunchStart: "12:00", lunchEnd: "13:00" },
  tuesday:   { open: true,  openTime: "08:00", closeTime: "18:00", hasLunch: true,  lunchStart: "12:00", lunchEnd: "13:00" },
  wednesday: { open: true,  openTime: "08:00", closeTime: "18:00", hasLunch: true,  lunchStart: "12:00", lunchEnd: "13:00" },
  thursday:  { open: true,  openTime: "08:00", closeTime: "18:00", hasLunch: true,  lunchStart: "12:00", lunchEnd: "13:00" },
  friday:    { open: true,  openTime: "08:00", closeTime: "18:00", hasLunch: true,  lunchStart: "12:00", lunchEnd: "13:00" },
  saturday:  { open: true,  openTime: "08:00", closeTime: "13:00", hasLunch: false, lunchStart: "12:00", lunchEnd: "13:00" },
  sunday:    { open: false, openTime: "08:00", closeTime: "18:00", hasLunch: false, lunchStart: "12:00", lunchEnd: "13:00" },
};

function timeToMinutes(time: string): number {
  const parts = time.split(":");
  const h = parseInt(parts[0] ?? "0", 10);
  const m = parseInt(parts[1] ?? "0", 10);
  return h * 60 + m;
}

// Checks if the store is currently open.
// Uses Belém/Pará timezone (UTC-3, no DST).
export function isStoreOpen(
  schedule: WeekSchedule | null | undefined
): boolean {
  if (!schedule) return false;

  // Shift UTC time to UTC-3 (Belém — no daylight saving)
  const now = new Date();
  const belemDate = new Date(now.getTime() - 3 * 60 * 60 * 1000);

  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const jsDay = belemDate.getUTCDay();
  const dayIndexToKey: WeekDay[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayKey = dayIndexToKey[jsDay] ?? "sunday";
  const day = schedule[dayKey];

  if (!day?.open) return false;

  const currentMinutes =
    belemDate.getUTCHours() * 60 + belemDate.getUTCMinutes();
  const openMinutes = timeToMinutes(day.openTime);
  const closeMinutes = timeToMinutes(day.closeTime);

  if (currentMinutes < openMinutes || currentMinutes >= closeMinutes)
    return false;

  if (day.hasLunch && day.lunchStart && day.lunchEnd) {
    const lunchStart = timeToMinutes(day.lunchStart);
    const lunchEnd = timeToMinutes(day.lunchEnd);
    if (currentMinutes >= lunchStart && currentMinutes < lunchEnd) return false;
  }

  return true;
}

// Returns a human-readable summary of today's hours.
export function getTodayHours(schedule: WeekSchedule | null | undefined): string | null {
  if (!schedule) return null;

  const now = new Date();
  const belemDate = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const jsDay = belemDate.getUTCDay();
  const dayIndexToKey: WeekDay[] = [
    "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
  ];
  const dayKey = dayIndexToKey[jsDay] ?? "sunday";
  const day = schedule[dayKey];

  if (!day?.open) return "Fechada hoje";

  let result = `${day.openTime}–${day.closeTime}`;
  if (day.hasLunch) result += ` (almoço ${day.lunchStart}–${day.lunchEnd})`;
  return result;
}
