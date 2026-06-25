"use client";

import { useEffect } from "react";
import { Button } from "@/shared/components/ui/Button";

/**
 * Route-level Error Boundary for the app segment. Next.js renders this when a
 * child server/client component throws during rendering or data loading.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real app this would report to Sentry/Datadog/etc.
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl" aria-hidden>
        💥
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
        An unexpected error occurred while rendering this page.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
