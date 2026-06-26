import Link from "next/link";
import { Card } from "@/shared/components/ui/Card";
import { formatRelativeTime } from "@/shared/lib/format";
import type { Question } from "@/features/questions/types";
import type { Answer } from "@/features/answers/types";

type TimelineEvent =
  | { kind: "question"; at: string; question: Question }
  | { kind: "answer"; at: string; answer: Answer };

/**
 * Unified, reverse-chronological timeline of the user's questions and answers.
 * Both event types are merged into one stream so the dashboard reads as a
 * single activity feed rather than two disconnected lists.
 */
export function ActivityTimeline({
  questions,
  answers,
}: {
  questions: Question[];
  answers: Answer[];
}) {
  const events: TimelineEvent[] = [
    ...questions.map(
      (question): TimelineEvent => ({
        kind: "question",
        at: question.createdAt,
        question,
      }),
    ),
    ...answers.map(
      (answer): TimelineEvent => ({
        kind: "answer",
        at: answer.createdAt,
        answer,
      }),
    ),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <ol className="space-y-3">
      {events.map((event) => (
        <li key={`${event.kind}-${eventId(event)}`}>
          <Card className="flex items-start gap-3 p-4">
            <span
              className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-sm dark:bg-slate-800"
              aria-hidden
            >
              {event.kind === "question" ? "❓" : "💬"}
            </span>
            <div className="min-w-0 flex-1">
              {event.kind === "question" ? (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  You asked{" "}
                  <Link
                    href={`/questions/${event.question.id}`}
                    className="font-medium text-slate-900 hover:text-brand-600 dark:text-slate-100"
                  >
                    {event.question.title}
                  </Link>
                </p>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  You answered a{" "}
                  <Link
                    href={`/questions/${event.answer.questionId}`}
                    className="font-medium text-slate-900 hover:text-brand-600 dark:text-slate-100"
                  >
                    question
                  </Link>
                  <span className="mt-1 line-clamp-2 text-slate-500 dark:text-slate-400">
                    “{event.answer.body}”
                  </span>
                </p>
              )}
              <time
                dateTime={event.at}
                className="mt-1 block text-xs text-slate-400"
              >
                {formatRelativeTime(event.at)}
              </time>
            </div>
          </Card>
        </li>
      ))}
    </ol>
  );
}

function eventId(event: TimelineEvent): string {
  return event.kind === "question" ? event.question.id : event.answer.id;
}
