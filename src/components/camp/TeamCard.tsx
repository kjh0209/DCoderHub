"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ApplyModal } from "./ApplyModal";
import { ApplicationsModal } from "./ApplicationsModal";
import { TeamEditModal } from "./TeamEditModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { Users, Send, ClipboardList, Clock, ExternalLink, Pencil } from "lucide-react";
import { useStore } from "@/store/useStore";
import type { Team } from "@/lib/types";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team: initialTeam }: TeamCardProps) {
  const hackathons = useStore((s) => s.hackathons);
  const currentUser = useStore((s) => s.currentUser);
  const allTeams = useStore((s) => s.teams);
  const allApplications = useStore((s) => s.applications);

  // Reactive team from store so edits reflect immediately
  const team = allTeams.find((t) => t.teamCode === initialTeam.teamCode) ?? initialTeam;
  const applications = allApplications.filter((a) => a.teamCode === team.teamCode);

  const hackathon = hackathons.find((h) => h.slug === team.hackathonSlug);
  const isCaptain = !!currentUser && currentUser.id === team.captainId;
  const myApp = currentUser ? applications.find((a) => a.applicantId === currentUser.id) : undefined;
  const pendingCount = applications.filter((a) => a.status === "pending").length;

  const [applyOpen, setApplyOpen] = useState(false);
  const [applicationsOpen, setApplicationsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const handleApplyClick = () => {
    if (!currentUser) {
      setAuthOpen(true);
    } else if (team.contact.type === "kakao" || team.contact.type === "google") {
      window.open(team.contact.url, "_blank", "noopener,noreferrer");
    } else {
      setApplyOpen(true);
    }
  };

  const externalLabel = team.contact.type === "kakao"
    ? "카카오 오픈채팅 참여"
    : team.contact.type === "google"
    ? "구글 폼 지원"
    : null;

  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 hover:shadow-md hover:shadow-primary/5 transition-all duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-[family-name:var(--font-heading)] font-bold text-base">{team.name}</span>
              <StatusBadge status={team.isOpen ? "open" : "closed"} />
              {isCaptain && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                  팀장
                </span>
              )}
            </div>
            {hackathon && (
              <Badge variant="outline" className="mt-1.5 text-xs max-w-[200px] truncate">
                {hackathon.title.length > 28 ? hackathon.title.slice(0, 28) + "…" : hackathon.title}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
              <Users className="h-3.5 w-3.5" />
              {team.memberCount}명
            </div>
            {isCaptain && (
              <button
                onClick={() => setEditOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="팀 정보 수정"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{team.intro}</p>

        {team.lookingFor.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">모집 중인 포지션</p>
            <div className="flex flex-wrap gap-1.5">
              {team.lookingFor.map((role) => (
                <Badge key={role} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {isCaptain ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 cursor-pointer relative"
            onClick={() => setApplicationsOpen(true)}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            지원 현황
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </Button>
        ) : team.isOpen ? (
          myApp ? (
            <div className={`w-full text-xs text-center py-2 px-3 rounded-lg border font-medium flex items-center justify-center gap-1.5 ${
              myApp.status === "accepted"
                ? "bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800"
                : myApp.status === "rejected"
                ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800"
                : "bg-muted border-border text-muted-foreground"
            }`}>
              <Clock className="h-3.5 w-3.5" />
              {myApp.status === "pending" && "지원 검토 중"}
              {myApp.status === "accepted" && "지원 수락됨 🎉"}
              {myApp.status === "rejected" && "지원 거절됨"}
            </div>
          ) : externalLabel ? (
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-2 cursor-pointer"
              onClick={handleApplyClick}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {externalLabel}
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full gap-2 cursor-pointer"
              onClick={handleApplyClick}
            >
              <Send className="h-3.5 w-3.5" />
              지원하기
            </Button>
          )
        ) : (
          <div className="w-full text-xs text-center py-2 px-3 rounded-lg bg-muted text-muted-foreground">
            모집 마감
          </div>
        )}
      </div>

      <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} team={team} />
      <ApplicationsModal open={applicationsOpen} onClose={() => setApplicationsOpen(false)} team={team} />
      <TeamEditModal open={editOpen} onClose={() => setEditOpen(false)} team={team} />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          if (team.contact.type === "kakao" || team.contact.type === "google") {
            window.open(team.contact.url, "_blank", "noopener,noreferrer");
          } else {
            setApplyOpen(true);
          }
        }}
      />
    </>
  );
}
