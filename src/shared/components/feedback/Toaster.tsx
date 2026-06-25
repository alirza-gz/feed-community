"use client";

import { useEffect } from "react";
import { useUiStore } from "@/shared/store/ui-store";
import { cn } from "@/shared/lib/cn";

/** Renders transient toasts from the global UI store. */
export function Toaster() {
  const toasts = useUiStore((s) => s.toasts);
  const dismiss = useUiStore((s) => s.dismissToast);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          variant={toast.variant}
          onDismiss={dismiss}
        />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  message,
  variant,
  onDismiss,
}: {
  id: number;
  message: string;
  variant: "success" | "error";
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), 3500);
    return () => clearTimeout(t);
  }, [id, onDismiss]);

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto w-full max-w-sm rounded-lg px-4 py-3 text-sm text-white shadow-lg",
        variant === "success" ? "bg-slate-900" : "bg-red-600",
      )}
    >
      {message}
    </div>
  );
}
