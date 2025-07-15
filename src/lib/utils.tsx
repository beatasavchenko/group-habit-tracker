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

function hexToRgb(hex: string): [number, number, number] {
  const num = parseInt(hex.replace("#", ""), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function interpolateColors(to: string, factor: number): string {
  const [r1, g1, b1] = hexToRgb("#f0f0f0");
  const [r2, g2, b2] = hexToRgb(to);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return rgbToHex(r, g, b);
}

export function getHabitColorIntensity({
  value,
  goal,
  color,
}: {
  value: number;
  goal: number;
  color: string;
}) {
  if (value <= 0) return "#f0f0f0";
  const progress = Math.min(Math.max(value / goal, 0), 1);
  return interpolateColors(color, progress);
}
