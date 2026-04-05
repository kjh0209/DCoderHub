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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import type { Team } from "@/lib/types";

interface TeamEditModalProps {
  open: boolean;
  onClose: () => void;
  team: Team;
}

const COMMON_ROLES = ["Frontend", "Backend", "Designer", "ML Engineer", "PM", "Data Scientist"];

export function TeamEditModal({ open, onClose, team }: TeamEditModalProps) {
  const updateTeam = useStore((s) => s.updateTeam);

  const [intro, setIntro] = useState(team.intro);
  const [isOpen, setIsOpen] = useState(team.isOpen);
  const [lookingFor, setLookingFor] = useState<string[]>(team.lookingFor);
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
    updateTeam(team.teamCode, { intro, isOpen, lookingFor });
    toast.success("팀 정보가 수정되었습니다.");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>팀 정보 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <Label>팀원 모집 중</Label>
            <Switch checked={isOpen} onCheckedChange={setIsOpen} />
          </div>

          <div className="space-y-1.5">
            <Label>팀 소개</Label>
            <Textarea
              placeholder="팀을 소개해주세요..."
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={3}
            />
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
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1 cursor-pointer">취소</Button>
          <Button onClick={handleSubmit} className="flex-1 cursor-pointer">저장</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
