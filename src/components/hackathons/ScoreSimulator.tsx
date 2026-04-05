"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import type { HackathonDetail } from "@/lib/types";

interface ScoreSimulatorProps {
  detail: HackathonDetail;
  leaderboardEntries?: { score: number }[];
}

export function ScoreSimulator({ detail, leaderboardEntries = [] }: ScoreSimulatorProps) {
  const criteria = detail.sections.eval.evalCriteria ?? [];
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(criteria.map((c) => [c.category, 0]))
  );

  const totalMax = criteria.reduce((sum, c) => sum + c.points, 0);
  const totalScore = Object.values(scores).reduce((sum, v) => sum + v, 0);
  const percentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  const estimatedRank =
    leaderboardEntries.filter((e) => e.score > totalScore).length + 1;

  if (criteria.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">점수 시뮬레이터</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{totalScore}점</p>
          <p className="text-xs text-muted-foreground">/ {totalMax}점 ({percentage}%)</p>
        </div>
      </div>

      <div className="space-y-4">
        {criteria.map((c) => (
          <div key={c.category} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{c.category}</span>
              <span className="text-primary font-bold">
                {scores[c.category] ?? 0} / {c.points}점
              </span>
            </div>
            <Slider
              min={0}
              max={c.points}
              step={1}
              value={[scores[c.category] ?? 0]}
              onValueChange={(v) => {
                const val = Array.isArray(v) ? v[0] : v;
                setScores((prev) => ({ ...prev, [c.category]: val as number }));
              }}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {leaderboardEntries.length > 0 && (
        <div className="pt-3 border-t border-border text-sm text-muted-foreground">
          현재 점수 기준 예상 순위:{" "}
          <span className="font-bold text-primary">{estimatedRank}위</span>
        </div>
      )}
    </div>
  );
}
