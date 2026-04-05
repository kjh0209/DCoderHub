"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, LogIn, UserPlus, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const GOOGLE_CONFIGURED = !!GOOGLE_CLIENT_ID;

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Tab = "login" | "register";
type RegisterStep = "form" | "email-verify";

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const [step, setStep] = useState<RegisterStep>("form");
  const [emailCode, setEmailCode] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const login = useStore((s) => s.login);
  const register = useStore((s) => s.register);
  const loginWithGoogle = useStore((s) => s.loginWithGoogle);
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const info = await res.json();
        const user = loginWithGoogle(info.name ?? info.email, info.email);
        toast.success(`Google로 로그인했습니다, ${user.name}님!`);
        reset(); onClose(); onSuccess?.();
      } catch {
        toast.error("Google 로그인에 실패했습니다.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google 로그인에 실패했습니다.");
      setGoogleLoading(false);
    },
  });

  const reset = () => {
    setName(""); setEmail(""); setPassword("");
    setError(""); setStep("form"); setSending(false);
    setEmailCode(""); setEmailInput("");
  };

  const handleLogin = () => {
    if (!email.trim()) { setError("이메일을 입력해주세요."); return; }
    if (!password) { setError("비밀번호를 입력해주세요."); return; }
    const user = login(email.trim(), password);
    if (!user) { setError("이메일 또는 비밀번호가 올바르지 않습니다."); return; }
    toast.success(`반갑습니다, ${user.name}님!`);
    reset(); onClose(); onSuccess?.();
  };

  const sendEmailCode = async (targetEmail: string, code: string) => {
    const res = await fetch("/api/send-verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: targetEmail, code }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "이메일 발송에 실패했습니다.");
    }
  };

  // Step 1: validate → send real email OTP
  const handleRegisterStep1 = async () => {
    if (!name.trim()) { setError("이름을 입력해주세요."); return; }
    if (!email.trim() || !email.includes("@")) { setError("올바른 이메일을 입력해주세요."); return; }
    if (password.length < 6) { setError("비밀번호는 6자 이상이어야 합니다."); return; }

    const users = useStore.getState().users;
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setError("이미 사용 중인 이메일입니다."); return;
    }

    const code = generateCode();
    setSending(true);
    setError("");
    try {
      await sendEmailCode(email.trim(), code);
      setEmailCode(code);
      setEmailInput("");
      setStep("email-verify");
      toast.success("인증 코드를 이메일로 발송했습니다.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "이메일 발송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  // Step 2: verify email OTP → register
  const handleEmailVerify = () => {
    if (emailInput.trim() !== emailCode) {
      setError("인증 코드가 올바르지 않습니다."); return;
    }
    const result = register(name.trim(), email.trim(), password);
    if ("error" in result) { setError(result.error); return; }
    toast.success(`${result.name}님, 환영합니다!`);
    reset(); onClose(); onSuccess?.();
  };

  const handleResend = async () => {
    const code = generateCode();
    setSending(true);
    try {
      await sendEmailCode(email.trim(), code);
      setEmailCode(code);
      setEmailInput("");
      toast.success("인증 코드를 재발송했습니다.");
    } catch {
      toast.error("이메일 재발송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">로그인 / 회원가입</DialogTitle>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] font-semibold text-base">
                DCoderHub 계정
              </h2>
              <p className="text-xs text-muted-foreground">팀 지원 및 관리를 위해 로그인하세요</p>
            </div>
          </div>

          {tab === "login" || step === "form" ? (
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {(["login", "register"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(""); setStep("form"); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    tab === t
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "login" ? (
                    <><LogIn className="h-3.5 w-3.5" /> 로그인</>
                  ) : (
                    <><UserPlus className="h-3.5 w-3.5" /> 회원가입</>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => { setStep("form"); setError(""); }} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">이메일 인증</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.div key="login" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} className="pl-9" onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="password" placeholder="비밀번호 입력" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="pl-9" onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }} />
                  </div>
                </div>
                {error && <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>}
                <Button className="w-full gap-2 cursor-pointer" onClick={handleLogin}>
                  <LogIn className="h-4 w-4" /> 로그인
                </Button>
              </motion.div>
            ) : step === "form" ? (
              <motion.div key="register-form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">이름</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="홍길동" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="password" placeholder="6자 이상 입력" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="pl-9" onKeyDown={(e) => { if (e.key === "Enter") handleRegisterStep1(); }} />
                  </div>
                </div>
                {error && <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>}
                <Button className="w-full gap-2 cursor-pointer" onClick={handleRegisterStep1} disabled={sending}>
                  <Mail className="h-4 w-4" /> {sending ? "발송 중..." : "이메일 인증 코드 발송"}
                </Button>
              </motion.div>
            ) : (
              <motion.div key="email-verify" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center space-y-1">
                  <Mail className="h-6 w-6 text-blue-500 mx-auto" />
                  <p className="text-sm font-medium">{email}</p>
                  <p className="text-xs text-muted-foreground">로 인증 코드를 발송했습니다.</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">인증 코드 (6자리)</Label>
                  <Input
                    placeholder="000000"
                    value={emailInput}
                    onChange={(e) => { setEmailInput(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                    className="text-center text-lg tracking-widest font-mono"
                    maxLength={6}
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter" && emailInput.length === 6) handleEmailVerify(); }}
                  />
                </div>
                {error && <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>}
                <Button className="w-full gap-2 cursor-pointer" onClick={handleEmailVerify} disabled={emailInput.length !== 6}>
                  <CheckCircle2 className="h-4 w-4" /> 인증 완료 및 가입
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  코드를 받지 못하셨나요?{" "}
                  <button className="text-primary underline cursor-pointer" onClick={handleResend} disabled={sending}>
                    {sending ? "발송 중..." : "재발송"}
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google / divider — only on login or register form step */}
          {(tab === "login" || step === "form") && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">또는</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {GOOGLE_CONFIGURED ? (
                <Button
                  variant="outline"
                  className="w-full gap-2 cursor-pointer"
                  onClick={() => { setGoogleLoading(true); googleLogin(); }}
                  disabled={googleLoading}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {googleLoading ? "Google 인증 중..." : "Google로 계속하기"}
                </Button>
              ) : (
                <div className="text-xs text-muted-foreground text-center bg-muted/50 rounded-lg p-3">
                  Google 로그인을 사용하려면{" "}
                  <code className="font-mono bg-muted px-1 rounded">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>를{" "}
                  <code className="font-mono bg-muted px-1 rounded">.env.local</code>에 설정해주세요.
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground">
                {tab === "login" ? (
                  <>계정이 없으신가요?{" "}
                    <button onClick={() => { setTab("register"); setError(""); }} className="text-primary underline cursor-pointer">회원가입</button>
                  </>
                ) : (
                  <>이미 계정이 있으신가요?{" "}
                    <button onClick={() => { setTab("login"); setError(""); }} className="text-primary underline cursor-pointer">로그인</button>
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
