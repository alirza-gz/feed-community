import Link from "next/link";
import { Badge } from "@/shared/components/ui/Badge";
import { Card } from "@/shared/components/ui/Card";
import { colorFromString, formatRelativeTime } from "@/shared/lib/format";
import type { Question } from "../types";

/** A single row in the questions feed. Pure presentational component. */
export function QuestionCard({ question }: { question: Question }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href={`/questions/${question.id}`}
            className="line-clamp-2 text-base font-semibold text-slate-900 hover:text-brand-600 dark:text-slate-100"
          >
            {question.title}
          </Link>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {question.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Answer count — a key feed metric, emphasised on the right. */}
        <div className="flex shrink-0 flex-col items-center rounded-lg bg-slate-50 px-3 py-1.5 dark:bg-slate-800">
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {question.answerCount}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {question.answerCount === 1 ? "answer" : "answers"}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span
          className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold text-white"
          style={{ backgroundColor: colorFromString(question.author.name) }}
          aria-hidden
        >
          {question.author.name.charAt(0)}
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {question.author.name}
        </span>
        <span aria-hidden>·</span>
        <time dateTime={question.createdAt}>
          {formatRelativeTime(question.createdAt)}
        </time>
      </div>
    </Card>
  );
}
