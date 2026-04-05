"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import type { LeaderboardEntry } from "@/lib/types";

interface LeaderboardChartsProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardCharts({ entries }: LeaderboardChartsProps) {
  const hasBreakdown = entries.some((e) => e.scoreBreakdown);

  // Bar chart data
  const barData = entries.slice(0, 10).map((e) => ({
    name: e.teamName.length > 10 ? e.teamName.slice(0, 10) + "…" : e.teamName,
    점수: e.score,
    참가자: e.scoreBreakdown?.participant ?? 0,
    심사위원: e.scoreBreakdown?.judge ?? 0,
  }));

  // Radar chart data (top 3)
  const radarCategories = ["점수", "참가자", "심사위원"];
  const top3 = entries.slice(0, 3);
  const radarData = radarCategories.map((cat) => {
    const row: Record<string, string | number> = { subject: cat };
    top3.forEach((e) => {
      if (cat === "점수") row[e.teamName] = e.score;
      else if (cat === "참가자") row[e.teamName] = e.scoreBreakdown?.participant ?? 0;
      else row[e.teamName] = e.scoreBreakdown?.judge ?? 0;
    });
    return row;
  });

  const COLORS = ["#3B82F6", "#8B5CF6", "#10B981"];

  return (
    <div className="space-y-8">
      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="font-semibold mb-4 text-sm">팀별 점수</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            {hasBreakdown ? (
              <>
                <Bar dataKey="참가자" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="심사위원" stackId="a" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                <Legend />
              </>
            ) : (
              <Bar dataKey="점수" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Radar Chart (top 3, breakdown only) */}
      {hasBreakdown && top3.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="font-semibold mb-4 text-sm">Top 3 비교</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              {top3.map((e, i) => (
                <Radar
                  key={e.teamName}
                  name={e.teamName}
                  dataKey={e.teamName}
                  stroke={COLORS[i]}
                  fill={COLORS[i]}
                  fillOpacity={0.2}
                />
              ))}
              <Legend />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
