import Link from "next/link";

/** App-wide top navigation. Server component (no interactivity needed here). */
export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="container flex h-14 max-w-5xl items-center justify-between">
        <Link href="/questions" className="flex items-center gap-2 font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white">
            Q
          </span>
          <span className="text-slate-900 dark:text-slate-100">Community</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/questions"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-transparent px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Questions
          </Link>
          <Link
            href="/questions/new"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-brand-600 px-3 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            Ask question
          </Link>
        </nav>
      </div>
    </header>
  );
}
