"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "ongoing" | "upcoming" | "ended";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "ongoing", label: "진행중" },
  { value: "upcoming", label: "예정" },
  { value: "ended", label: "종료" },
];

interface HackathonFiltersProps {
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  tagFilter: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
}

export function HackathonFilters({
  statusFilter,
  onStatusChange,
  tagFilter,
  onTagToggle,
  availableTags,
}: HackathonFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange(opt.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer",
              statusFilter === opt.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={tagFilter.includes(tag) ? "default" : "outline"}
              className="cursor-pointer select-none transition-all"
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
