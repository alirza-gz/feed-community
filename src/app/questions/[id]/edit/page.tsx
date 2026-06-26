import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getQuestion } from "@/server/db";
import { Card } from "@/shared/components/ui/Card";
import { CreateQuestionForm } from "@/features/questions/components/CreateQuestionForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const question = getQuestion(id);
  if (!question) return { title: "Question not found" };
  return { title: `Edit · ${question.title}` };
}

/**
 * Edit-question page.
 *
 * Rendering strategy: DYNAMIC server rendering. We read the current question
 * on the server and hand it to the shared form island as prefilled defaults,
 * so the editor paints fully populated with no client-side loading state.
 */
export default async function EditQuestionPage({ params }: PageProps) {
  const { id } = await params;
  const question = getQuestion(id);

  if (!question) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <Link
          href={`/questions/${question.id}`}
          className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400"
        >
          ← Back to question
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Edit question
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Update your question to make it clearer for the community.
        </p>
      </div>

      <Card className="p-6">
        <CreateQuestionForm question={question} />
      </Card>
    </div>
  );
}
