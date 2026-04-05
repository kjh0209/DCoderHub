"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, ExternalLink, AlertCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import type { TeamMatchResult } from "@/lib/types";

const DAILY_MATCH_LIMIT = 5;

const ROLE_OPTIONS = ["Frontend", "Backend", "Designer", "ML Engineer", "PM", "Data Scientist", "DevOps"];

interface AITeamMatchProps {
  open: boolean;
  onClose: () => void;
}

export function AITeamMatch({ open, onClose }: AITeamMatchProps) {
  const teams = useStore((s) => s.teams);
  const currentUser = useStore((s) => s.currentUser);
  const incrementMatchUsage = useStore((s) => s.incrementMatchUsage);
  const usageLog = useStore((s) => s.usageLog);

  const [roles, setRoles] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [intro, setIntro] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TeamMatchResult[]>([]);

  const today = new Date().toISOString().slice(0, 10);
  const usedToday = currentUser
    ? (usageLog.find((u) => u.userId === currentUser.id && u.date === today)?.matchCount ?? 0)
    : 0;
  const remaining = Math.max(0, DAILY_MATCH_LIMIT - usedToday);
  const isLimitReached = currentUser ? remaining === 0 : false;

  const toggleRole = (role: string) =>
    setRoles((prev) => prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput("");
  };

  const handleMatch = async () => {
    if (roles.length === 0) return;
    if (currentUser && !incrementMatchUsage(currentUser.id)) {
      toast.error(`오늘의 AI 매칭 횟수(${DAILY_MATCH_LIMIT}회)를 모두 사용했습니다.`, {
        description: "내일 다시 이용해주세요.",
      });
      return;
    }
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/team-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: { roles, skills, intro }, teams }),
      });
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI 팀 매칭
            {currentUser && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                remaining === 0
                  ? "bg-destructive/15 text-destructive"
                  : "bg-muted text-muted-foreground"
              }`}>
                오늘 {remaining}/{DAILY_MATCH_LIMIT}회
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>나의 역할 (복수 선택)</Label>
            <div className="flex flex-wrap gap-1.5">
              {ROLE_OPTIONS.map((role) => (
                <Badge
                  key={role}
                  variant={roles.includes(role) ? "default" : "outline"}
                  className="cursor-pointer select-none"
                  onClick={() => toggleRole(role)}
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>기술 스택</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1">
                  {s}
                  <button onClick={() => setSkills((prev) => prev.filter((sk) => sk !== s))}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="기술 입력 후 Enter (React, Python...)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
            />
          </div>

          <div className="space-y-1.5">
            <Label>자기소개 (선택)</Label>
            <Textarea
              placeholder="간단한 자기소개를 작성해주세요..."
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={3}
            />
          </div>

          {isLimitReached && (
            <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              오늘의 AI 매칭 횟수를 모두 사용했습니다. 내일 다시 이용해주세요.
            </div>
          )}

          <Button onClick={handleMatch} disabled={loading || roles.length === 0 || isLimitReached} className="w-full gap-2">
            {loading ? (
              <><span className="animate-spin">⚙️</span> 매칭 중...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> AI 매칭 시작</>
            )}
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3 border-t border-border pt-4">
            <p className="font-semibold text-sm">매칭 결과</p>
            {results.map((r) => {
              const team = teams.find((t) => t.teamCode === r.teamCode);
              return (
                <div key={r.teamCode} className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{r.teamName}</span>
                    <span className="text-primary font-bold text-lg">{r.matchRate}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.reason}</p>
                  {team?.contact.url && team.contact.url !== "#" && (
                    <a
                      href={team.contact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      지원하기
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
