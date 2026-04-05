"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LeaderboardCharts } from "./LeaderboardCharts";
import { EmptyState } from "@/components/common/EmptyState";
import { ExternalLink, ChevronDown, ChevronUp, Trophy, Medal, Award, FileText, AlertCircle } from "lucide-react";
import { formatDateTime, formatScore } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import type { HackathonDetail, LeaderboardData } from "@/lib/types";

interface LeaderboardSectionProps {
  detail: HackathonDetail;
  leaderboardData?: LeaderboardData;
}

const RANK_ICONS = [
  <Trophy key="1" className="h-4 w-4 text-yellow-500" />,
  <Medal key="2" className="h-4 w-4 text-slate-400" />,
  <Award key="3" className="h-4 w-4 text-amber-600" />,
];

export function LeaderboardSection({ detail, leaderboardData }: LeaderboardSectionProps) {
  const [expandedRank, setExpandedRank] = useState<number | null>(null);
  const allTeams = useStore((s) => s.teams);
  const teams = allTeams.filter((t) => t.hackathonSlug === detail.slug);
  const entries = leaderboardData?.entries ?? [];
  const hasScores = entries.length > 0;
  const hasBreakdown = entries.some((e) => e.scoreBreakdown);

  // Teams that are in the teams list but NOT in the leaderboard (미제출)
  const submittedTeamNames = new Set(entries.map((e) => e.teamName));
  const unsubmittedTeams = teams.filter((t) => !submittedTeamNames.has(t.name));

  return (
    <section id="leaderboard" className="scroll-mt-24 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight">리더보드</h2>
        {leaderboardData && (
          <span className="text-xs text-muted-foreground">
            업데이트: {formatDateTime(leaderboardData.updatedAt)}
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{detail.sections.leaderboard.note}</p>

      {!hasScores ? (
        <EmptyState title="아직 결과가 없습니다" description="제출 마감 후 리더보드가 공개됩니다." />
      ) : (
        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">테이블</TabsTrigger>
            <TabsTrigger value="chart">차트</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold w-14">순위</th>
                    <th className="text-left px-4 py-3 font-semibold">팀명</th>
                    <th className="text-right px-4 py-3 font-semibold">점수</th>
                    <th className="text-right px-4 py-3 font-semibold hidden sm:table-cell">제출 시각</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <>
                      <tr
                        key={entry.rank}
                        className={`border-t border-border ${hasBreakdown ? "cursor-pointer hover:bg-muted/30" : ""}`}
                        onClick={() =>
                          hasBreakdown && setExpandedRank(expandedRank === entry.rank ? null : entry.rank)
                        }
                      >
                        <td className="px-4 py-3 font-bold">
                          {entry.rank <= 3 ? (
                            <div className="flex items-center">{RANK_ICONS[entry.rank - 1]}</div>
                          ) : (
                            <span className="text-muted-foreground font-mono text-xs">#{entry.rank}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{entry.teamName}</span>
                            {entry.artifacts?.webUrl && (
                              <a
                                href={entry.artifacts.webUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-primary hover:underline flex items-center gap-0.5 text-xs"
                              >
                                <ExternalLink className="h-3 w-3" />
                                사이트 보기
                              </a>
                            )}
                            {entry.artifacts?.pdfUrl && (
                              <a
                                href={entry.artifacts.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-foreground flex items-center gap-0.5 text-xs"
                              >
                                <FileText className="h-3 w-3" />
                                {entry.artifacts.planTitle ?? "계획서 보기"}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-primary">
                          {formatScore(entry.score, entry.score > 1 ? 1 : 4)}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell text-xs">
                          {formatDateTime(entry.submittedAt)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {hasBreakdown &&
                            (expandedRank === entry.rank ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ))}
                        </td>
                      </tr>
                      {expandedRank === entry.rank && entry.scoreBreakdown && (
                        <tr key={`${entry.rank}-detail`} className="bg-muted/20 border-t border-border">
                          <td colSpan={5} className="px-8 py-3">
                            <div className="flex gap-6 text-xs">
                              <div>
                                <span className="text-muted-foreground">참가자 점수 (30%)</span>{" "}
                                <span className="font-bold text-blue-500">{entry.scoreBreakdown.participant}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">심사위원 점수 (70%)</span>{" "}
                                <span className="font-bold text-indigo-600">{entry.scoreBreakdown.judge}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}

                  {/* 미제출 팀 */}
                  {unsubmittedTeams.map((team) => (
                    <tr key={`unsubmitted-${team.teamCode}`} className="border-t border-border opacity-50">
                      <td className="px-4 py-3">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{team.name}</span>
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                            미제출
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground text-xs">—</td>
                      <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell text-xs">—</td>
                      <td className="px-4 py-3" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="mt-4">
            <LeaderboardCharts entries={entries} />
          </TabsContent>
        </Tabs>
      )}
    </section>
  );
}
