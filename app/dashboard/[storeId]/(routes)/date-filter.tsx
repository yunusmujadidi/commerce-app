"use client";

import { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import qs from "query-string";
import { ChevronDown } from "lucide-react";

import { formatDateRange } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);

  const pushToUrl = (dateRange: DateRange | undefined) => {
    const query = {
      from: format(dateRange?.from || defaultFrom, "yyy-MM-dd"),
      to: format(dateRange?.to || defaultFrom, "yyy-MM-dd"),
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };
  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Popover>
        <PopoverTrigger asChild>
          <Button disabled={false} size="sm" variant="outline">
            <span>
              {formatDateRange({
                period: { from: paramState.from, to: paramState.to },
              })}
            </span>
            <ChevronDown className="ml-2 size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="lg:w-auto w-full p-0" align="start">
          <Calendar
            disabled={false}
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="p-4 w-full flex items-center gap-x-2">
            <PopoverClose asChild>
              <Button onClick={onReset} className="w-full" variant="outline">
                Reset
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button onClick={() => pushToUrl(date)} className="w-full">
                Apply
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </Suspense>
  );
};
