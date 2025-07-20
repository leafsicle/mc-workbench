import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DateTime } from "luxon"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isThisToday(date) {
  return (
    DateTime.fromISO(date).toLocaleString(DateTime.DATE_SHORT) ===
    DateTime.now().toLocaleString(DateTime.DATE_SHORT)
  )
}
