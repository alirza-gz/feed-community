import Link from "next/link";
import { Card } from "@/shared/components/ui/Card";
import { CreateQuestionForm } from "@/features/questions/components/CreateQuestionForm";

export const metadata = {
  title: "Ask a question",
};

/**
 * Create-question page.
 *
 * Rendering strategy: STATIC. This route is a form shell with no per-request
 * data, so Next.js can prerender it at build time and serve it instantly. All
 * dynamic behaviour (validation, submission) lives in the client form island.
 */
export default function NewQuestionPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <Link
          href="/questions"
          className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400"
        >
          ← Back to questions
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Ask a question
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Share your problem with the community and get help.
        </p>
      </div>

      <Card className="p-6">
        <CreateQuestionForm />
      </Card>
    </div>
  );
}
