import { apiFetch, toQueryString } from "@/shared/lib/api-client";
import type { Answer, CreateAnswerInput, UpdateAnswerInput } from "./types";

export function fetchAnswers(questionId: string): Promise<Answer[]> {
  return apiFetch<Answer[]>(`/answers${toQueryString({ questionId })}`);
}

export function createAnswer(input: CreateAnswerInput): Promise<Answer> {
  return apiFetch<Answer>("/answers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateAnswer(
  id: string,
  input: UpdateAnswerInput,
): Promise<Answer> {
  return apiFetch<Answer>(`/answers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteAnswer(id: string): Promise<void> {
  return apiFetch<void>(`/answers/${id}`, { method: "DELETE" });
}

export function fetchMyAnswers(): Promise<Answer[]> {
  return apiFetch<Answer[]>("/answers/me");
}
