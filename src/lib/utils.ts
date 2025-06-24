import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOtp(length: number) {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((n) => (n % 10).toString())
    .join("");
}