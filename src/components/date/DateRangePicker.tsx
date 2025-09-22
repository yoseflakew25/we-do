"use client";
import * as React from "react";
import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

export default function DatePickerWithRange({
  onDateRangeChange,
  className,
}: {
  onDateRangeChange: (_startDate: Date, _endDate: Date) => void;
  className?: string;
}) {
  const [date, setDate] = React.useState<DateRange>({
    from: subDays(new Date(), 20),
    to: new Date(),
  });

  const handleSelect: SelectRangeEventHandler = (range: any) => {
    if (range && range.from && range.to) {
      setDate(range);
      onDateRangeChange(range.from, range.to); // 💡 call the consumer callback here
    } else if (range && range.from) {
      setDate((date) => {
        const updated = { ...date, from: range.from };
        return updated;
      });
    } else if (range && range.to) {
      setDate((date) => {
        const updated = { ...date, to: range.to };
        return updated;
      });
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "bg-transparent max-h-20 rounded border border-outlineVariant text-[11px] font-poppins font-semibold hover:bg-surfContainerHigh",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-1.5 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            weekStartsOn={1}
            captionLayout="dropdown-buttons"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}