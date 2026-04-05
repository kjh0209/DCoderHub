"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Mail, Briefcase, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import type { Team } from "@/lib/types";

const ALL_ROLES = [
  "Frontend", "Backend", "Fullstack", "ML Engineer",
  "Data Scientist", "Designer", "PM", "DevOps",
];

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  team: Team;
}

export function ApplyModal({ open, onClose, team }: ApplyModalProps) {
  const currentUser = useStore((s) => s.currentUser);
  const addApplication = useStore((s) => s.addApplication);
  const getUserApplication = useStore((s) => s.getUserApplication);

  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const existingApp = currentUser
    ? getUserApplication(team.teamCode, currentUser.id)
    : undefined;

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) { toast.error("이름을 입력해주세요."); return; }
    if (!email.trim() || !email.includes("@")) { toast.error("올바른 이메일을 입력해주세요."); return; }
    if (selectedRoles.length === 0) { toast.error("가능한 역할을 하나 이상 선택해주세요."); return; }
    if (!message.trim()) { toast.error("지원 메시지를 입력해주세요."); return; }

    addApplication({
      teamCode: team.teamCode,
      hackathonSlug: team.hackathonSlug,
      applicantId: currentUser?.id ?? "guest-" + Date.now(),
      applicantName: name.trim(),
      applicantEmail: email.trim(),
      roles: selectedRoles,
      message: message.trim(),
      status: "pending",
    });

    setSubmitted(true);
    toast.success(`${team.name}에 지원 완료!`);
  };

  const handleClose = () => {
    setSubmitted(false);
    setSelectedRoles([]);
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">팀 지원</DialogTitle>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Send className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] font-semibold text-base">
                {team.name} 지원하기
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {team.lookingFor.length > 0 && (
                  <>모집 포지션: {team.lookingFor.join(", ")}</>
                )}
              </p>
            </div>
          </div>
        </div>

        {submitted || existingApp ? (
          /* 지원 완료 화면 */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-10 flex flex-col items-center text-center gap-4"
          >
            <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-green-500" />
            </div>
            <div>
              <p className="font-semibold text-base">
                {existingApp && !submitted ? "이미 지원한 팀입니다" : "지원이 완료되었습니다!"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {existingApp?.status === "pending" && "팀장의 검토 후 결과가 안내됩니다."}
                {existingApp?.status === "accepted" && "🎉 지원이 수락되었습니다!"}
                {existingApp?.status === "rejected" && "아쉽게도 이번에는 인연이 아닌 것 같습니다."}
              </p>
            </div>
            {existingApp && (
              <div className="bg-muted/60 rounded-xl px-4 py-3 text-sm w-full text-left space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>지원 역할</span>
                  <span>{existingApp.roles.join(", ")}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>상태</span>
                  <span className={
                    existingApp.status === "accepted" ? "text-green-500 font-medium" :
                    existingApp.status === "rejected" ? "text-destructive font-medium" :
                    "text-yellow-500 font-medium"
                  }>
                    {existingApp.status === "pending" ? "검토 중" :
                     existingApp.status === "accepted" ? "수락됨" : "거절됨"}
                  </span>
                </div>
              </div>
            )}
            <Button variant="outline" onClick={handleClose} className="cursor-pointer">
              닫기
            </Button>
          </motion.div>
        ) : (
          /* 지원 폼 */
          <div className="px-6 py-5 space-y-5">
            {/* 이름 + 이메일 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">이름 *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">이메일 *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            {/* 역할 선택 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                가능한 역할 * <span className="text-xs font-normal text-muted-foreground">(복수 선택 가능)</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {ALL_ROLES.map((role) => {
                  const isSelected = selectedRoles.includes(role);
                  const isWanted = team.lookingFor.includes(role);
                  return (
                    <button
                      key={role}
                      onClick={() => toggleRole(role)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : isWanted
                          ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                          : "bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:text-foreground"
                      }`}
                    >
                      {role}
                      {isWanted && !isSelected && (
                        <span className="text-[9px] bg-primary/20 text-primary px-1 rounded">모집중</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 자기소개 / 메시지 */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                지원 메시지 *
              </Label>
              <Textarea
                placeholder={`팀에 합류하고 싶은 이유, 기여할 수 있는 점, 관련 경험 등을 자유롭게 작성해주세요.\n\n예: "React/Next.js 3년 경험이 있고, 이번 인수인계 해커톤의 UX를 책임지고 싶습니다."`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none text-sm"
              />
              <p className="text-xs text-muted-foreground text-right">{message.length}/500</p>
            </div>

            {/* CTA */}
            <div className="flex gap-2 pt-1">
              <Button variant="outline" onClick={handleClose} className="flex-1 cursor-pointer">
                취소
              </Button>
              <Button onClick={handleSubmit} className="flex-1 gap-2 cursor-pointer">
                <Send className="h-4 w-4" />
                지원하기
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
