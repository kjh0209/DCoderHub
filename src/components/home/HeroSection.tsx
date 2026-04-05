"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Users, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useStore } from "@/store/useStore";

export function HeroSection() {
  const router = useRouter();
  const hackathons = useStore((s) => s.hackathons);
  const ongoingHackathon = hackathons.find((h) => h.status === "ongoing");
  const upcomingHackathon = hackathons.find((h) => h.status === "upcoming");
  const featured = ongoingHackathon ?? upcomingHackathon;

  const stats = [
    { label: "진행 중 해커톤", value: hackathons.filter((h) => h.status === "ongoing").length.toString() },
    { label: "예정 해커톤", value: hackathons.filter((h) => h.status === "upcoming").length.toString() },
    { label: "총 해커톤", value: hackathons.length.toString() },
  ];

  return (
    <section className="relative overflow-hidden py-20 md:py-28 px-4 gradient-mesh">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto max-w-7xl relative">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            개발자 커뮤니티 해커톤 플랫폼
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-5"
          >
            코드로 증명하고,
            <br />
            <span className="text-gradient">함께 성장하라.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed"
          >
            해커톤 정보, 팀빌딩, 리더보드를 한 곳에서.
            <br />
            지금 참가하고 글로벌 랭킹에 이름을 올려보세요.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            <Button
              onClick={() => router.push("/hackathons")}
              size="lg"
              className="gap-2 font-semibold cursor-pointer"
            >
              해커톤 참가하기
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => router.push("/camp")}
              variant="outline"
              size="lg"
              className="gap-2 cursor-pointer"
            >
              <Users className="h-4 w-4" />
              팀원 찾기
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-6 mb-8"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-[family-name:var(--font-heading)] font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Featured hackathon card */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="max-w-lg"
          >
            <div
              className="glass rounded-2xl p-5 cursor-pointer group hover:shadow-xl hover:shadow-primary/10 transition-all duration-200"
              onClick={() => router.push(`/hackathons/${featured.slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && router.push(`/hackathons/${featured.slug}`)}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      {ongoingHackathon ? "진행 중" : "예정"}
                    </p>
                  </div>
                </div>
                <StatusBadge status={featured.status} />
              </div>

              <p className="font-semibold text-sm leading-snug mb-3 line-clamp-2">
                {featured.title}
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <span>제출 마감까지</span>
                <CountdownTimer targetDate={featured.period.submissionDeadlineAt} />
              </div>

              <div className="flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                자세히 보기
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
