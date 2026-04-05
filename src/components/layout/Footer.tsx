import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-16">
      <div className="container mx-auto px-4 max-w-7xl py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded gradient-primary flex items-center justify-center">
            <Code2 className="h-2.5 w-2.5 text-white" />
          </div>
          <span className="font-[family-name:var(--font-heading)] font-semibold text-sm">DCoderHub</span>
          <span className="text-xs text-muted-foreground">© 2026</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>개발자 커뮤니티 해커톤 플랫폼</span>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border font-mono text-[10px]">
              ⌘K
            </kbd>
            <span>커맨드 팔레트</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
