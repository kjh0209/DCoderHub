"use client";

import { Check, X, Clock, Users, Mail, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import type { Team } from "@/lib/types";

interface ApplicationsModalProps {
  open: boolean;
  onClose: () => void;
  team: Team;
}

const STATUS_MAP = {
  pending: { label: "검토 중", color: "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800" },
  accepted: { label: "수락됨", color: "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" },
  rejected: { label: "거절됨", color: "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" },
};

export function ApplicationsModal({ open, onClose, team }: ApplicationsModalProps) {
  const allApplications = useStore((s) => s.applications);
  const applications = allApplications.filter((a) => a.teamCode === team.teamCode);
  const updateApplicationStatus = useStore((s) => s.updateApplicationStatus);

  const pending = applications.filter((a) => a.status === "pending");
  const reviewed = applications.filter((a) => a.status !== "pending");

  const handleAccept = (id: string, name: string) => {
    updateApplicationStatus(id, "accepted");
    toast.success(`${name}님의 지원을 수락했습니다.`);
  };

  const handleReject = (id: string, name: string) => {
    updateApplicationStatus(id, "rejected");
    toast.error(`${name}님의 지원을 거절했습니다.`);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0 max-h-[85vh] flex flex-col">
        <DialogTitle className="sr-only">지원 현황</DialogTitle>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] font-semibold text-base">
                {team.name} — 지원 현황
              </h2>
              <p className="text-xs text-muted-foreground">
                전체 {applications.length}건 · 검토 대기 {pending.length}건
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">아직 지원자가 없습니다</p>
            </div>
          ) : (
            <>
              {/* Pending */}
              {pending.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> 검토 대기 ({pending.length})
                  </p>
                  {pending.map((app) => (
                    <div
                      key={app.id}
                      className="bg-card border border-border rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">{app.applicantName}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3" /> {app.applicantEmail}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_MAP[app.status].color}`}>
                          {STATUS_MAP[app.status].label}
                        </span>
                      </div>

                      {app.roles.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          {app.roles.map((r) => (
                            <Badge key={r} variant="secondary" className="text-xs">
                              {r}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-lg px-3 py-2">
                        "{app.message}"
                      </p>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1.5 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
                          onClick={() => handleReject(app.id, app.applicantName)}
                        >
                          <X className="h-3.5 w-3.5" /> 거절
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 gap-1.5 cursor-pointer"
                          onClick={() => handleAccept(app.id, app.applicantName)}
                        >
                          <Check className="h-3.5 w-3.5" /> 수락
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reviewed */}
              {reviewed.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    검토 완료 ({reviewed.length})
                  </p>
                  {reviewed.map((app) => (
                    <div
                      key={app.id}
                      className="bg-card border border-border rounded-xl p-4 space-y-2 opacity-70"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{app.applicantName}</p>
                          <p className="text-xs text-muted-foreground">{app.applicantEmail}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_MAP[app.status].color}`}>
                          {STATUS_MAP[app.status].label}
                        </span>
                      </div>
                      {app.roles.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {app.roles.map((r) => (
                            <Badge key={r} variant="outline" className="text-xs">
                              {r}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={onClose} className="w-full cursor-pointer">
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
