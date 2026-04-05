"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Trophy, Users, Clock, CheckCircle2, LogIn } from "lucide-react";
import { formatDate, formatKRW, computeHackathonStatus } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { toast } from "sonner";
import type { HackathonDetail, Hackathon } from "@/lib/types";

interface OverviewSectionProps {
  detail: HackathonDetail;
  hackathon: Hackathon;
}

export function OverviewSection({ detail, hackathon }: OverviewSectionProps) {
  const { overview, info, prize, schedule } = detail.sections;
  const totalPrize = prize.totalKRW ?? prize.items.reduce((sum, i) => sum + i.amountKRW, 0);
  const [authOpen, setAuthOpen] = useState(false);

  const currentUser = useStore((s) => s.currentUser);
  const participations = useStore((s) => s.participations);
  const joinHackathon = useStore((s) => s.joinHackathon);

  const isParticipating = !!currentUser && participations.some(
    (p) => p.userId === currentUser.id && p.hackathonSlug === detail.slug
  );

  const hackathonStatus = computeHackathonStatus(hackathon);
  const startAt = schedule.milestones[0]?.at;
  const endAt = hackathon.period.endAt;

  const stats = [
    { icon: Trophy, label: "총 상금", value: formatKRW(totalPrize) },
    { icon: Calendar, label: "최종 마감", value: formatDate(endAt) },
    { icon: Clock, label: "제출 마감", value: formatDate(hackathon.period.submissionDeadlineAt) },
    {
      icon: Users,
      label: "팀 구성",
      value: `최대 ${overview.teamPolicy.maxTeamSize}인 · ${overview.teamPolicy.allowSolo ? "개인 가능" : "팀 필수"}`,
    },
  ];

  const handleJoin = () => {
    if (!currentUser) {
      setAuthOpen(true);
      return;
    }
    joinHackathon(detail.slug);
    toast.success("참가 신청이 완료되었습니다!", {
      description: "이제 팀을 만들거나 제출물을 제출할 수 있습니다.",
    });
  };

  return (
    <section id="overview" className="scroll-mt-24 space-y-6">
      <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight">개요</h2>

      {/* Participation Banner */}
      <div className={`rounded-xl border p-4 flex items-center justify-between gap-4 ${
        isParticipating
          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
          : "bg-primary/5 border-primary/20"
      }`}>
        <div className="flex items-center gap-3">
          {isParticipating ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          ) : (
            <Trophy className="h-5 w-5 text-primary shrink-0" />
          )}
          <div>
            <p className={`text-sm font-semibold ${isParticipating ? "text-green-700 dark:text-green-400" : "text-foreground"}`}>
              {isParticipating ? "참가 신청 완료" : "이 해커톤에 참가하시겠어요?"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isParticipating
                ? "팀 만들기, 제출 기능을 사용할 수 있습니다."
                : "참가 신청 후 팀을 만들거나 제출물을 제출할 수 있습니다."}
            </p>
          </div>
        </div>
        {!isParticipating && hackathonStatus !== "ended" && (
          <Button size="sm" onClick={handleJoin} className="cursor-pointer shrink-0 gap-1.5">
            {!currentUser && <LogIn className="h-3.5 w-3.5" />}
            참가 신청
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-semibold mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-3">대회 소개</h3>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {overview.summary}
        </p>
      </div>

      {/* Notices */}
      {info.notice.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">주의사항</h3>
          {info.notice.map((notice, i) => (
            <Alert key={i}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{notice}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          joinHackathon(detail.slug);
          toast.success("참가 신청이 완료되었습니다!");
        }}
      />
    </section>
  );
}
