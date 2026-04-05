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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";

interface TeamCreateModalProps {
  open: boolean;
  onClose: () => void;
  defaultHackathonSlug?: string;
}

const COMMON_ROLES = ["Frontend", "Backend", "Designer", "ML Engineer", "PM", "Data Scientist"];

type ContactType = "internal" | "kakao" | "google";

const CONTACT_LABELS: Record<ContactType, string> = {
  internal: "내부 지원폼 (DCoderHub)",
  kakao: "카카오 오픈채팅",
  google: "구글 폼",
};

export function TeamCreateModal({ open, onClose, defaultHackathonSlug }: TeamCreateModalProps) {
  const { toast } = useToast();
  const hackathons = useStore((s) => s.hackathons);
  const addTeam = useStore((s) => s.addTeam);
  const currentUser = useStore((s) => s.currentUser);

  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");
  const [hackathonSlug, setHackathonSlug] = useState(defaultHackathonSlug ?? "");
  const [isOpen, setIsOpen] = useState(true);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [contactType, setContactType] = useState<ContactType>("internal");
  const [contactUrl, setContactUrl] = useState("");
  const [roleInput, setRoleInput] = useState("");

  const addRole = (role: string) => {
    const trimmed = role.trim();
    if (trimmed && !lookingFor.includes(trimmed)) {
      setLookingFor((prev) => [...prev, trimmed]);
    }
    setRoleInput("");
  };

  const removeRole = (role: string) => setLookingFor((prev) => prev.filter((r) => r !== role));

  const handleSubmit = () => {
    if (!name.trim()) { toast({ title: "팀명을 입력해주세요", variant: "destructive" }); return; }
    if (!intro.trim()) { toast({ title: "소개를 입력해주세요", variant: "destructive" }); return; }
    if (!hackathonSlug) { toast({ title: "해커톤을 선택해주세요", variant: "destructive" }); return; }
    if (contactType !== "internal" && !contactUrl.trim()) {
      toast({ title: "연락 링크를 입력해주세요", variant: "destructive" });
      return;
    }

    addTeam({
      hackathonSlug,
      name: name.trim(),
      isOpen,
      memberCount: 1,
      lookingFor,
      intro: intro.trim(),
      contact: { type: contactType, url: contactUrl.trim() || "#" },
      captainId: currentUser?.id,
    });

    toast({ title: "팀이 생성되었습니다!", description: name });
    setName(""); setIntro(""); setHackathonSlug(defaultHackathonSlug ?? "");
    setIsOpen(true); setLookingFor([]); setContactType("internal"); setContactUrl("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>팀 만들기</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>팀명 *</Label>
            <Input placeholder="팀 이름을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>해커톤 *</Label>
            <Select value={hackathonSlug} onValueChange={(v) => setHackathonSlug(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="해커톤 선택">
                  {hackathonSlug
                    ? (() => {
                        const t = hackathons.find((h) => h.slug === hackathonSlug)?.title ?? hackathonSlug;
                        return t.length > 35 ? t.slice(0, 35) + "…" : t;
                      })()
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {hackathons.map((h) => (
                  <SelectItem key={h.slug} value={h.slug}>
                    {h.title.length > 35 ? h.title.slice(0, 35) + "…" : h.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>팀 소개 *</Label>
            <Textarea
              placeholder="팀을 소개해주세요..."
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>팀원 모집 중</Label>
            <Switch checked={isOpen} onCheckedChange={setIsOpen} />
          </div>

          <div className="space-y-1.5">
            <Label>모집 포지션</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {lookingFor.map((role) => (
                <Badge key={role} variant="secondary" className="gap-1">
                  {role}
                  <button onClick={() => removeRole(role)} className="cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_ROLES.filter((r) => !lookingFor.includes(r)).map((role) => (
                <Badge
                  key={role}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => addRole(role)}
                >
                  + {role}
                </Badge>
              ))}
            </div>
            <Input
              placeholder="직접 입력 후 Enter"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRole(roleInput); } }}
            />
          </div>

          <div className="space-y-1.5">
            <Label>지원 방식 *</Label>
            <Select value={contactType} onValueChange={(v) => setContactType(v as ContactType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CONTACT_LABELS) as ContactType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {CONTACT_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {contactType !== "internal" && (
            <div className="space-y-1.5">
              <Label>
                {contactType === "kakao" ? "카카오 오픈채팅 링크" : "구글 폼 링크"} *
              </Label>
              <Input
                type="url"
                placeholder="https://"
                value={contactUrl}
                onChange={(e) => setContactUrl(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1 cursor-pointer">취소</Button>
          <Button onClick={handleSubmit} className="flex-1 cursor-pointer">팀 생성</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
