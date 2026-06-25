import { QuestionListSkeleton } from "@/features/questions/components/QuestionListSkeleton";

/** Route-level loading UI shown while the page segment streams in. */
export default function Loading() {
  return (
    <div className="space-y-5">
      <div className="h-8 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <QuestionListSkeleton />
    </div>
  );
}
