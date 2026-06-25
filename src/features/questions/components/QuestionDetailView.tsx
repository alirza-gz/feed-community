import { Badge } from "@/shared/components/ui/Badge";
import { Card } from "@/shared/components/ui/Card";
import { colorFromString, formatRelativeTime } from "@/shared/lib/format";
import type { Question } from "../types";

/** Presentational header/body for a single question. */
export function QuestionDetailView({ question }: { question: Question }) {
  return (
    <Card className="p-6">
      <div className="flex flex-wrap gap-1.5">
        {question.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
        {question.title}
      </h1>

      <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span
          className="grid h-6 w-6 place-items-center rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: colorFromString(question.author.name) }}
          aria-hidden
        >
          {question.author.name.charAt(0)}
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {question.author.name}
        </span>
        <span aria-hidden>·</span>
        <span>asked {formatRelativeTime(question.createdAt)}</span>
      </div>

      <div className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
        {question.description}
      </div>
    </Card>
  );
}
