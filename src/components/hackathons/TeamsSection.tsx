"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TeamCreateModal } from "@/components/camp/TeamCreateModal";
import { ApplyModal } from "@/components/camp/ApplyModal";
import { ApplicationsModal } from "@/components/camp/ApplicationsModal";
import { TeamEditModal } from "@/components/camp/TeamEditModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { EmptyState } from "@/components/common/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, ClipboardList, Clock, Users, ExternalLink, Pencil, ShieldAlert } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import type { HackathonDetail, Team } from "@/lib/types";

interface TeamsSectionProps {
  detail: HackathonDetail;
}

export function TeamsSection({ detail }: TeamsSectionProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applicationsOpen, setApplicationsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const allTeams = useStore((s) => s.teams);
  const currentUser = useStore((s) => s.currentUser);
  const allApplications = useStore((s) => s.applications);
  const participations = useStore((s) => s.participations);

  const isParticipating = !!currentUser && participations.some(
    (p) => p.userId === currentUser.id && p.hackathonSlug === detail.slug
  );

  const teams = allTeams.filter((t) => t.hackathonSlug === detail.slug);
  const applications = allApplications;

  const sorted = [...teams].sort((a, b) => {
    if (a.isOpen && !b.isOpen) return -1;
    if (!a.isOpen && b.isOpen) return 1;
    return 0;
  });

  const handleCreateClick = () => {
    if (!currentUser) {
      setAuthOpen(true);
      return;
    }
    if (!isParticipating) {
      toast.error("해커톤 참가 신청 후 팀을 만들 수 있습니다.", {
        description: "개요 섹션에서 참가 신청을 먼저 해주세요.",
      });
      return;
    }
    setPrivacyOpen(true);
  };

  const handleApplyClick = (team: Team) => {
    setSelectedTeam(team);
    if (!currentUser) {
      setAuthOpen(true);
    } else if (team.contact.type === "kakao" || team.contact.type === "google") {
      window.open(team.contact.url, "_blank", "noopener,noreferrer");
    } else {
      setApplyOpen(true);
    }
  };

  return (
    <section id="teams" className="scroll-mt-24 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight">팀</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(detail.sections.teams.listUrl)} className="cursor-pointer">
            팀 찾기
          </Button>
          <Button onClick={handleCreateClick} className="cursor-pointer">팀 만들기</Button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon="👥"
          title="아직 팀이 없습니다"
          description="첫 번째로 팀을 만들어보세요!"
          action={{ label: "팀 만들기", onClick: () => setCreateOpen(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((team) => {
            const isCaptain = !!currentUser && currentUser.id === team.captainId;
            const teamApps = applications.filter((a) => a.teamCode === team.teamCode);
            const myApp = currentUser ? teamApps.find((a) => a.applicantId === currentUser.id) : undefined;
            const pendingCount = teamApps.filter((a) => a.status === "pending").length;
            const isExternal = team.contact.type === "kakao" || team.contact.type === "google";
            const externalLabel = team.contact.type === "kakao" ? "카카오 오픈채팅" : "구글 폼 지원";

            return (
              <div key={team.teamCode} className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{team.name}</span>
                      {isCaptain && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                          팀장
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Users className="h-3 w-3" /> {team.memberCount}명 참여 중
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={team.isOpen ? "open" : "closed"} />
                    {isCaptain && (
                      <button
                        onClick={() => { setSelectedTeam(team); setEditOpen(true); }}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="팀 정보 수정"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{team.intro}</p>

                {team.lookingFor.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {team.lookingFor.map((role) => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Action button */}
                {isCaptain ? (
                  <button
                    onClick={() => { setSelectedTeam(team); setApplicationsOpen(true); }}
                    className="relative inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer"
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    지원 현황 보기
                    {pendingCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                ) : team.isOpen ? (
                  myApp ? (
                    <div className={`text-xs flex items-center gap-1.5 font-medium ${
                      myApp.status === "accepted" ? "text-green-600" :
                      myApp.status === "rejected" ? "text-destructive" : "text-muted-foreground"
                    }`}>
                      <Clock className="h-3.5 w-3.5" />
                      {myApp.status === "pending" && "지원 검토 중"}
                      {myApp.status === "accepted" && "지원 수락됨 🎉"}
                      {myApp.status === "rejected" && "지원 거절됨"}
                    </div>
                  ) : isExternal ? (
                    <button
                      onClick={() => handleApplyClick(team)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {externalLabel}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyClick(team)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      지원하기
                    </button>
                  )
                ) : null}
              </div>
            );
          })}
        </div>
      )}

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
            <p className="text-xs border-t border-border pt-3">
              위 사항에 동의하고 팀을 만들겠습니다.
            </p>
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" onClick={() => setPrivacyOpen(false)} className="flex-1 cursor-pointer">
              취소
            </Button>
            <Button
              onClick={() => { setPrivacyOpen(false); setCreateOpen(true); }}
              className="flex-1 cursor-pointer"
            >
              동의하고 팀 만들기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <TeamCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultHackathonSlug={detail.slug}
      />

      {selectedTeam && (
        <>
          <ApplyModal open={applyOpen} onClose={() => { setApplyOpen(false); setSelectedTeam(null); }} team={selectedTeam} />
          <ApplicationsModal open={applicationsOpen} onClose={() => { setApplicationsOpen(false); setSelectedTeam(null); }} team={selectedTeam} />
          <TeamEditModal open={editOpen} onClose={() => { setEditOpen(false); setSelectedTeam(null); }} team={selectedTeam} />
        </>
      )}

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          if (selectedTeam) {
            // auth was triggered by apply click
            if (selectedTeam.contact.type === "kakao" || selectedTeam.contact.type === "google") {
              window.open(selectedTeam.contact.url, "_blank", "noopener,noreferrer");
            } else {
              setApplyOpen(true);
            }
          } else {
            // auth was triggered by team create click — show privacy warning
            setPrivacyOpen(true);
          }
        }}
      />
    </section>
  );
}
