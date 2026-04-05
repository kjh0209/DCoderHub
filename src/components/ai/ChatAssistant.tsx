"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@/store/useStore";
import type { HackathonDetail } from "@/lib/types";

const DAILY_CHAT_LIMIT = 20;

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

interface ChatAssistantProps {
  hackathonDetail: HackathonDetail;
}

export function ChatAssistant({ hackathonDetail }: ChatAssistantProps) {
  const currentUser = useStore((s) => s.currentUser);
  const incrementChatUsage = useStore((s) => s.incrementChatUsage);
  const usageLog = useStore((s) => s.usageLog);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `안녕하세요! "${hackathonDetail.title}" 해커톤 AI 안내 도우미입니다. 대회 일정, 평가 기준, 상금 등 무엇이든 물어보세요!`,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().slice(0, 10);
  const usedToday = currentUser
    ? (usageLog.find((u) => u.userId === currentUser.id && u.date === today)?.chatCount ?? 0)
    : 0;
  const remaining = Math.max(0, DAILY_CHAT_LIMIT - usedToday);
  const isLimitReached = currentUser ? remaining === 0 : false;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (currentUser && !incrementChatUsage(currentUser.id)) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `오늘의 AI 채팅 횟수(${DAILY_CHAT_LIMIT}회)를 모두 사용했습니다. 내일 다시 이용해주세요.`,
          time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      return;
    }

    const userMsg: Message = {
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          hackathonSlug: hackathonDetail.slug,
          hackathonData: hackathonDetail,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "죄송합니다, 응답을 받지 못했습니다.",
          time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all z-50 ${open ? "hidden" : ""}`}
        aria-label="AI 어시스턴트 열기"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5 rounded-t-2xl">
              <div>
                <p className="font-semibold text-sm">AI 도우미</p>
                <p className="text-xs text-muted-foreground truncate max-w-52">{hackathonDetail.title}</p>
              </div>
              <div className="flex items-center gap-2">
                {currentUser && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    remaining === 0
                      ? "bg-destructive/15 text-destructive"
                      : remaining <= 5
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {remaining}/{DAILY_CHAT_LIMIT}
                  </span>
                )}
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-3">
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <Input
                placeholder={isLimitReached ? "오늘 사용량을 모두 소진했습니다" : "질문을 입력하세요..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                disabled={loading || isLimitReached}
                className="flex-1"
              />
              <Button size="icon" onClick={sendMessage} disabled={loading || !input.trim() || isLimitReached}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
