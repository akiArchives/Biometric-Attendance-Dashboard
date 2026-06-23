"use client";

import { useRouter } from "next/navigation";

interface DatePickerProps {
  selected: string;
}

export function DatePicker({ selected }: DatePickerProps) {
  const router = useRouter();

  return (
    <input
      type="date"
      value={selected}
      max={new Date().toISOString().split("T")[0]}
      onChange={(e) => {
        if (e.target.value) {
          router.push(`?date=${e.target.value}`);
        }
      }}
      className="h- rounded-md border border-input bg-sidebar-accent px-3 py-1 text-sm text-white font-bold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&::-webkit-calendar-picker-indicator]:invert"
    />
  );
}
