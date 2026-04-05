import { formatKRW } from "@/lib/utils";
import { Trophy, Medal, Award } from "lucide-react";
import type { HackathonDetail } from "@/lib/types";

const RANK_STYLES = [
  {
    icon: Trophy,
    iconClass: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-400/30 dark:border-yellow-600/30",
    label: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  {
    icon: Medal,
    iconClass: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-300/40 dark:border-slate-600/30",
    label: "bg-slate-400/10 text-slate-500 dark:text-slate-400",
  },
  {
    icon: Award,
    iconClass: "text-amber-600",
    bg: "bg-amber-600/10",
    border: "border-amber-400/30 dark:border-amber-700/30",
    label: "bg-amber-600/10 text-amber-700 dark:text-amber-500",
  },
];

interface PrizeSectionProps {
  detail: HackathonDetail;
}

export function PrizeSection({ detail }: PrizeSectionProps) {
  const { prize } = detail.sections;
  const totalKRW = prize.totalKRW ?? prize.items.reduce((s, i) => s + i.amountKRW, 0);

  return (
    <section id="prize" className="scroll-mt-24 space-y-6">
      <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight">상금</h2>

      {/* Total prize banner */}
      <div className="bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 rounded-2xl px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">총 상금</p>
          <p className="text-3xl font-[family-name:var(--font-heading)] font-bold text-primary">
            {formatKRW(totalKRW)}
          </p>
        </div>
        <Trophy className="h-12 w-12 text-primary/20" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {prize.items.map((item, i) => {
          const style = RANK_STYLES[i] ?? RANK_STYLES[2];
          const Icon = style.icon;
          return (
            <div
              key={item.place}
              className={`bg-card border ${style.border} rounded-2xl p-6 text-center flex flex-col items-center gap-3`}
            >
              <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${style.iconClass}`} />
              </div>
              <p className="font-semibold text-sm">{item.place}</p>
              <p className="text-2xl font-[family-name:var(--font-heading)] font-bold text-primary">
                {formatKRW(item.amountKRW)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
