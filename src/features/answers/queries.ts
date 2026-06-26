"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAnswer, fetchAnswers } from "./api";
import type { Answer, CreateAnswerInput } from "./types";

export const answerKeys = {
  all: ["answers"] as const,
  list: (questionId: string) =>
    [...answerKeys.all, "list", questionId] as const,
};

export function useAnswers(questionId: string) {
  return useQuery({
    queryKey: answerKeys.list(questionId),
    queryFn: () => fetchAnswers(questionId),
  });
}

/**
 * Create an answer with an optimistic update: the new answer appears
 * instantly, then is reconciled (or rolled back) once the server responds.
 * Demonstrates the "Optimistic Update" use case from the suggested API.
 */
export function useCreateAnswer(questionId: string) {
  const queryClient = useQueryClient();
  const key = answerKeys.list(questionId);

  return useMutation({
    mutationFn: (input: CreateAnswerInput) => createAnswer(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Answer[]>(key);

      const optimistic: Answer = {
        id: `optimistic-${Date.now()}`,
        questionId: input.questionId,
        body: input.body,
        author: { id: "me", name: "You" },
        createdAt: new Date().toISOString(),
        votes: 0,
      };

      queryClient.setQueryData<Answer[]>(key, (old = []) => [
        optimistic,
        ...old,
      ]);

      return { previous };
    },
    onError: (_err, _input, context) => {
      // Roll back to the snapshot taken in onMutate.
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSettled: () => {
      // Re-sync with the server's authoritative ordering/ids.
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
