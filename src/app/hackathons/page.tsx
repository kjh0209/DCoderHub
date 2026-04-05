"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { HackathonCard } from "@/components/hackathons/HackathonCard";
import { HackathonFilters } from "@/components/hackathons/HackathonFilters";
import { EmptyState } from "@/components/common/EmptyState";
import { computeHackathonStatus } from "@/lib/utils";

type StatusFilter = "all" | "ongoing" | "upcoming" | "ended";

export default function HackathonsPage() {
  const hackathons = useStore((s) => s.hackathons);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const allTags = Array.from(new Set(hackathons.flatMap((h) => h.tags)));

  const handleTagToggle = (tag: string) => {
    setTagFilter((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = hackathons.filter((h) => {
    if (statusFilter !== "all" && computeHackathonStatus(h) !== statusFilter) return false;
    if (tagFilter.length > 0 && !tagFilter.some((t) => h.tags.includes(t))) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-1 tracking-tight">해커톤</h1>
        <p className="text-sm text-muted-foreground">진행 중인 해커톤에 참가하고 실력을 증명하세요.</p>
      </div>

      <div className="mb-8">
        <HackathonFilters
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          tagFilter={tagFilter}
          onTagToggle={handleTagToggle}
          availableTags={allTags}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="해당 조건의 해커톤이 없습니다"
          description="필터를 변경하거나 전체 목록을 확인해보세요."
          action={{ label: "전체 보기", onClick: () => { setStatusFilter("all"); setTagFilter([]); } }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hackathon, i) => (
            <HackathonCard key={hackathon.slug} hackathon={hackathon} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
