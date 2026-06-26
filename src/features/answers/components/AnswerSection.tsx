"use client";

import { Spinner } from "@/shared/components/ui/Spinner";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { useAnswers } from "../queries";
import { AnswerItem } from "./AnswerItem";
import { AnswerForm } from "./AnswerForm";

/**
 * Client island for the answers area of a question detail page. Answers are
 * loaded client-side (rather than with the server-rendered question body)
 * because they are interactive — new answers are posted with an optimistic
 * update and the list must stay live without a full page reload.
 */
export function AnswerSection({ questionId }: { questionId: string }) {
  const { data: answers, isPending, isError, refetch } = useAnswers(questionId);

  return (
    <section className="space-y-4">
      <div className="border-b border-slate-200 pb-2 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {isPending ? "Answers" : `${answers?.length ?? 0} Answers`}
        </h2>
      </div>

      {isPending && (
        <div className="flex justify-center py-8">
          <Spinner className="h-6 w-6" />
        </div>
      )}

      {isError && (
        <ErrorState
          title="Couldn't load answers"
          message="There was a problem loading the answers."
          onRetry={() => refetch()}
        />
      )}

      {!isPending && !isError && answers && answers.length === 0 && (
        <EmptyState
          icon="✍️"
          title="No answers yet"
          description="Know the answer? Help out by being the first to respond."
        />
      )}

      {!isPending && !isError && answers && answers.length > 0 && (
        <ul className="space-y-3">
          {answers.map((answer) => (
            <AnswerItem key={answer.id} answer={answer} />
          ))}
        </ul>
      )}

      <AnswerForm questionId={questionId} />
    </section>
  );
}
