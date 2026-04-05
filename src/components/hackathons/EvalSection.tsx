import { ScoreSimulator } from "./ScoreSimulator";
import type { HackathonDetail, LeaderboardEntry } from "@/lib/types";

interface EvalSectionProps {
  detail: HackathonDetail;
  leaderboardEntries?: LeaderboardEntry[];
}

export function EvalSection({ detail, leaderboardEntries = [] }: EvalSectionProps) {
  const { eval: evalData } = detail.sections;

  return (
    <section id="eval" className="scroll-mt-24 space-y-6">
      <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight">평가</h2>

      {/* Description */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-2">평가 방식</h3>
        <p className="text-sm text-muted-foreground">{evalData.description}</p>

        {evalData.limits && (
          <div className="mt-4 flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">최대 실행 시간</span>{" "}
              <span className="font-semibold">{evalData.limits.maxRuntimeSec}초</span>
            </div>
            <div>
              <span className="text-muted-foreground">일일 제출 한도</span>{" "}
              <span className="font-semibold">{evalData.limits.maxSubmissionsPerDay}회</span>
            </div>
          </div>
        )}
      </div>

      {/* Score breakdown */}
      {evalData.scoreDisplay && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">{evalData.scoreDisplay.label}</h3>
          <div className="space-y-3">
            {evalData.scoreDisplay.breakdown.map((b) => (
              <div key={b.key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{b.label}</span>
                  <span className="font-semibold">{b.weightPercent}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${b.key === "participant" ? "bg-blue-500" : "bg-indigo-700"}`}
                    style={{ width: `${b.weightPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Eval criteria table */}
      {evalData.evalCriteria && evalData.evalCriteria.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">항목</th>
                <th className="text-center px-5 py-3 font-semibold w-20">배점</th>
                <th className="text-left px-5 py-3 font-semibold">평가 포인트</th>
              </tr>
            </thead>
            <tbody>
              {evalData.evalCriteria.map((c, i) => (
                <tr key={c.category} className={i % 2 === 0 ? "" : "bg-muted/30"}>
                  <td className="px-5 py-3 font-medium">{c.category}</td>
                  <td className="px-5 py-3 text-center font-bold text-primary">{c.points}점</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Score Simulator */}
      <ScoreSimulator detail={detail} leaderboardEntries={leaderboardEntries} />
    </section>
  );
}
