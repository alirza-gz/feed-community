import { cn } from "@/shared/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-slate-300 border-t-brand-600",
        className ?? "h-5 w-5",
      )}
    />
  );
}
