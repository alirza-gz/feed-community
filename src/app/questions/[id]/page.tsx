import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getQuestion, getRelatedQuestions } from "@/server/db";
import { QuestionDetailView } from "@/features/questions/components/QuestionDetailView";
import { RelatedQuestions } from "@/features/questions/components/RelatedQuestions";
import { LazyAnswerSection } from "@/features/answers/components/LazyAnswerSection";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Question detail page.
 *
 * Rendering strategy: DYNAMIC server rendering. The question body + related
 * questions are read from the data layer on the server and streamed as HTML —
 * good for SEO/shareability and a fast first paint. The interactive answers
 * area is a client island (lazily imported) layered on top.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const question = getQuestion(id);
  if (!question) return { title: "Question not found" };
  return {
    title: question.title,
    description: question.description.slice(0, 150),
  };
}

export default async function QuestionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const question = getQuestion(id);

  // Triggers the segment's not-found.tsx (404).
  if (!question) notFound();

  const related = getRelatedQuestions(id);

  return (
    <div className="space-y-6">
      <Link
        href="/questions"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400"
      >
        ← Back to questions
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <QuestionDetailView question={question} />
          {/* Lazily-loaded, client-only answers island. */}
          <LazyAnswerSection questionId={question.id} />
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <RelatedQuestions questions={related} />
        </aside>
      </div>
    </div>
  );
}
