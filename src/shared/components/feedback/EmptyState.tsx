interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

/** Reusable empty-state surface (no results, no answers, etc.). */
export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <div className="mb-3 text-4xl" aria-hidden>
        {icon ?? "🗂️"}
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
