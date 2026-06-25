"use client";

import { ErrorState } from "@/shared/components/feedback/ErrorState";

/** Error boundary scoped to the questions list segment. */
export default function QuestionsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Couldn't load questions"
      message="An error occurred while loading the community feed."
      onRetry={reset}
    />
  );
}
