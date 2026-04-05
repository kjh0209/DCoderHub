"use client";

import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

function toast(options: ToastOptions) {
  if (options.variant === "destructive") {
    sonnerToast.error(options.title ?? "오류", {
      description: options.description,
    });
  } else {
    sonnerToast.success(options.title ?? "완료", {
      description: options.description,
    });
  }
}

export function useToast() {
  return { toast };
}
