"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Moon, Sun, Code2, Search, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthModal } from "@/components/auth/AuthModal";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

const NAV_ITEMS = [
  { label: "해커톤", href: "/hackathons" },
  { label: "팀빌딩", href: "/camp" },
  { label: "랭킹", href: "/rankings" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { theme, toggleTheme } = useStore();
  const currentUser = useStore((s) => s.currentUser);
  const logout = useStore((s) => s.logout);

  const openPalette = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 max-w-7xl h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
              <Code2 className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-[family-name:var(--font-heading)] font-bold text-base tracking-tight">
              DCoderHub
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150",
                  pathname.startsWith(item.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* Search shortcut (desktop) */}
            <button
              onClick={openPalette}
              className="hidden lg:flex items-center gap-2 h-8 px-3 rounded-lg border border-border bg-muted/50 text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="커맨드 팔레트 열기"
            >
              <Search className="h-3 w-3" />
              <span>검색</span>
              <kbd className="ml-1 inline-flex h-4 items-center gap-0.5 rounded border border-border bg-background px-1 font-mono text-[10px]">
                ⌘K
              </kbd>
            </button>

            {/* Dark mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg h-8 w-8 cursor-pointer"
              aria-label="테마 전환"
            >
              {theme === "dark" ? (
                <Sun className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
            </Button>

            {/* Auth button (desktop) */}
            {currentUser ? (
              <div className="hidden md:flex items-center gap-1.5">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 h-8 px-2.5 rounded-lg bg-muted/60 hover:bg-muted text-xs font-medium transition-colors"
                >
                  <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-foreground">{currentUser.nickname || currentUser.name}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
                  aria-label="로그아웃"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAuthOpen(true)}
                className="hidden md:flex gap-1.5 h-8 text-xs cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                로그인
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className="md:hidden"
                render={<Button variant="ghost" size="icon" className="h-8 w-8" />}
              >
                <Menu className="h-4 w-4" />
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
                    <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
                      <Code2 className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-[family-name:var(--font-heading)] font-bold text-sm">
                      DCoderHub
                    </span>
                  </div>

                  {/* Mobile user info */}
                  {currentUser && (
                    <div className="px-4 py-3 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {currentUser.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{currentUser.name}</p>
                          <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <nav className="flex flex-col gap-1 p-3 flex-1">
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          pathname.startsWith(item.href)
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="p-4 border-t border-border space-y-2">
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      {theme === "dark" ? "라이트 모드" : "다크 모드"}
                    </button>
                    {currentUser ? (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          <User className="h-4 w-4" />
                          내 프로필
                        </Link>
                        <button
                          onClick={() => { logout(); setMobileOpen(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          로그아웃
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => { setMobileOpen(false); setAuthOpen(true); }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <LogIn className="h-4 w-4" />
                        로그인 / 회원가입
                      </button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
