import type { Author } from "@/features/questions/types";

export interface Answer {
  id: string;
  questionId: string;
  body: string;
  author: Author;
  createdAt: string; // ISO timestamp
  votes: number;
}

export interface CreateAnswerInput {
  questionId: string;
  body: string;
}

export interface UpdateAnswerInput {
  body: string;
}
