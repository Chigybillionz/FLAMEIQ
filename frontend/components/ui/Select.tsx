"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",
}: {
  value: string | null;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-white px-3.5 py-2.5 text-left text-sm outline-none focus:border-brand-500"
      >
        <span className={value ? "text-ink-500" : "text-muted-400"}>
          {value ?? placeholder}
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-muted-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-20 mt-1 max-h-56 overflow-auto rounded-lg border border-border bg-white p-1 shadow-lg">
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`block w-full rounded-md border-l-2 px-3 py-2 text-left text-sm transition-colors ${
                  isSelected
                    ? "border-brand-500 font-semibold text-ink-500"
                    : "border-transparent text-muted-500 hover:border-brand-200 hover:bg-muted-50 hover:text-ink-500"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
