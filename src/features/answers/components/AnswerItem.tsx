import { colorFromString, formatRelativeTime } from "@/shared/lib/format";
import { cn } from "@/shared/lib/cn";
import type { Answer } from "../types";

export function AnswerItem({ answer }: { answer: Answer }) {
  const isOptimistic = answer.id.startsWith("optimistic-");

  return (
    <li
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900",
        isOptimistic && "opacity-60",
      )}
    >
      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
        {answer.body}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span
          className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold text-white"
          style={{ backgroundColor: colorFromString(answer.author.name) }}
          aria-hidden
        >
          {answer.author.name.charAt(0)}
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {answer.author.name}
        </span>
        <span aria-hidden>·</span>
        <span>{isOptimistic ? "posting…" : formatRelativeTime(answer.createdAt)}</span>
        <span aria-hidden>·</span>
        <span>{answer.votes} votes</span>
      </div>
    </li>
  );
}
