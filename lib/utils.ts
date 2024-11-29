import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { Period } from "./types";
import { format, subDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (fullName: string) => {
  return fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

export const onCopy = (id: string) => {
  navigator.clipboard.writeText(id);
  toast.success("Copied to clipboard");
};

export const formatPrice = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

export const formatDateRange = ({ period }: { period: Period }) => {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(
      defaultTo,
      "LLL dd y"
    )}`;
  }
  if (period.to) {
    return `${format(period.from, "LLL dd")} - ${format(
      period.to,
      "LLL dd y"
    )}`;
  }

  return format(period.from, "LLL dd y");
};

export const fillMissingMonths = (data: Record<string, number>) => {
  const months = [
    "2024-01",
    "2024-02",
    "2024-03",
    "2024-04",
    "2024-05",
    "2024-06",
    "2024-07",
    "2024-08",
    "2024-09",
    "2024-10",
    "2024-11",
    "2024-12",
  ];

  return months.map((month) => ({
    month,
    value: data[month] || 0,
  }));
};
