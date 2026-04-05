import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "ongoing" | "ended" | "upcoming" | "open" | "closed";

const STATUS_CONFIG: Record<StatusType, { label: string; className: string }> = {
  ongoing: { label: "진행중", className: "bg-blue-500 text-white hover:bg-blue-600" },
  ended: { label: "종료", className: "bg-gray-400 text-white hover:bg-gray-500" },
  upcoming: { label: "예정", className: "bg-green-500 text-white hover:bg-green-600" },
  open: { label: "모집중", className: "bg-green-500 text-white hover:bg-green-600" },
  closed: { label: "마감", className: "bg-gray-400 text-white hover:bg-gray-500" },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
