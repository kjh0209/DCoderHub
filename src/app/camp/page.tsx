"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamCard } from "@/components/camp/TeamCard";
import { TeamCreateModal } from "@/components/camp/TeamCreateModal";
import { AITeamMatch } from "@/components/camp/AITeamMatch";
import { EmptyState } from "@/components/common/EmptyState";
import { Sparkles, ShieldAlert } from "lucide-react";
import { useStore } from "@/store/useStore";
import { AuthModal } from "@/components/auth/AuthModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

function CampContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hackathons = useStore((s) => s.hackathons);
  const teams = useStore((s) => s.teams);

  const [hackathonFilter, setHackathonFilter] = useState<string>("all");
  const currentUser = useStore((s) => s.currentUser);
  const [createOpen, setCreateOpen] = useState(false);
  const [aiMatchOpen, setAiMatchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const handleCreateClick = () => {
    if (!currentUser) { setAuthOpen(true); return; }
    setPrivacyOpen(true);
  };

  useEffect(() => {
    const hackathonParam = searchParams.get("hackathon");
    if (hackathonParam) setHackathonFilter(hackathonParam);
  }, [searchParams]);

  const handleHackathonChange = (value: string | null) => {
    const v = value ?? "all";
    setHackathonFilter(v);
    if (v === "all") {
      router.push("/camp");
    } else {
      router.push(`/camp?hackathon=${v}`);
    }
  };

  const filtered = teams
    .filter((t) => hackathonFilter === "all" || t.hackathonSlug === hackathonFilter)
    .sort((a, b) => {
      if (a.isOpen && !b.isOpen) return -1;
      if (!a.isOpen && b.isOpen) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-1 tracking-tight">팀빌딩 캠프</h1>
          <p className="text-sm text-muted-foreground">함께 해커톤을 완주할 팀원을 찾아보세요.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAiMatchOpen(true)} className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI 매칭
          </Button>
          <Button onClick={handleCreateClick}>팀 만들기</Button>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 max-w-xs">
        <Select value={hackathonFilter} onValueChange={handleHackathonChange}>
          <SelectTrigger>
            <SelectValue placeholder="해커톤 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 해커톤</SelectItem>
            {hackathons.map((h) => (
              <SelectItem key={h.slug} value={h.slug}>
                {h.title.length > 40 ? h.title.slice(0, 40) + "…" : h.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="👥"
          title="팀이 없습니다"
          description="첫 번째 팀을 만들어보세요!"
          action={{ label: "팀 만들기", onClick: handleCreateClick }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((team) => (
            <TeamCard key={team.teamCode} team={team} />
          ))}
        </div>
      )}

      <TeamCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <AITeamMatch open={aiMatchOpen} onClose={() => setAiMatchOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={() => setPrivacyOpen(true)} />

      {/* Privacy warning */}
      <Dialog open={privacyOpen} onOpenChange={(v) => !v && setPrivacyOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-orange-500" />
              팀 구성 전 개인정보 유의사항
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>팀을 생성하고 운영하는 과정에서 아래 사항을 반드시 준수해 주세요:</p>
            <ul className="space-y-2 list-none">
              {[
                "내부 유저 정보(이메일, 비밀번호 등)는 절대 외부에 공개하지 마세요.",
                "지원자의 개인정보는 해당 팀의 팀장만 볼 수 있으며, 제3자에게 공유할 수 없습니다.",
                "다른 팀의 내부 전략, 아이디어, 제출물 정보는 무단으로 열람하거나 공유할 수 없습니다.",
                "팀원 모집 목적 외 개인정보를 사용하지 마세요.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" onClick={() => setPrivacyOpen(false)} className="flex-1 cursor-pointer">취소</Button>
            <Button onClick={() => { setPrivacyOpen(false); setCreateOpen(true); }} className="flex-1 cursor-pointer">
              동의하고 팀 만들기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CampPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 max-w-7xl py-12"><p className="text-muted-foreground">로딩 중...</p></div>}>
      <CampContent />
    </Suspense>
  );
}
