import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";
import Link from "next/link";

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

export function parseMentionsAndHabits(text: string, habitId?: number) {
  const habitRegex = /«([^»]+)»/g;
  const usernameRegex = /(@\w+)/g;

  let parts = text.split(/(@\w+|«[^»]+»)/g);
  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <Link
          key={index}
          href={`/user/${part.slice(1)}`}
          className="text-blue-500 underline"
        >
          {part}
        </Link>
      );
    }
    if (part.startsWith("«") && part.endsWith("»")) {
      return (
        <Link
          key={index}
          href={`/habit/${habitId ?? "unknown"}`}
          className="text-green-600 underline"
        >
          {part}
        </Link>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
