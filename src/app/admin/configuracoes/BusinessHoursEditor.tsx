"use client";

import { useState } from "react";
import {
  DAYS_ORDER,
  DAY_LABELS,
  DEFAULT_SCHEDULE,
  type WeekDay,
  type WeekSchedule,
  type DaySchedule,
} from "@/lib/business-hours";

interface Props {
  initialSchedule: WeekSchedule | null;
}

export function BusinessHoursEditor({ initialSchedule }: Props) {
  const [schedule, setSchedule] = useState<WeekSchedule>(() => {
    if (!initialSchedule) return { ...DEFAULT_SCHEDULE };
    // Merge with DEFAULT to fill any missing fields from older data
    const merged = {} as WeekSchedule;
    for (const day of DAYS_ORDER) {
      merged[day] = { ...DEFAULT_SCHEDULE[day], ...(initialSchedule[day] ?? {}) };
    }
    return merged;
  });

  function updateDay(day: WeekDay, updates: Partial<DaySchedule>) {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...updates },
    }));
  }

  function copyWeekdays() {
    const mon = schedule.monday;
    setSchedule((prev) => ({
      ...prev,
      tuesday: { ...mon },
      wednesday: { ...mon },
      thursday: { ...mon },
      friday: { ...mon },
    }));
  }

  const timeInputClass =
    "bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#ffd600] transition-colors";

  return (
    <div>
      <input
        type="hidden"
        name="business_hours_schedule"
        value={JSON.stringify(schedule)}
      />

      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-xs text-[#6b7280]">
          Configure horários para cada dia da semana. Fuso horário: Belém/PA (UTC-3).
        </p>
        <button
          type="button"
          onClick={copyWeekdays}
          className="text-xs text-[#ffd600] hover:underline whitespace-nowrap shrink-0"
        >
          Copiar Seg → Ter–Sex
        </button>
      </div>

      <div className="space-y-2">
        {DAYS_ORDER.map((day) => {
          const d = schedule[day];
          return (
            <div
              key={day}
              className={`rounded-lg border p-4 transition-colors ${
                d.open
                  ? "border-[#2a2a2a] bg-[#111111]"
                  : "border-[#1e1e1e] bg-[#0d0d0d]"
              }`}
            >
              {/* Row header */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={d.open}
                  onClick={() => updateDay(day, { open: !d.open })}
                  className={`relative w-10 h-[22px] rounded-full transition-colors shrink-0 ${
                    d.open ? "bg-[#ffd600]" : "bg-[#2a2a2a]"
                  }`}
                  aria-label={`${DAY_LABELS[day]}: ${d.open ? "aberta" : "fechada"}`}
                >
                  <span
                    className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      d.open ? "translate-x-[22px]" : "translate-x-[3px]"
                    }`}
                  />
                </button>

                <span
                  className={`text-sm font-medium min-w-[120px] ${
                    d.open ? "text-white" : "text-[#6b7280]"
                  }`}
                >
                  {DAY_LABELS[day]}
                </span>

                {!d.open && (
                  <span className="text-xs text-[#4b5563] ml-auto">Fechada</span>
                )}
              </div>

              {/* Time fields (shown only when open) */}
              {d.open && (
                <div className="mt-3 pl-[52px] space-y-3">
                  {/* Open / Close times */}
                  <div className="flex flex-wrap items-end gap-3">
                    <div>
                      <label className="block text-xs text-[#6b7280] mb-1">
                        Abertura
                      </label>
                      <input
                        type="time"
                        value={d.openTime}
                        onChange={(e) =>
                          updateDay(day, { openTime: e.target.value })
                        }
                        className={timeInputClass}
                      />
                    </div>
                    <span className="text-[#4b5563] text-sm mb-1.5">até</span>
                    <div>
                      <label className="block text-xs text-[#6b7280] mb-1">
                        Fechamento
                      </label>
                      <input
                        type="time"
                        value={d.closeTime}
                        onChange={(e) =>
                          updateDay(day, { closeTime: e.target.value })
                        }
                        className={timeInputClass}
                      />
                    </div>
                  </div>

                  {/* Lunch interval */}
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={d.hasLunch}
                        onChange={(e) =>
                          updateDay(day, { hasLunch: e.target.checked })
                        }
                        className="w-4 h-4 accent-[#ffd600] cursor-pointer"
                      />
                      <span className="text-xs text-[#d1d5db]">
                        Intervalo para almoço
                      </span>
                    </label>
                    {d.hasLunch && (
                      <>
                        <input
                          type="time"
                          value={d.lunchStart}
                          onChange={(e) =>
                            updateDay(day, { lunchStart: e.target.value })
                          }
                          className={timeInputClass}
                          aria-label="Início do almoço"
                        />
                        <span className="text-[#4b5563] text-sm">até</span>
                        <input
                          type="time"
                          value={d.lunchEnd}
                          onChange={(e) =>
                            updateDay(day, { lunchEnd: e.target.value })
                          }
                          className={timeInputClass}
                          aria-label="Fim do almoço"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
