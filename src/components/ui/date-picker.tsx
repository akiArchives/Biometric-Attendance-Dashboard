"use client";

import * as React from "react";
import { format } from "date-fns";
import { IconCalendarFilled } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  selected: string; // "YYYY-MM-DD"
  label?: string; // Optional label to override the default "PPP" format
}

export function DatePicker({ selected, label }: DatePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse YYYY-MM-DD safely into local timezone Date
  const date = React.useMemo(() => {
    if (!selected) return new Date();
    const [year, month, day] = selected.split("-").map(Number);
    return new Date(year, month - 1, day);
  }, [selected]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      const params = new URLSearchParams(searchParams.toString());
      params.set("date", dateString);
      router.push("?" + params.toString());
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"default"}
          className={cn(
            "w-8 md:w-auto justify-center md:justify-start text-left font-medium bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground px-0 md:px-2.5",
            !selected && "text-muted-foreground",
          )}
        >
          <IconCalendarFilled className="h-4 w-4 text-primary-foreground" />
          <span className="hidden md:inline">
            {label ? (
              label
            ) : date ? (
              format(date, "PPP")
            ) : (
              "Pick a date"
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
        />
      </PopoverContent>
    </Popover>
  );
}
