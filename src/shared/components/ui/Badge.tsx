import { cn } from "@/shared/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  active?: boolean;
}

export function Badge({ children, className, interactive, active }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        active
          ? "bg-brand-600 text-white"
          : "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100",
        interactive && "cursor-pointer hover:bg-brand-100 dark:hover:bg-brand-500/25",
        className,
      )}
    >
      {children}
    </span>
  );
}
