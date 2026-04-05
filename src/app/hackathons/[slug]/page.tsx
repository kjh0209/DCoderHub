"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { SideNav } from "@/components/hackathons/SideNav";
import { OverviewSection } from "@/components/hackathons/OverviewSection";
import { EvalSection } from "@/components/hackathons/EvalSection";
import { ScheduleSection } from "@/components/hackathons/ScheduleSection";
import { PrizeSection } from "@/components/hackathons/PrizeSection";
import { TeamsSection } from "@/components/hackathons/TeamsSection";
import { SubmitSection } from "@/components/hackathons/SubmitSection";
import { LeaderboardSection } from "@/components/hackathons/LeaderboardSection";
import { ChatAssistant } from "@/components/ai/ChatAssistant";
import { ErrorFallback } from "@/components/common/ErrorFallback";

export default function HackathonDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const hackathons = useStore((s) => s.hackathons);
  const getHackathonDetail = useStore((s) => s.getHackathonDetail);
  const getLeaderboard = useStore((s) => s.getLeaderboard);

  const hackathon = hackathons.find((h) => h.slug === slug);
  const detail = getHackathonDetail(slug);
  const leaderboardData = getLeaderboard(slug);

  if (!detail || !hackathon) {
    return (
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <ErrorFallback
          title="해커톤을 찾을 수 없습니다"
          description={`"${slug}" 해커톤이 존재하지 않거나 준비 중입니다.`}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold mb-8 leading-tight tracking-tight">{detail.title}</h1>

      <div className="flex gap-8">
        {/* SideNav (desktop) */}
        <aside className="hidden lg:block w-44 flex-shrink-0">
          <div className="sticky top-24">
            <SideNav />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-16">
          <OverviewSection detail={detail} hackathon={hackathon} />
          <EvalSection detail={detail} leaderboardEntries={leaderboardData?.entries} />
          <ScheduleSection detail={detail} />
          <PrizeSection detail={detail} />
          <TeamsSection detail={detail} />
          <SubmitSection detail={detail} hackathon={hackathon} />
          <LeaderboardSection detail={detail} leaderboardData={leaderboardData} />
        </div>
      </div>

      {/* Floating AI Chat */}
      <ChatAssistant hackathonDetail={detail} />
    </div>
  );
}
