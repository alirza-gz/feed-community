import Link from "next/link";
import { Card } from "@/shared/components/ui/Card";
import type { Question } from "../types";

/** Sidebar list of questions related by tag. Pure/server component. */
export function RelatedQuestions({ questions }: { questions: Question[] }) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Related questions
      </h2>

      {questions.length === 0 ? (
        <p className="text-sm text-slate-400">No related questions yet.</p>
      ) : (
        <ul className="space-y-3">
          {questions.map((q) => (
            <li key={q.id}>
              <Link
                href={`/questions/${q.id}`}
                className="line-clamp-2 text-sm font-medium text-slate-700 hover:text-brand-600 dark:text-slate-300"
              >
                {q.title}
              </Link>
              <span className="text-xs text-slate-400">
                {q.answerCount} {q.answerCount === 1 ? "answer" : "answers"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
