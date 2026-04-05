"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import { formatDate, computeHackathonStatus } from "@/lib/utils";
import { Calendar, ArrowRight } from "lucide-react";
import type { Hackathon } from "@/lib/types";

interface HackathonCardProps {
  hackathon: Hackathon;
  index?: number;
}

const GRADIENT_MAP: Record<string, string> = {
  "aimers-8-model-lite": "from-indigo-600 via-blue-600 to-cyan-600",
  "monthly-vibe-coding-2026-02": "from-violet-600 via-purple-600 to-fuchsia-600",
  "daker-handover-2026-03": "from-orange-500 via-rose-500 to-pink-600",
};

export function HackathonCard({ hackathon, index = 0 }: HackathonCardProps) {
  const router = useRouter();
  const gradient = GRADIENT_MAP[hackathon.slug] ?? "from-primary via-blue-600 to-indigo-700";
  const status = computeHackathonStatus(hackathon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <button
        onClick={() => router.push(`/hackathons/${hackathon.slug}`)}
        className="w-full text-left bg-card border border-border rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-200"
      >
        {/* Thumbnail */}
        <div className={`h-44 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
          {/* Subtle overlay pattern */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 70% 30%, white 0px, transparent 60%)",
            }}
          />
          <div className="absolute top-3 right-3">
            <StatusBadge status={status} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <p className="text-white font-semibold text-sm leading-snug line-clamp-2 drop-shadow-sm">
              {hackathon.title}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {hackathon.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-medium px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {hackathon.tags.length > 3 && (
              <Badge variant="outline" className="text-xs font-medium px-2 py-0.5">
                +{hackathon.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Countdown (if ongoing) */}
          {status === "ongoing" && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded-lg px-3 py-2">
              <span>최종 마감까지</span>
              <CountdownTimer targetDate={hackathon.period.endAt} />
            </div>
          )}

          {/* Period — show final evaluation date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>최종 마감 {formatDate(hackathon.period.endAt)}</span>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all duration-150">
            자세히 보기
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </button>
    </motion.div>
  );
}
