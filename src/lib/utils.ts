import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Hackathon } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKRW(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", options ?? { year: "numeric", month: "2-digit", day: "2-digit" });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
}

export function formatScore(score: number, decimals = 4): string {
  return score.toFixed(decimals);
}

export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Dynamically compute hackathon status based on the final evaluation date (endAt).
 * This replaces the hardcoded `hackathon.status` field for display purposes.
 * - "ended"   → endAt is in the past
 * - "upcoming"→ endAt is in the future AND stored status is "upcoming"
 * - "ongoing" → endAt is in the future AND not "upcoming"
 */
export function computeHackathonStatus(
  hackathon: Pick<Hackathon, "period" | "status">
): "ongoing" | "ended" | "upcoming" {
  const endAt = new Date(hackathon.period.endAt).getTime();
  if (endAt < Date.now()) return "ended";
  if (hackathon.status === "upcoming") return "upcoming";
  return "ongoing";
}

export function getMilestoneStatus(at: string): "past" | "current" | "future" {
  const now = Date.now();
  const time = new Date(at).getTime();
  const diff = time - now;
  if (diff < 0) return "past";
  if (diff < 1000 * 60 * 60 * 24) return "current";
  return "future";
}
