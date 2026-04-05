"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, Users, BarChart3, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";

const CARDS = [
  {
    icon: Trophy,
    title: "해커톤 참가",
    description: "진행 중인 해커톤에 참가하고 실력을 겨뤄보세요.",
    href: "/hackathons",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    statKey: "ongoing" as const,
    statLabel: "진행 중",
  },
  {
    icon: Users,
    title: "팀원 찾기",
    description: "함께할 팀원을 모집하거나, 원하는 팀에 합류하세요.",
    href: "/camp",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    statKey: "teams" as const,
    statLabel: "모집 중",
  },
  {
    icon: BarChart3,
    title: "랭킹 확인",
    description: "글로벌 랭킹에서 나의 위치를 확인하세요.",
    href: "/rankings",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    statKey: "rankings" as const,
    statLabel: "명 참여",
  },
];

export function QuickActionCards() {
  const router = useRouter();
  const hackathons = useStore((s) => s.hackathons);
  const teams = useStore((s) => s.teams);
  const rankings = useStore((s) => s.rankings);

  const statValues: Record<string, string> = {
    ongoing: `${hackathons.filter((h) => h.status === "ongoing").length}개`,
    teams: `${teams.filter((t) => t.isOpen).length}팀`,
    rankings: `${rankings.length}명`,
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight mb-1">
            빠른 탐색
          </h2>
          <p className="text-sm text-muted-foreground">
            원하는 기능으로 바로 이동하세요.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <button
                  onClick={() => router.push(card.href)}
                  className={`w-full text-left bg-card border ${card.border} rounded-2xl p-6 cursor-pointer group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>

                  {/* Text */}
                  <h3 className="font-[family-name:var(--font-heading)] font-semibold text-base mb-1.5 group-hover:text-primary transition-colors duration-150">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {card.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${card.color} ${card.bg} px-2.5 py-1 rounded-full`}>
                      {statValues[card.statKey]} {card.statLabel !== "명 참여" ? card.statLabel : ""}
                    </span>
                    <ArrowRight className={`h-4 w-4 ${card.color} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150`} />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
