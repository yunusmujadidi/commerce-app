import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
