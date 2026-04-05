"use client";

import { useState } from "react";
import { RankingTable } from "@/components/rankings/RankingTable";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

type Period = "7d" | "30d" | "all";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7d", label: "최근 7일" },
  { value: "30d", label: "최근 30일" },
  { value: "all", label: "전체" },
];

const PERIOD_DAYS: Record<Period, number | null> = {
  "7d": 7,
  "30d": 30,
  "all": null,
};

export default function RankingsPage() {
  const rankings = useStore((s) => s.rankings);
  const [period, setPeriod] = useState<Period>("all");

  const days = PERIOD_DAYS[period];
  const cutoff = days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : null;

  const filtered = cutoff
    ? rankings.filter((r) => new Date(r.lastActiveAt) >= cutoff)
    : rankings;

  const sorted = [...filtered]
    .sort((a, b) => b.points - a.points)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-1 tracking-tight">글로벌 랭킹</h1>
        <p className="text-sm text-muted-foreground">해커톤 성과를 기반으로 산정된 글로벌 랭킹입니다.</p>
      </div>

      {/* Period filter */}
      <div className="flex gap-2 mb-6">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPeriod(opt.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer",
              period === opt.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
            {period === opt.value && filtered.length !== rankings.length && (
              <span className="ml-1.5 text-xs opacity-80">({sorted.length}명)</span>
            )}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">해당 기간 내 활동한 참가자가 없습니다.</p>
        </div>
      ) : (
        <RankingTable entries={sorted} />
      )}
    </div>
  );
}
