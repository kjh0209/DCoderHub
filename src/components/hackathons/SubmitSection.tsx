"use client";

import { useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { formatDateTime } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  FileText,
  Link2,
  Upload,
  Lock,
  Info,
  FileArchive,
  AlertCircle,
  Clock,
  CalendarCheck,
} from "lucide-react";
import { computeHackathonStatus } from "@/lib/utils";
import type { HackathonDetail, Hackathon, SubmissionField } from "@/lib/types";

interface SubmitSectionProps {
  detail: HackathonDetail;
  hackathon: Hackathon;
}

const DEFAULT_CHECKLIST = [
  "제출 전 모든 파일과 링크가 정상적으로 접근 가능한지 확인하셨나요?",
  "제출 양식에 팀명 및 참가자 정보가 포함되어 있나요?",
  "마감 시각 이전에 제출이 완료되었나요?",
];

// ── helpers ──────────────────────────────────────────────────────────────────

type WindowStatus = "not-open" | "open" | "closed";

function getWindowStatus(openAt?: string, deadlineAt?: string): WindowStatus {
  const now = Date.now();
  if (openAt && new Date(openAt).getTime() > now) return "not-open";
  if (deadlineAt && new Date(deadlineAt).getTime() < now) return "closed";
  return "open";
}

function formatDeadline(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("ko-KR", {
    month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

/** Map composite itemKey like "plan.overview" → human-readable label */
function getSubmissionLabel(
  itemKey: string,
  items: NonNullable<HackathonDetail["sections"]["submit"]["submissionItems"]>
): string {
  const [itemPart, fieldPart] = itemKey.split(".");
  const item = items.find((i) => i.key === itemPart);
  if (!item) return itemKey;
  if (!fieldPart) return item.title;
  const field = item.fields?.find((f) => f.key === fieldPart);
  return field ? `${item.title} › ${field.label}` : `${item.title} › ${fieldPart}`;
}

function formatIcon(format: string) {
  if (format === "pdf_file") return <FileText className="h-4 w-4 text-red-500" />;
  if (format === "zip_file") return <FileArchive className="h-4 w-4 text-blue-500" />;
  return <FileText className="h-4 w-4 text-muted-foreground" />;
}

// ── field renderer ────────────────────────────────────────────────────────────

function FieldInput({
  field,
  value,
  fileName,
  disabled,
  onChange,
  onFileChange,
  fileInputRef,
}: {
  field: SubmissionField;
  value: string;
  fileName?: string;
  disabled?: boolean;
  onChange: (val: string) => void;
  onFileChange: (file: File | null) => void;
  fileInputRef: (el: HTMLInputElement | null) => void;
}) {
  if (field.type === "file") {
    return (
      <div className="space-y-2">
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            disabled
              ? "border-border opacity-50 cursor-not-allowed"
              : "border-border cursor-pointer hover:border-primary/50 hover:bg-primary/5"
          }`}
          onClick={() => {
            if (disabled) return;
            document.getElementById(`file-${field.key}`)?.click();
          }}
        >
          <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-1.5" />
          {fileName ? (
            <p className="text-sm font-medium text-primary">{fileName}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              클릭하여 {field.accept ?? ""} 파일 선택
            </p>
          )}
        </div>
        <input
          id={`file-${field.key}`}
          ref={fileInputRef}
          type="file"
          accept={field.accept}
          className="hidden"
          disabled={disabled}
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
      </div>
    );
  }
  if (field.type === "textarea") {
    return (
      <Textarea
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        disabled={disabled}
      />
    );
  }
  return (
    <Input
      type={field.type === "url" ? "url" : "text"}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}

// ── main component ────────────────────────────────────────────────────────────

export function SubmitSection({ detail, hackathon }: SubmitSectionProps) {
  const { submit } = detail.sections;
  const { toast } = useToast();
  const addSubmission = useStore((s) => s.addSubmission);
  const currentUser = useStore((s) => s.currentUser);
  const participations = useStore((s) => s.participations);
  const allSubmissions = useStore((s) => s.submissions);
  const allTeams = useStore((s) => s.teams);
  const allApplications = useStore((s) => s.applications);
  const submissions = allSubmissions.filter((s) => s.hackathonSlug === detail.slug);

  // Find the user's team name for this hackathon (captain or accepted member)
  const userTeamName = useMemo(() => {
    if (!currentUser) return null;
    const captainTeam = allTeams.find(
      (t) => t.captainId === currentUser.id && t.hackathonSlug === detail.slug
    );
    if (captainTeam) return captainTeam.name;
    const acceptedApp = allApplications.find(
      (a) => a.applicantId === currentUser.id && a.status === "accepted"
    );
    if (acceptedApp) {
      const memberTeam = allTeams.find(
        (t) => t.teamCode === acceptedApp.teamCode && t.hackathonSlug === detail.slug
      );
      if (memberTeam) return memberTeam.name;
    }
    return null;
  }, [allTeams, allApplications, currentUser, detail.slug]);

  const isParticipating = !!currentUser && participations.some(
    (p) => p.userId === currentUser.id && p.hackathonSlug === detail.slug
  );

  const isEnded = computeHackathonStatus(hackathon) === "ended";
  const hasItems = !!(submit.submissionItems && submit.submissionItems.length > 0);
  const checklistItems = submit.checklistItems ?? DEFAULT_CHECKLIST;

  const [values, setValues] = useState<Record<string, string>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [checklist, setChecklist] = useState<boolean[]>(checklistItems.map(() => false));
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [fallbackNote, setFallbackNote] = useState("");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const allChecked = checklist.every(Boolean);

  // Only "open" items count for required-saved check
  const allRequiredSaved = !hasItems || submit.submissionItems!.every((item) => {
    const status = getWindowStatus(item.openAt, item.deadlineAt);
    if (status !== "open") return true; // not active → don't gate checklist on it
    const fields = item.fields ?? [];
    if (fields.length === 0) return submissions.some((s) => s.itemKey === item.key);
    return fields.filter((f) => f.required).every((f) => {
      const ck = `${item.key}.${f.key}`;
      return submissions.some((s) => s.itemKey === ck && s.value);
    });
  });

  const getFieldFileName = (itemKey: string, fieldKey: string) => {
    const ck = `${itemKey}.${fieldKey}`;
    return fileNames[ck] ?? submissions.find((s) => s.itemKey === ck)?.fileName;
  };

  const setFieldValue = (itemKey: string, fieldKey: string, val: string) => {
    setValues((p) => ({ ...p, [`${itemKey}.${fieldKey}`]: val }));
  };

  const setFieldFile = (itemKey: string, field: SubmissionField, file: File | null) => {
    if (!file) return;
    const ck = `${itemKey}.${field.key}`;
    setFileNames((p) => ({ ...p, [ck]: file.name }));
    setValues((p) => ({ ...p, [ck]: file.name }));
  };

  const handleSaveItem = (itemKey: string, itemTitle: string, fields: SubmissionField[]) => {
    const missing: string[] = [];
    fields.forEach((f) => {
      if (!f.required) return;
      if (f.autoFill === "userName") return; // always has value
      const ck = `${itemKey}.${f.key}`;
      const val = values[ck] ?? submissions.find((s) => s.itemKey === ck)?.value ?? "";
      if (!val && !fileNames[ck]) missing.push(f.label);
    });
    if (missing.length > 0) {
      toast({ title: "필수 항목을 입력해주세요", description: missing.join(", "), variant: "destructive" });
      return;
    }
    fields.forEach((f) => {
      const ck = `${itemKey}.${f.key}`;
      const isFile = f.type === "file";
      let val: string;
      if (f.autoFill === "userName") {
        val = userTeamName ?? currentUser?.nickname ?? currentUser?.name ?? "";
      } else if (isFile) {
        val = fileNames[ck] ?? submissions.find((s) => s.itemKey === ck)?.fileName ?? "";
      } else {
        val = values[ck]?.trim() ?? submissions.find((s) => s.itemKey === ck)?.value ?? "";
      }
      if (!val) return;
      addSubmission({ hackathonSlug: detail.slug, itemKey: ck, value: val, fileName: isFile ? val : undefined });
    });
    toast({ title: `"${itemTitle}" 저장 완료`, description: "제출 이력에 기록되었습니다." });
  };

  // ── gates ──
  if (!currentUser) {
    return (
      <section id="submit" className="scroll-mt-24 space-y-6">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight">제출</h2>
        <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center gap-3">
          <Lock className="h-8 w-8 text-muted-foreground" />
          <p className="font-medium">로그인이 필요합니다</p>
          <p className="text-sm text-muted-foreground">제출하려면 먼저 로그인 후 해커톤에 참가 신청하세요.</p>
        </div>
      </section>
    );
  }

  if (!isParticipating) {
    return (
      <section id="submit" className="scroll-mt-24 space-y-6">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight">제출</h2>
        <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center gap-3">
          <Lock className="h-8 w-8 text-muted-foreground" />
          <p className="font-medium">참가 신청이 필요합니다</p>
          <p className="text-sm text-muted-foreground">개요 섹션에서 참가 신청을 완료한 후 제출할 수 있습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="submit" className="scroll-mt-24 space-y-6">
      <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight">제출</h2>

      {/* Ended notice */}
      {isEnded && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">제출이 마감된 해커톤입니다</p>
            <p className="text-xs text-muted-foreground mt-0.5">이 해커톤은 종료되어 더 이상 제출할 수 없습니다.</p>
          </div>
        </div>
      )}

      {/* Guide */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-3">제출 가이드</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          {submit.guide.map((g, i) => <li key={i}>{g}</li>)}
        </ol>
      </div>

      {/* Submission items */}
      {hasItems && (
        <div className="space-y-6">
          {submit.submissionItems!.map((item) => {
            const fields = item.fields ?? [];
            const status = getWindowStatus(item.openAt, item.deadlineAt);
            const isLocked = isEnded || status !== "open";

            const requiredFields = fields.filter((f) => f.required);
            const savedRequiredCount = requiredFields.filter((f) => {
              const ck = `${item.key}.${f.key}`;
              return submissions.some((s) => s.itemKey === ck && s.value);
            }).length;
            const allItemSaved = requiredFields.length === 0 || savedRequiredCount === requiredFields.length;

            return (
              <div key={item.key} className={`bg-card border rounded-xl p-5 space-y-4 ${
                isLocked ? "border-border opacity-80" : "border-primary/30"
              }`}>
                {/* Item header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {formatIcon(item.format)}
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    {/* Status badge */}
                    {isEnded ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                        <Lock className="h-2.5 w-2.5" /> 대회 종료
                      </span>
                    ) : status === "closed" ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive flex items-center gap-1">
                        <Lock className="h-2.5 w-2.5" /> 마감됨
                        {item.deadlineAt && <span className="ml-0.5">· {formatDeadline(item.deadlineAt)}</span>}
                      </span>
                    ) : status === "not-open" ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> 오픈 예정
                        {item.openAt && <span className="ml-0.5">· {formatDeadline(item.openAt)}</span>}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-1">
                        <CalendarCheck className="h-2.5 w-2.5" /> 제출 가능
                        {item.deadlineAt && <span className="ml-0.5">· {formatDeadline(item.deadlineAt)} 마감</span>}
                      </span>
                    )}
                    {/* Saved indicator */}
                    {!isLocked && allItemSaved && requiredFields.length > 0 && (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> 저장됨
                      </span>
                    )}
                    {!isLocked && !allItemSaved && savedRequiredCount > 0 && (
                      <span className="text-xs text-orange-500 font-medium">
                        {savedRequiredCount}/{requiredFields.length} 저장
                      </span>
                    )}
                  </div>
                </div>

                {item.note && (
                  <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    {item.note}
                  </p>
                )}

                {/* Locked overlay message */}
                {isLocked && !isEnded && status === "closed" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    이 항목의 제출 기간이 종료되었습니다. 기존 저장 내용은 아래 제출 이력에서 확인할 수 있습니다.
                  </div>
                )}
                {isLocked && !isEnded && status === "not-open" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    이 항목의 제출 기간이 아직 시작되지 않았습니다.
                    {item.openAt && ` ${formatDeadline(item.openAt)}부터 제출 가능합니다.`}
                  </div>
                )}

                {/* Fields */}
                {fields.length > 0 && (
                  <div className="space-y-4">
                    {fields.map((field) => {
                      const ck = `${item.key}.${field.key}`;
                      const existing = submissions.find((s) => s.itemKey === ck);
                      const isSaved = !!(existing?.value);
                      const isAutoFill = field.autoFill === "userName";
                      const autoFillValue = isAutoFill
                        ? (userTeamName ?? currentUser.nickname ?? currentUser.name ?? "")
                        : "";
                      const displayValue = isAutoFill
                        ? autoFillValue
                        : values[ck] !== undefined
                          ? values[ck]
                          : existing?.value ?? "";

                      return (
                        <div key={field.key} className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">
                              {field.label}
                              {field.required && <span className="text-destructive ml-0.5">*</span>}
                            </Label>
                            {isAutoFill && (
                              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Lock className="h-2.5 w-2.5" /> 자동 입력
                              </span>
                            )}
                            {isSaved && !isAutoFill && (
                              <span className="text-xs text-green-600 flex items-center gap-0.5">
                                <CheckCircle2 className="h-3 w-3" /> 저장됨
                              </span>
                            )}
                          </div>
                          <FieldInput
                            field={field}
                            value={displayValue}
                            fileName={getFieldFileName(item.key, field.key)}
                            disabled={isLocked || isAutoFill}
                            onChange={(val) => setFieldValue(item.key, field.key, val)}
                            onFileChange={(file) => setFieldFile(item.key, field, file)}
                            fileInputRef={(el) => { fileInputRefs.current[ck] = el; }}
                          />
                        </div>
                      );
                    })}

                    {!isLocked && (
                      <Button size="sm" variant="outline" onClick={() => handleSaveItem(item.key, item.title, fields)} className="cursor-pointer">
                        저장
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Fallback form (no structured items) */}
      {!hasItems && !isEnded && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" /> 제출 폼
          </h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm">제출 URL</Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="url" placeholder="https://" value={fallbackUrl} onChange={(e) => setFallbackUrl(e.target.value)} className="pl-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">추가 메모 (선택)</Label>
              <Textarea placeholder="제출 관련 추가 내용..." value={fallbackNote} onChange={(e) => setFallbackNote(e.target.value)} rows={3} />
            </div>
            {submissions.find((s) => s.itemKey === "submission") && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> 저장됨 ({formatDateTime(submissions.find((s) => s.itemKey === "submission")!.submittedAt)})
              </p>
            )}
            <Button size="sm" variant="outline" onClick={() => {
              if (!fallbackUrl.trim() && !fallbackNote.trim()) { toast({ title: "내용을 입력해주세요", variant: "destructive" }); return; }
              addSubmission({ hackathonSlug: detail.slug, itemKey: "submission", value: fallbackUrl.trim() || fallbackNote.trim(), notes: fallbackNote.trim() || undefined });
              toast({ title: "저장 완료" });
            }} className="cursor-pointer">저장</Button>
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-sm">제출 전 체크리스트</h3>

        {hasItems && !allRequiredSaved && !isEnded && (
          <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            현재 제출 가능한 항목의 필수 내용(*)을 먼저 저장해야 체크리스트를 완료할 수 있습니다.
          </div>
        )}

        {checklistItems.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              if (!allRequiredSaved || isEnded) return;
              setChecklist((prev) => prev.map((v, idx) => idx === i ? !v : v));
            }}
            disabled={!allRequiredSaved || isEnded}
            className={`flex items-center gap-3 w-full text-left text-sm ${
              allRequiredSaved && !isEnded ? "cursor-pointer" : "cursor-not-allowed opacity-50"
            }`}
          >
            {checklist[i]
              ? <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              : <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
            <span className={checklist[i] ? "line-through text-muted-foreground" : ""}>{item}</span>
          </button>
        ))}

        {!isEnded && (
          <Button
            className="w-full cursor-pointer mt-2"
            disabled={!allChecked || !allRequiredSaved}
            onClick={() => {
              if (allChecked && allRequiredSaved) {
                toast({ title: "최종 제출 완료!", description: "제출이 성공적으로 접수되었습니다. 결과는 심사 후 리더보드에 공개됩니다." });
              }
            }}
          >
            {!allRequiredSaved
              ? "제출 가능 항목의 필수 내용을 먼저 저장해주세요"
              : allChecked
                ? "최종 제출하기"
                : `체크리스트를 완료해주세요 (${checklist.filter(Boolean).length}/${checklistItems.length})`}
          </Button>
        )}

        {isEnded && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
            <Lock className="h-4 w-4" />
            종료된 해커톤은 최종 제출이 불가합니다.
          </div>
        )}
      </div>

      {/* Submission history — human-readable labels */}
      {submissions.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-3">제출 이력</h3>
          <div className="space-y-2">
            {[...submissions].reverse().map((s) => {
              const label = getSubmissionLabel(s.itemKey, submit.submissionItems ?? []);
              return (
                <div key={s.id} className="flex items-start justify-between text-xs py-2 border-b border-border last:border-0">
                  <div>
                    <span className="font-medium text-foreground">{label}</span>
                    <p className="text-muted-foreground mt-0.5 truncate max-w-xs flex items-center gap-1">
                      {s.fileName && <FileText className="h-3 w-3 shrink-0" />}
                      {s.fileName ?? s.value}
                    </p>
                  </div>
                  <span className="text-muted-foreground whitespace-nowrap ml-4">
                    {formatDateTime(s.submittedAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
