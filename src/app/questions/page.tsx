import { Suspense } from "react";
import Link from "next/link";
import { QuestionFilters } from "@/features/questions/components/QuestionFilters";
import { QuestionFeed } from "@/features/questions/components/QuestionFeed";
import { QuestionListSkeleton } from "@/features/questions/components/QuestionListSkeleton";

export const metadata = {
  title: "Questions",
};

/**
 * Questions list page.
 *
 * Rendering strategy: STATIC shell + client-side data fetching. The page
 * itself is prerenderable because the feed logic lives in client components,
 * while search/tag/sort stay shareable in the URL and drive the query cache.
 *
 * `useSearchParams` (inside the client children) requires a Suspense boundary,
 * which also gives us a clean server-rendered loading fallback.
 */
export default function QuestionsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Community Questions
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Ask anything and learn from the community.
          </p>
        </div>
        <Link
          href="/questions/new"
          className="hidden h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 sm:inline-flex"
        >
          Ask question
        </Link>
      </div>

      <Suspense fallback={<FilterFallback />}>
        <QuestionFilters />
      </Suspense>

      <Suspense fallback={<QuestionListSkeleton />}>
        <QuestionFeed />
      </Suspense>
    </div>
  );
}

function FilterFallback() {
  return (
    <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
  );
}
