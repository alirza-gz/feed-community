"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Textarea } from "@/shared/components/ui/Input";
import { useUiStore } from "@/shared/store/ui-store";
import { colorFromString, formatRelativeTime } from "@/shared/lib/format";
import { cn } from "@/shared/lib/cn";
import { useDeleteAnswer, useUpdateAnswer } from "../queries";
import type { Answer } from "../types";

const MIN_LENGTH = 20;

export function AnswerItem({
  answer,
  questionId,
}: {
  answer: Answer;
  questionId: string;
}) {
  const isOptimistic = answer.id.startsWith("optimistic-");
  const pushToast = useUiStore((s) => s.pushToast);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(answer.body);

  const updateMutation = useUpdateAnswer(questionId);
  const deleteMutation = useDeleteAnswer(questionId);

  const trimmed = draft.trim();
  const isValid = trimmed.length >= MIN_LENGTH;

  function startEditing() {
    setDraft(answer.body);
    setIsEditing(true);
  }

  function handleSave() {
    if (!isValid) return;
    updateMutation.mutate(
      { id: answer.id, input: { body: trimmed } },
      {
        onSuccess: () => {
          setIsEditing(false);
          pushToast("Your answer was updated");
        },
        onError: () => pushToast("Failed to update answer", "error"),
      },
    );
  }

  function handleDelete() {
    if (!window.confirm("Delete this answer? This can't be undone.")) return;
    deleteMutation.mutate(answer.id, {
      onSuccess: () => pushToast("Your answer was deleted"),
      onError: () => pushToast("Failed to delete answer", "error"),
    });
  }

  return (
    <li
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900",
        isOptimistic && "opacity-60",
      )}
    >
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            aria-label="Edit your answer"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {trimmed.length < MIN_LENGTH
                ? `${MIN_LENGTH - trimmed.length} more characters needed`
                : "Looks good"}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={!isValid || updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
          {answer.body}
        </p>
      )}

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
        <span>
          {isOptimistic ? "posting…" : formatRelativeTime(answer.createdAt)}
        </span>
        <span aria-hidden>·</span>
        <span>{answer.votes} votes</span>

        {/* Mutations are unavailable until the optimistic row is reconciled. */}
        {!isOptimistic && !isEditing && (
          <span className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={startEditing}
              className="font-medium hover:text-brand-600"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="font-medium hover:text-red-600 disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </button>
          </span>
        )}
      </div>
    </li>
  );
}
