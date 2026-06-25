import Link from "next/link";

/** Shown when a question id doesn't resolve (segment-level 404). */
export default function QuestionNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-5xl" aria-hidden>
        🔎
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Question not found
      </h1>
      <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
        This question may have been deleted or the link is incorrect.
      </p>
      <Link
        href="/questions"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
      >
        Browse all questions
      </Link>
    </div>
  );
}
