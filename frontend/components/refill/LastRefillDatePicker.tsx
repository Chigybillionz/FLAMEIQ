"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAY_LABELS = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"];

function getMonthGrid(year: number, month: number): (Date | null)[][] {
  const firstOfMonth = new Date(year, month, 1);
  // getDay(): 0=Sun..6=Sat. Shift so the grid starts on Saturday (index 0).
  const leadingBlanks = (firstOfMonth.getDay() + 1) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(date: Date) {
  return date.toLocaleDateString("en-GB");
}

export default function LastRefillDatePicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (isoDate: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [baseMonth, setBaseMonth] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [pendingDate, setPendingDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const secondMonth = new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1, 1);

  const goPrev = () =>
    setBaseMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const goNext = () =>
    setBaseMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const handleDone = () => {
    if (pendingDate) onChange(toISODate(pendingDate));
    setIsOpen(false);
  };

  const renderMonth = (
    monthDate: Date,
    showPrevArrow: boolean,
    showNextArrow: boolean
  ) => {
    const weeks = getMonthGrid(monthDate.getFullYear(), monthDate.getMonth());
    const label = monthDate.toLocaleDateString("en-US", { month: "long" });

    return (
      <div className="flex-1">
        <div className="mb-3 flex items-center justify-between">
          {showPrevArrow ? (
            <button
              type="button"
              onClick={goPrev}
              className="rounded p-1 text-muted-500 hover:bg-muted-50"
            >
              <ChevronLeft size={16} />
            </button>
          ) : (
            <span className="w-6" />
          )}
          <span className="text-sm font-semibold text-brand-500">{label}</span>
          {showNextArrow ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded p-1 text-muted-500 hover:bg-muted-50"
            >
              <ChevronRight size={16} />
            </button>
          ) : (
            <span className="w-6" />
          )}
        </div>

        <div className="grid grid-cols-7 gap-y-1 text-center">
          {WEEKDAY_LABELS.map((label) => (
            <span
              key={label}
              className="text-[10px] font-medium text-muted-400"
            >
              {label}
            </span>
          ))}

          {weeks.flatMap((week, wi) =>
            week.map((date, di) => {
              if (!date) return <span key={`${wi}-${di}`} />;
              const isOtherMonth = date.getMonth() !== monthDate.getMonth();
              const isSelected = isSameDay(date, pendingDate);
              return (
                <button
                  key={`${wi}-${di}`}
                  type="button"
                  onClick={() => setPendingDate(date)}
                  className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors ${
                    isSelected
                      ? "bg-brand-500 font-semibold text-white"
                      : isOtherMonth
                        ? "text-muted-300"
                        : "text-ink-500 hover:bg-muted-50"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-white px-3.5 py-2.5 text-left text-sm outline-none focus:border-brand-500"
      >
        <CalendarIcon size={15} className="shrink-0 text-muted-400" />
        <span className={value ? "text-ink-500" : "text-muted-400"}>
          {value ? formatDisplay(new Date(value)) : "dd/mm/yy"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-30 mt-2 w-[340px] rounded-xl border border-border bg-white p-4 shadow-xl sm:w-[420px]">
          <div className="flex gap-4">
            {renderMonth(baseMonth, true, false)}
            {renderMonth(secondMonth, false, true)}
          </div>

          <button
            type="button"
            onClick={handleDone}
            className="mt-4 w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
