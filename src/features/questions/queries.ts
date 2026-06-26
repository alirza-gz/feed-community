"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createQuestion,
  fetchMyQuestions,
  fetchQuestion,
  fetchQuestions,
  fetchTags,
  updateQuestion,
} from "./api";
import type { Question, QuestionListParams, UpdateQuestionInput } from "./types";

/**
 * Centralised, hierarchical query keys. Keeping them in one factory avoids
 * typo-driven cache misses and makes targeted invalidation trivial.
 */
export const questionKeys = {
  all: ["questions"] as const,
  lists: () => [...questionKeys.all, "list"] as const,
  list: (filters: Omit<QuestionListParams, "cursor">) =>
    [...questionKeys.lists(), filters] as const,
  details: () => [...questionKeys.all, "detail"] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
  mine: () => [...questionKeys.all, "mine"] as const,
  tags: () => [...questionKeys.all, "tags"] as const,
};

/** Infinite/paginated feed driven by URL-derived filters. */
export function useQuestionsInfinite(
  filters: Omit<QuestionListParams, "cursor">,
) {
  return useInfiniteQuery({
    queryKey: questionKeys.list(filters),
    queryFn: ({ pageParam }) =>
      fetchQuestions({ ...filters, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => fetchQuestion(id),
  });
}

/** Questions authored by the current (demo) user — powers the dashboard. */
export function useMyQuestions() {
  return useQuery({
    queryKey: questionKeys.mine(),
    queryFn: fetchMyQuestions,
  });
}

export function useTags() {
  return useQuery({
    queryKey: questionKeys.tags(),
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 60, // tags rarely change
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      // New question affects every feed list and the user's dashboard.
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: questionKeys.mine() });
    },
  });
}

export function useUpdateQuestion(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateQuestionInput) => updateQuestion(id, input),
    onSuccess: (updated) => {
      // Seed the detail cache with the fresh server copy, then invalidate so
      // the feed lists and any related-question views pick up the edit.
      queryClient.setQueryData<Question>(questionKeys.detail(id), (prev) =>
        prev ? { ...prev, ...updated } : prev,
      );
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: questionKeys.mine() });
    },
  });
}
