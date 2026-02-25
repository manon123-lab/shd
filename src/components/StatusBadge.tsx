import type { DonationStatus } from "@/lib/store";

const statusStyles: Record<DonationStatus, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  accepted: "bg-primary/15 text-primary border-primary/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
  completed: "bg-accent text-accent-foreground border-accent-foreground/20",
};

const statusIcons: Record<DonationStatus, string> = {
  pending: "⏳",
  accepted: "✅",
  rejected: "❌",
  completed: "🎉",
};

const StatusBadge = ({ status }: { status: DonationStatus }) => (
  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[status]}`}>
    <span className="text-[10px]">{statusIcons[status]}</span>
    {status}
  </span>
);

export default StatusBadge;

const categoryColors: Record<string, string> = {
  cooked: "bg-secondary/15 text-secondary",
  raw: "bg-primary/15 text-primary",
  packaged: "bg-info/15 text-foreground",
  bakery: "bg-warning/15 text-warning",
  dairy: "bg-accent text-accent-foreground",
  fruits: "bg-success/15 text-success",
};

const categoryIcons: Record<string, string> = {
  cooked: "🍛",
  raw: "🥕",
  packaged: "📦",
  bakery: "🍞",
  dairy: "🥛",
  fruits: "🍎",
};

export const CategoryBadge = ({ category }: { category: string }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${categoryColors[category] || 'bg-muted text-muted-foreground'}`}>
    <span className="text-[10px]">{categoryIcons[category] || '🍽️'}</span>
    {category}
  </span>
);

const urgencyColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/15 text-warning",
  high: "bg-secondary/15 text-secondary",
  critical: "bg-destructive/15 text-destructive animate-pulse",
};

export const UrgencyBadge = ({ urgency }: { urgency: string }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${urgencyColors[urgency] || 'bg-muted text-muted-foreground'}`}>
    {urgency === 'critical' && '🚨'} {urgency} priority
  </span>
);
