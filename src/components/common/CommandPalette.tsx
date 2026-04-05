"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Trophy, Users, BarChart3, Zap, Search, ShieldAlert } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TeamCreateModal } from "@/components/camp/TeamCreateModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { useStore } from "@/store/useStore";

const PAGES = [
  { label: "메인", href: "/", Icon: Home },
  { label: "해커톤", href: "/hackathons", Icon: Trophy },
  { label: "팀원 모집", href: "/camp", Icon: Users },
  { label: "랭킹", href: "/rankings", Icon: BarChart3 },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const router = useRouter();
  const hackathons = useStore((s) => s.hackathons);
  const teams = useStore((s) => s.teams);
  const currentUser = useStore((s) => s.currentUser);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleCreateTeam = () => {
    setOpen(false);
    if (!currentUser) {
      setAuthOpen(true);
    } else {
      setPrivacyOpen(true);
    }
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="검색어를 입력하세요..." />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-4">
              <Search className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
            </div>
          </CommandEmpty>

          <CommandGroup heading="페이지">
            {PAGES.map(({ label, href, Icon }) => (
              <CommandItem key={href} onSelect={() => navigate(href)} className="gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>

          {hackathons.length > 0 && (
            <CommandGroup heading="해커톤">
              {hackathons.map((h) => (
                <CommandItem key={h.slug} onSelect={() => navigate(`/hackathons/${h.slug}`)} className="gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  {h.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {teams.length > 0 && (
            <CommandGroup heading="팀">
              {teams.map((t) => (
                <CommandItem key={t.teamCode} onSelect={() => navigate(`/camp?hackathon=${t.hackathonSlug}`)} className="gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {t.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandGroup heading="빠른 액션">
            <CommandItem onSelect={handleCreateTeam} className="gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              팀 만들기
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Privacy warning dialog */}
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

      <TeamCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => setPrivacyOpen(true)}
      />
    </>
  );
}
