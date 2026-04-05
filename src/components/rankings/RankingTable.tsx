import { Trophy, Medal, Award } from "lucide-react";
import type { RankingEntry } from "@/lib/types";

const TOP3_ICONS = [
  <Trophy key="1" className="h-4 w-4 text-yellow-500" />,
  <Medal key="2" className="h-4 w-4 text-slate-400" />,
  <Award key="3" className="h-4 w-4 text-amber-600" />,
];

interface RankingTableProps {
  entries: RankingEntry[];
}

export function RankingTable({ entries }: RankingTableProps) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/60 border-b border-border">
            <th className="text-left px-5 py-3.5 font-semibold w-16 text-xs uppercase tracking-wide text-muted-foreground">순위</th>
            <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">닉네임</th>
            <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">포인트</th>
            <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground hidden sm:table-cell">참여</th>
            <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground hidden md:table-cell">1위</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const isTop3 = entry.rank <= 3;
            return (
              <tr
                key={entry.rank}
                className={`border-t border-border/60 transition-colors hover:bg-muted/30 ${isTop3 ? "font-semibold" : ""}`}
              >
                <td className="px-5 py-3.5">
                  {isTop3 ? (
                    <div className="flex items-center justify-center w-7 h-7">
                      {TOP3_ICONS[entry.rank - 1]}
                    </div>
                  ) : (
                    <span className="text-muted-foreground font-mono text-xs">#{entry.rank}</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span className={isTop3 ? "text-foreground" : "text-foreground/80"}>
                    {entry.nickname}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="font-bold text-primary tabular-nums">
                    {entry.points.toLocaleString()}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right text-muted-foreground hidden sm:table-cell tabular-nums">
                  {entry.hackathonCount}회
                </td>
                <td className="px-5 py-3.5 text-right hidden md:table-cell">
                  {entry.firstPlaceCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-yellow-500 font-semibold">
                      <Trophy className="h-3 w-3" />
                      {entry.firstPlaceCount}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
