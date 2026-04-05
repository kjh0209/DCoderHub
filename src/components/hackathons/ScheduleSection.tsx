"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import { formatDateTime, getMilestoneStatus } from "@/lib/utils";
import type { HackathonDetail } from "@/lib/types";

const TAG_COLORS: Record<string, string> = {
  접수: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  제출: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  평가: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  기타: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

interface ScheduleSectionProps {
  detail: HackathonDetail;
}

export function ScheduleSection({ detail }: ScheduleSectionProps) {
  const { milestones } = detail.sections.schedule;
  const nextMilestone = milestones.find((m) => getMilestoneStatus(m.at) !== "past");

  return (
    <section id="schedule" className="scroll-mt-24 space-y-6">
      <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight">일정</h2>

      {nextMilestone && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium">다음 마감까지</span>
          <CountdownTimer targetDate={nextMilestone.at} />
          <span className="text-xs text-muted-foreground">— {nextMilestone.name}</span>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
        <div className="space-y-6">
          {milestones.map((milestone, i) => {
            const status = getMilestoneStatus(milestone.at);
            return (
              <div key={i} className="relative flex items-start gap-4 pl-12">
                {/* Node */}
                <div className="absolute left-0 flex items-center justify-center w-10 h-10">
                  {status === "past" ? (
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  ) : status === "current" ? (
                    <div className="relative">
                      <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-primary opacity-40" />
                      <Circle className="relative h-5 w-5 text-primary fill-primary" />
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 text-border" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 bg-card border border-border rounded-xl p-4 ${status === "past" ? "opacity-60" : ""}`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`font-semibold text-sm ${status === "current" ? "text-primary" : ""}`}
                    >
                      {milestone.name}
                    </span>
                    {milestone.tag && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_COLORS[milestone.tag] ?? TAG_COLORS["기타"]}`}
                      >
                        {milestone.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {formatDateTime(milestone.at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
