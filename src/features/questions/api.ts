import { apiFetch, toQueryString } from "@/shared/lib/api-client";
import type {
  CreateQuestionInput,
  Question,
  QuestionDetail,
  QuestionListParams,
  QuestionPage,
} from "./types";

/** Pure API functions for the Questions feature — no React, easy to test. */

export function fetchQuestions(
  params: QuestionListParams,
): Promise<QuestionPage> {
  // Route to the dedicated search endpoint when a query is present, otherwise
  // the feed endpoint — both return the same QuestionPage shape.
  const endpoint = params.search ? "/questions/search" : "/questions";
  const qs = toQueryString({
    search: params.search,
    tag: params.tag,
    sort: params.sort,
    cursor: params.cursor ?? undefined,
    limit: params.limit,
  });
  return apiFetch<QuestionPage>(`${endpoint}${qs}`);
}

export function fetchQuestion(id: string): Promise<QuestionDetail> {
  return apiFetch<QuestionDetail>(`/questions/${id}`);
}

export function createQuestion(input: CreateQuestionInput): Promise<Question> {
  return apiFetch<Question>("/questions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchTags(): Promise<string[]> {
  return apiFetch<string[]>("/tags");
}
