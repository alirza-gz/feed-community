"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";
import { Spinner } from "@/shared/components/ui/Spinner";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { useQuestionsInfinite } from "../queries";
import { useQuestionFilters } from "../useQuestionFilters";
import { QuestionCard } from "./QuestionCard";
import { QuestionListSkeleton } from "./QuestionListSkeleton";

/**
 * The infinite-scrolling questions feed. Reads filters from the URL, feeds
 * them into the infinite query, and renders the full set of data-fetching
 * states: loading, error, empty, and "loading more".
 */
export function QuestionFeed() {
  const { filters, hasActiveFilters, resetFilters } = useQuestionFilters();

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useQuestionsInfinite(filters);

  // Sentinel element drives infinite scroll once it scrolls into view.
  const sentinelRef = useIntersectionObserver<HTMLDivElement>(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    { enabled: hasNextPage && !isFetchingNextPage },
  );

  if (isPending) return <QuestionListSkeleton />;

  if (isError) {
    return (
      <ErrorState
        message="We couldn't load the questions feed."
        onRetry={() => refetch()}
      />
    );
  }

  const questions = data.pages.flatMap((page) => page.items);
  const total = data.pages[0]?.total ?? 0;

  if (questions.length === 0) {
    return hasActiveFilters ? (
      <EmptyState
        icon="🔍"
        title="No matching questions"
        description="Try a different search term or clear the filters."
        action={
          <Button variant="secondary" onClick={resetFilters}>
            Clear filters
          </Button>
        }
      />
    ) : (
      <EmptyState
        icon="💬"
        title="No questions yet"
        description="Be the first to start a discussion in the community."
        action={
          <Link
            href="/questions/new"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            Ask the first question
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        {total} {total === 1 ? "question" : "questions"}
      </p>

      <div className="flex flex-col gap-3">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>

      {/* Infinite-scroll sentinel + fallback button for accessibility. */}
      <div ref={sentinelRef} className="flex justify-center py-6">
        {isFetchingNextPage ? (
          <Spinner />
        ) : hasNextPage ? (
          <Button variant="secondary" onClick={() => fetchNextPage()}>
            Load more
          </Button>
        ) : (
          <span className="text-sm text-slate-400">
            You&apos;ve reached the end
          </span>
        )}
      </div>
    </div>
  );
}
