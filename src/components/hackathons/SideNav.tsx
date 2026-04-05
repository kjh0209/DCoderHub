"use client";

import { cn } from "@/lib/utils";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const SECTIONS = [
  { id: "overview", label: "개요" },
  { id: "eval", label: "평가" },
  { id: "schedule", label: "일정" },
  { id: "prize", label: "상금" },
  { id: "teams", label: "팀" },
  { id: "submit", label: "제출" },
  { id: "leaderboard", label: "리더보드" },
];

export function SideNav() {
  const activeId = useScrollSpy(SECTIONS.map((s) => s.id));

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="space-y-1">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollTo(section.id)}
          className={cn(
            "w-full text-left px-3 py-2 text-sm rounded-lg transition-all",
            activeId === section.id
              ? "border-l-2 border-primary bg-primary/5 text-primary font-bold pl-[10px]"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}
