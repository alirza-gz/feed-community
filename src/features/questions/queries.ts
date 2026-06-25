"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createQuestion,
  fetchQuestion,
  fetchQuestions,
  fetchTags,
} from "./api";
import type { QuestionListParams } from "./types";

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
      // New question affects every feed list → invalidate them all.
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}
