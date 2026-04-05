"use client";

import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
}

export function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return <span className="text-muted-foreground text-sm">종료됨</span>;
  }

  return (
    <div className="flex items-center gap-1 text-sm font-mono">
      {label && <span className="text-muted-foreground mr-1">{label}</span>}
      {days > 0 && (
        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
          {days}일
        </span>
      )}
      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
        {String(hours).padStart(2, "0")}
      </span>
      <span className="text-muted-foreground">:</span>
      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
        {String(minutes).padStart(2, "0")}
      </span>
      <span className="text-muted-foreground">:</span>
      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
        {String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
