import { apiFetch, toQueryString } from "@/shared/lib/api-client";
import type { Answer, CreateAnswerInput } from "./types";

export function fetchAnswers(questionId: string): Promise<Answer[]> {
  return apiFetch<Answer[]>(`/answers${toQueryString({ questionId })}`);
}

export function createAnswer(input: CreateAnswerInput): Promise<Answer> {
  return apiFetch<Answer>("/answers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
