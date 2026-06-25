/** Domain types for the Questions feature. Shared by API + UI layers. */

export interface Author {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: Author;
  createdAt: string; // ISO timestamp
  answerCount: number;
}

/** Detail payload includes related questions resolved server-side. */
export interface QuestionDetail extends Question {
  related: Question[];
}

export type QuestionSort = "newest" | "most_answered";

export interface QuestionListParams {
  search?: string;
  tag?: string;
  sort?: QuestionSort;
  cursor?: string | null;
  limit?: number;
}

/** Cursor-based page, the shape every feed/search endpoint returns. */
export interface QuestionPage {
  items: Question[];
  nextCursor: string | null;
  total: number;
}

export interface CreateQuestionInput {
  title: string;
  description: string;
  tags: string[];
}

/** PATCH payload. At least one field is required by the API route. */
export type UpdateQuestionInput = Partial<CreateQuestionInput>;
