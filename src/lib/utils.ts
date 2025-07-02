import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOtp(length: number) {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((n) => (n % 10).toString())
    .join("");
}

const emailSchema = z.string().email();

export const validateEmails = async (members: string[]) => {
  const results = await Promise.all(
    members.map(async (m) => {
      const result = await emailSchema.safeParseAsync(m);
      return result.success ? m : null;
    }),
  );

  return results.filter((m): m is string => m !== null);
};
