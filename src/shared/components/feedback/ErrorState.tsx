"use client";

import { Button } from "@/shared/components/ui/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** Reusable inline error surface for failed data fetches. */
export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900/50 dark:bg-red-950/30"
    >
      <div className="mb-3 text-4xl" aria-hidden>
        ⚠️
      </div>
      <h3 className="text-base font-semibold text-red-800 dark:text-red-200">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-red-600 dark:text-red-300">
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
