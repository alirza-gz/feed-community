"use client";

import Link from "next/link";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Spinner } from "@/shared/components/ui/Spinner";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { useMyQuestions } from "@/features/questions/queries";
import { useMyAnswers } from "@/features/answers/queries";
import { QuestionCard } from "@/features/questions/components/QuestionCard";
import { ActivityTimeline } from "./ActivityTimeline";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4">
      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {value}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </Card>
  );
}

/**
 * Client island for the dashboard. Reads the per-user `/me` feeds via React
 * Query (kept client-side because the data is personal and interactive), then
 * derives summary stats and an activity timeline from them.
 */
export function DashboardView() {
  const questionsQuery = useMyQuestions();
  const answersQuery = useMyAnswers();

  const isPending = questionsQuery.isPending || answersQuery.isPending;
  const isError = questionsQuery.isError || answersQuery.isError;

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load your activity"
        message="There was a problem loading your questions and answers."
        onRetry={() => {
          questionsQuery.refetch();
          answersQuery.refetch();
        }}
      />
    );
  }

  const questions = questionsQuery.data ?? [];
  const answers = answersQuery.data ?? [];
  const answersReceived = questions.reduce((sum, q) => sum + q.answerCount, 0);

  const hasActivity = questions.length > 0 || answers.length > 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Questions asked" value={questions.length} />
        <Stat label="Answers written" value={answers.length} />
        <Stat label="Answers received" value={answersReceived} />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          My questions
        </h2>
        {questions.length === 0 ? (
          <EmptyState
            icon="❓"
            title="You haven't asked anything yet"
            description="Start a conversation with the community."
            action={
              <Link href="/questions/new">
                <Button>Ask a question</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Recent activity
        </h2>
        {hasActivity ? (
          <ActivityTimeline questions={questions} answers={answers} />
        ) : (
          <EmptyState
            icon="🗂️"
            title="No activity yet"
            description="Your questions and answers will appear here."
          />
        )}
      </section>
    </div>
  );
}
