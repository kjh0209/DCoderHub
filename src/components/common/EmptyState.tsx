import { Button } from "@/components/ui/button";
import { SearchX, Users, Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "🔍": SearchX,
  "👥": Users,
  "📭": Inbox,
};

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon = "📭", title, description, action }: EmptyStateProps) {
  const Icon = ICON_MAP[icon] ?? Inbox;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>}
      {action && (
        <Button onClick={action.onClick} variant="outline" className="cursor-pointer">
          {action.label}
        </Button>
      )}
    </div>
  );
}
