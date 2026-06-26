"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAnswer,
  deleteAnswer,
  fetchAnswers,
  fetchMyAnswers,
  updateAnswer,
} from "./api";
import type { Answer, CreateAnswerInput, UpdateAnswerInput } from "./types";

export const answerKeys = {
  all: ["answers"] as const,
  list: (questionId: string) =>
    [...answerKeys.all, "list", questionId] as const,
  mine: () => [...answerKeys.all, "mine"] as const,
};

export function useAnswers(questionId: string) {
  return useQuery({
    queryKey: answerKeys.list(questionId),
    queryFn: () => fetchAnswers(questionId),
  });
}

/** Answers authored by the current (demo) user — powers the dashboard. */
export function useMyAnswers() {
  return useQuery({
    queryKey: answerKeys.mine(),
    queryFn: fetchMyAnswers,
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
      queryClient.invalidateQueries({ queryKey: answerKeys.mine() });
    },
  });
}

/**
 * Edit an answer's text with an optimistic update: the new body shows
 * immediately and rolls back if the server rejects it.
 */
export function useUpdateAnswer(questionId: string) {
  const queryClient = useQueryClient();
  const key = answerKeys.list(questionId);

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAnswerInput }) =>
      updateAnswer(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Answer[]>(key);

      queryClient.setQueryData<Answer[]>(key, (old = []) =>
        old.map((a) => (a.id === id ? { ...a, body: input.body } : a)),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: answerKeys.mine() });
    },
  });
}

/**
 * Delete an answer with an optimistic update: the row disappears immediately
 * and is restored if the server call fails.
 */
export function useDeleteAnswer(questionId: string) {
  const queryClient = useQueryClient();
  const key = answerKeys.list(questionId);

  return useMutation({
    mutationFn: (id: string) => deleteAnswer(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Answer[]>(key);

      queryClient.setQueryData<Answer[]>(key, (old = []) =>
        old.filter((a) => a.id !== id),
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: answerKeys.mine() });
    },
  });
}
