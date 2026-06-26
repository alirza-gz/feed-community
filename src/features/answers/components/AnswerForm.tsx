"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Textarea } from "@/shared/components/ui/Input";
import { useUiStore } from "@/shared/store/ui-store";
import { useCreateAnswer } from "../queries";

const MIN_LENGTH = 20;

/** Compose box for posting an answer. Uses optimistic mutation. */
export function AnswerForm({ questionId }: { questionId: string }) {
  const [body, setBody] = useState("");
  const pushToast = useUiStore((s) => s.pushToast);
  const { mutate, isPending } = useCreateAnswer(questionId);

  const trimmed = body.trim();
  const isValid = trimmed.length >= MIN_LENGTH;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    mutate(
      { questionId, body: trimmed },
      {
        onSuccess: () => {
          setBody("");
          pushToast("Your answer was posted");
        },
        onError: () => pushToast("Failed to post answer", "error"),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label
        htmlFor="answer-body"
        className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
      >
        Your answer
      </label>
      <Textarea
        id="answer-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Share what you know…"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {trimmed.length < MIN_LENGTH
            ? `${MIN_LENGTH - trimmed.length} more characters needed`
            : "Looks good"}
        </span>
        <Button type="submit" disabled={!isValid || isPending}>
          {isPending ? "Posting…" : "Post answer"}
        </Button>
      </div>
    </form>
  );
}
