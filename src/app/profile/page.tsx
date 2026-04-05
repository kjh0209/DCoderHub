"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/auth/AuthModal";
import { toast } from "sonner";
import {
  ExternalLink,
  Edit2,
  Check,
  X,
  MessageCircle,
  Sparkles,
  Trophy,
  CalendarDays,
  Users,
  LogIn,
  LogOut,
  Code2,
  PlayCircle,
  Briefcase,
  HardDrive,
} from "lucide-react";

const ROLE_OPTIONS = ["Frontend", "Backend", "Designer", "ML Engineer", "PM", "Data Scientist", "DevOps"];

export default function ProfilePage() {
  const router = useRouter();
  const currentUser = useStore((s) => s.currentUser);
  const updateUserProfile = useStore((s) => s.updateUserProfile);
  const logout = useStore((s) => s.logout);
  const usageLog = useStore((s) => s.usageLog);
  const participations = useStore((s) => s.participations);
  const hackathons = useStore((s) => s.hackathons);
  const teams = useStore((s) => s.teams);
  const rankings = useStore((s) => s.rankings);
  const [authOpen, setAuthOpen] = useState(false);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [skillInput, setSkillInput] = useState("");
  const [editingRoles, setEditingRoles] = useState(false);
  const [draftRoles, setDraftRoles] = useState<string[]>([]);
  const [editingSkills, setEditingSkills] = useState(false);
  const [draftSkills, setDraftSkills] = useState<string[]>([]);

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 max-w-2xl py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <LogIn className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold">로그인이 필요합니다</h1>
        <p className="text-sm text-muted-foreground">프로필을 보려면 먼저 로그인해주세요.</p>
        <Button onClick={() => setAuthOpen(true)} className="gap-2">
          <LogIn className="h-4 w-4" />
          로그인
        </Button>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={() => router.refresh()} />
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayUsage = usageLog.find((u) => u.userId === currentUser.id && u.date === today);
  const chatRemaining = Math.max(0, 20 - (todayUsage?.chatCount ?? 0));
  const matchRemaining = Math.max(0, 5 - (todayUsage?.matchCount ?? 0));

  const myParticipations = participations.filter((p) => p.userId === currentUser.id);
  const myHackathons = myParticipations.map((p) => hackathons.find((h) => h.slug === p.hackathonSlug)).filter(Boolean);
  const myTeams = teams.filter((t) => t.captainId === currentUser.id);
  const myRanking = rankings.find((r) => r.nickname === (currentUser.nickname || currentUser.name));

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setDraft({ ...draft, [field]: value });
  };

  const saveField = (field: keyof typeof currentUser) => {
    const val = draft[field as string];
    if (val !== undefined) {
      updateUserProfile({ [field]: val } as Parameters<typeof updateUserProfile>[0]);
      toast.success("저장되었습니다.");
    }
    setEditingField(null);
  };

  const cancelEdit = () => setEditingField(null);

  const saveRoles = () => {
    updateUserProfile({ roles: draftRoles });
    setEditingRoles(false);
    toast.success("역할이 저장되었습니다.");
  };

  const saveSkills = () => {
    updateUserProfile({ skills: draftSkills });
    setEditingSkills(false);
    toast.success("기술 스택이 저장되었습니다.");
  };

  const addDraftSkill = () => {
    const s = skillInput.trim();
    if (s && !draftSkills.includes(s)) setDraftSkills((prev) => [...prev, s]);
    setSkillInput("");
  };

  return (
    <div className="container mx-auto px-4 max-w-3xl py-10 space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight">내 프로필</h1>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-muted-foreground cursor-pointer"
          onClick={() => { logout(); router.push("/"); }}
        >
          <LogOut className="h-3.5 w-3.5" />
          로그아웃
        </Button>
      </div>

      {/* Profile header */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-2xl font-bold">
              {currentUser.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            {/* Name / Nickname */}
            <div>
              {editingField === "nickname" ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={draft.nickname ?? ""}
                    onChange={(e) => setDraft({ ...draft, nickname: e.target.value })}
                    placeholder="닉네임 (최대 20자)"
                    maxLength={20}
                    className="h-8 text-lg font-bold w-48"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") saveField("nickname"); if (e.key === "Escape") cancelEdit(); }}
                  />
                  <button onClick={() => saveField("nickname")} className="text-green-600 cursor-pointer"><Check className="h-4 w-4" /></button>
                  <button onClick={cancelEdit} className="text-muted-foreground cursor-pointer"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{currentUser.nickname || currentUser.name}</h1>
                  {currentUser.provider === "google" && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full">Google</span>
                  )}
                  <button
                    onClick={() => startEdit("nickname", currentUser.nickname || "")}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            </div>

            {/* Bio */}
            {editingField === "bio" ? (
              <div className="space-y-1.5">
                <Textarea
                  value={draft.bio ?? ""}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  placeholder="자기소개를 입력하세요..."
                  rows={3}
                  maxLength={200}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveField("bio")} className="gap-1"><Check className="h-3.5 w-3.5" /> 저장</Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>취소</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <p className="text-sm text-muted-foreground flex-1">
                  {currentUser.bio || <span className="italic">자기소개를 입력해보세요.</span>}
                </p>
                <button onClick={() => startEdit("bio", currentUser.bio || "")} className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {(["github", "youtube", "linkedin", "googleDrive"] as const).map((field) => {
            const icons: Record<string, React.ReactNode> = {
              github: <Code2 className="h-4 w-4" />,
              youtube: <PlayCircle className="h-4 w-4 text-red-500" />,
              linkedin: <Briefcase className="h-4 w-4 text-blue-600" />,
              googleDrive: <HardDrive className="h-4 w-4 text-green-600" />,
            };
            const labels: Record<string, string> = {
              github: "GitHub",
              youtube: "YouTube",
              linkedin: "LinkedIn",
              googleDrive: "Google Drive",
            };
            const val = currentUser[field] || "";

            return (
              <div key={field} className="flex items-center gap-2">
                {icons[field]}
                {editingField === field ? (
                  <div className="flex items-center gap-1 flex-1">
                    <Input
                      value={draft[field] ?? ""}
                      onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                      placeholder={`${labels[field]} URL`}
                      className="h-7 text-xs flex-1"
                      type="url"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter") saveField(field); if (e.key === "Escape") cancelEdit(); }}
                    />
                    <button onClick={() => saveField(field)} className="text-green-600 cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                    <button onClick={cancelEdit} className="text-muted-foreground cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    {val ? (
                      <a href={val} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate flex-1">
                        {val.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground flex-1 italic">{labels[field]} 추가</span>
                    )}
                    <button onClick={() => startEdit(field, val)} className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0">
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Roles & Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Roles */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">역할</h3>
            {!editingRoles ? (
              <button
                onClick={() => { setEditingRoles(true); setDraftRoles(currentUser.roles ?? []); }}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            ) : (
              <div className="flex gap-1.5">
                <button onClick={saveRoles} className="text-green-600 cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                <button onClick={() => setEditingRoles(false)} className="text-muted-foreground cursor-pointer"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
          </div>
          {editingRoles ? (
            <div className="flex flex-wrap gap-1.5">
              {ROLE_OPTIONS.map((r) => (
                <Badge
                  key={r}
                  variant={draftRoles.includes(r) ? "default" : "outline"}
                  className="cursor-pointer select-none text-xs"
                  onClick={() => setDraftRoles((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r])}
                >
                  {r}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {(currentUser.roles ?? []).length > 0 ? (
                currentUser.roles!.map((r) => (
                  <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">역할을 추가해보세요.</p>
              )}
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">기술 스택</h3>
            {!editingSkills ? (
              <button
                onClick={() => { setEditingSkills(true); setDraftSkills(currentUser.skills ?? []); setSkillInput(""); }}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            ) : (
              <div className="flex gap-1.5">
                <button onClick={saveSkills} className="text-green-600 cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                <button onClick={() => setEditingSkills(false)} className="text-muted-foreground cursor-pointer"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
          </div>
          {editingSkills ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {draftSkills.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs gap-1">
                    {s}
                    <button onClick={() => setDraftSkills((prev) => prev.filter((x) => x !== s))}><X className="h-2.5 w-2.5" /></button>
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="기술 입력 후 Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDraftSkill(); } }}
                className="h-7 text-xs"
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {(currentUser.skills ?? []).length > 0 ? (
                currentUser.skills!.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">기술 스택을 추가해보세요.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: <Trophy className="h-4 w-4 text-yellow-500" />,
            label: "랭킹 점수",
            value: myRanking ? `${myRanking.points.toLocaleString()}pt` : "-",
            sub: myRanking ? `#${myRanking.rank}위` : undefined,
          },
          {
            icon: <CalendarDays className="h-4 w-4 text-primary" />,
            label: "참가 해커톤",
            value: `${myHackathons.length}개`,
          },
          {
            icon: <MessageCircle className="h-4 w-4 text-blue-500" />,
            label: "AI 채팅 잔여",
            value: `${chatRemaining}/20`,
            sub: "오늘",
          },
          {
            icon: <Sparkles className="h-4 w-4 text-purple-500" />,
            label: "AI 매칭 잔여",
            value: `${matchRemaining}/5`,
            sub: "오늘",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 bg-muted rounded-lg shrink-0">{stat.icon}</div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
              <p className="text-sm font-bold mt-0.5">{stat.value}</p>
              {stat.sub && <p className="text-[10px] text-muted-foreground">{stat.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Participated hackathons */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          참가한 해커톤
        </h3>
        {myHackathons.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">아직 참가한 해커톤이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {myHackathons.map((h) => {
              if (!h) return null;
              const participation = myParticipations.find((p) => p.hackathonSlug === h.slug);
              return (
                <div key={h.slug} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{h.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      참가: {participation ? new Date(participation.registeredAt).toLocaleDateString("ko-KR") : "-"}
                    </p>
                  </div>
                  <a
                    href={h.links.detail}
                    className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0 ml-4"
                  >
                    보기 <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My teams */}
      {myTeams.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            내가 만든 팀
          </h3>
          <div className="space-y-2">
            {myTeams.map((t) => (
              <div key={t.teamCode} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.hackathonSlug} · {t.memberCount}명</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  t.isOpen
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {t.isOpen ? "모집중" : "마감"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
