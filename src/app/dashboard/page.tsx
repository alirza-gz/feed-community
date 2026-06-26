import { DashboardView } from "@/features/dashboard/components/DashboardView";

export const metadata = {
  title: "My dashboard",
};

/**
 * Dashboard page.
 *
 * Rendering strategy: STATIC shell + client island. The page chrome is
 * prerendered, while the personal `/me` data is fetched on the client through
 * React Query — it's user-specific and interactive (refetch, live updates from
 * mutations elsewhere), so it doesn't belong in the server-rendered HTML.
 */
export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          My dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Your questions, answers, and recent activity.
        </p>
      </div>

      <DashboardView />
    </div>
  );
}
