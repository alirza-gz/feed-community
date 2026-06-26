import type {
  CreateQuestionInput,
  Question,
  QuestionListParams,
  QuestionPage,
  UpdateQuestionInput,
} from "@/features/questions/types";
import type {
  Answer,
  CreateAnswerInput,
  UpdateAnswerInput,
} from "@/features/answers/types";

/**
 * In-memory data store standing in for the real backend described in the
 * scenario. It is intentionally isolated behind these functions so the route
 * handlers (and the rest of the app) never touch the storage shape directly —
 * swapping this for a database later means rewriting only this file.
 *
 * NOTE: state resets on server restart and is per-instance. It is anchored on
 * globalThis so Next.js route bundles share it during local MVP execution.
 * Production would use a real persistence layer.
 */

const AUTHORS = [
  { id: "u1", name: "Sara Ahmadi" },
  { id: "u2", name: "Reza Karimi" },
  { id: "u3", name: "Mina Hosseini" },
  { id: "u4", name: "Ali Rezaei" },
  { id: "u5", name: "Niloofar Tehrani" },
  { id: "u6", name: "Kian Mohammadi" },
];

const TAG_POOL = [
  "react",
  "nextjs",
  "typescript",
  "css",
  "performance",
  "state-management",
  "testing",
  "accessibility",
  "graphql",
  "node",
];

const TITLE_TEMPLATES = [
  "How do I handle {x} correctly in {y}?",
  "Best practices for {x} when using {y}",
  "Why does {x} behave unexpectedly with {y}?",
  "What is the recommended way to structure {x} in {y}?",
  "Debugging a tricky {x} issue inside {y}",
  "Comparing approaches to {x} for a large {y} app",
];

const X_TERMS = [
  "data fetching",
  "form validation",
  "infinite scroll",
  "server rendering",
  "global state",
  "code splitting",
  "error boundaries",
  "caching",
];
const Y_TERMS = ["Next.js", "React", "a TypeScript project", "an MVP", "production"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function buildDescription(title: string, tags: string[]): string {
  return (
    `${title}\n\n` +
    `I've been working on this for a while and want to understand the trade-offs. ` +
    `My current setup involves ${tags.join(", ")}, but I'm not sure it scales well. ` +
    `Specifically I'm worried about maintainability and how this choice affects the ` +
    `rest of the architecture as the product grows. Any guidance, patterns, or ` +
    `real-world experience would be hugely appreciated.`
  );
}

/** Deterministic seed so the demo looks identical on every cold start. */
function seedQuestions(): Question[] {
  const questions: Question[] = [];
  const base = Date.UTC(2026, 5, 1);

  for (let i = 0; i < 47; i++) {
    const template = pick(TITLE_TEMPLATES, i);
    const title = template
      .replace("{x}", pick(X_TERMS, i * 3))
      .replace("{y}", pick(Y_TERMS, i * 2));

    const tagCount = (i % 3) + 1;
    const tags = Array.from({ length: tagCount }, (_, t) =>
      pick(TAG_POOL, i + t * 4),
    );
    const uniqueTags = Array.from(new Set(tags));

    questions.push({
      id: `q${i + 1}`,
      title,
      description: buildDescription(title, uniqueTags),
      tags: uniqueTags,
      author: pick(AUTHORS, i),
      // Spread creation times an hour apart, newest last → reverse for newest first.
      createdAt: new Date(base + i * 60 * 60 * 1000).toISOString(),
      answerCount: (i * 7) % 13,
    });
  }

  // Newest first by default.
  return questions.reverse();
}

function seedAnswers(questions: Question[]): Answer[] {
  const answers: Answer[] = [];
  let counter = 1;
  for (const q of questions) {
    for (let i = 0; i < q.answerCount; i++) {
      answers.push({
        id: `a${counter++}`,
        questionId: q.id,
        body:
          `Here's how I'd approach this. The key is to separate concerns and lean ` +
          `on well-supported primitives. In my experience, ${q.tags[0] ?? "this"} ` +
          `works best when you keep the boundaries explicit and avoid premature ` +
          `abstraction. Hope that helps!`,
        author: pick(AUTHORS, counter),
        createdAt: new Date(
          new Date(q.createdAt).getTime() + (i + 1) * 30 * 60 * 1000,
        ).toISOString(),
        votes: (counter * 3) % 11,
      });
    }
  }
  return answers;
}

const CURRENT_USER_ID = AUTHORS[0].id;

export interface Attachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
  questionId?: string;
  answerId?: string;
}

interface CommunityStore {
  questions: Question[];
  answers: Answer[];
  uploads: Map<string, Attachment>;
  attachments: Attachment[];
}

declare global {
  var __danajoCommunityStore: CommunityStore | undefined;
}

const store =
  globalThis.__danajoCommunityStore ??
  (globalThis.__danajoCommunityStore = (() => {
    const seededQuestions = seedQuestions();
    return {
      questions: seededQuestions,
      answers: seedAnswers(seededQuestions),
      uploads: new Map<string, Attachment>(),
      attachments: [],
    };
  })());

const { questions, answers, uploads, attachments } = store;

/* ----------------------------- Query helpers ----------------------------- */

const DEFAULT_LIMIT = 10;

function applyFilters(params: QuestionListParams): Question[] {
  let result = [...questions];

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (params.tag) {
    result = result.filter((item) => item.tags.includes(params.tag!));
  }

  if (params.sort === "most_answered") {
    result.sort((a, b) => b.answerCount - a.answerCount);
  } else {
    // newest
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return result;
}

/** Cursor = string offset; null when no further pages. */
export function listQuestions(params: QuestionListParams): QuestionPage {
  const filtered = applyFilters(params);
  const limit = params.limit ?? DEFAULT_LIMIT;
  const offset = params.cursor ? Number(params.cursor) : 0;

  const slice = filtered.slice(offset, offset + limit);
  const nextOffset = offset + limit;
  const nextCursor = nextOffset < filtered.length ? String(nextOffset) : null;

  return { items: slice, nextCursor, total: filtered.length };
}

export function getQuestion(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

/** Related = same tags, excluding itself, ranked by tag overlap. */
export function getRelatedQuestions(id: string, limit = 4): Question[] {
  const target = getQuestion(id);
  if (!target) return [];
  return questions
    .filter((q) => q.id !== id && q.tags.some((t) => target.tags.includes(t)))
    .sort(
      (a, b) =>
        b.tags.filter((t) => target.tags.includes(t)).length -
        a.tags.filter((t) => target.tags.includes(t)).length,
    )
    .slice(0, limit);
}

export function createQuestion(input: CreateQuestionInput): Question {
  const question: Question = {
    id: `q${Date.now()}`,
    title: input.title,
    description: input.description,
    tags: input.tags,
    author: AUTHORS[0], // demo: pretend the current user is the first author
    createdAt: new Date().toISOString(),
    answerCount: 0,
  };
  questions.unshift(question);
  return question;
}

export function updateQuestion(
  id: string,
  input: UpdateQuestionInput,
): Question | undefined {
  const question = getQuestion(id);
  if (!question) return undefined;
  Object.assign(question, input);
  return question;
}

export function deleteQuestion(id: string): boolean {
  const questionIndex = questions.findIndex((question) => question.id === id);
  if (questionIndex === -1) return false;

  questions.splice(questionIndex, 1);
  const answerIds = new Set(
    answers.filter((answer) => answer.questionId === id).map((answer) => answer.id),
  );
  for (let index = answers.length - 1; index >= 0; index -= 1) {
    if (answers[index].questionId === id) answers.splice(index, 1);
  }
  for (let index = attachments.length - 1; index >= 0; index -= 1) {
    if (attachments[index].questionId === id || answerIds.has(attachments[index].answerId ?? "")) {
      attachments.splice(index, 1);
    }
  }
  return true;
}

export function listMyQuestions(): Question[] {
  return questions.filter((question) => question.author.id === CURRENT_USER_ID);
}

export function listAnswers(questionId: string): Answer[] {
  return answers
    .filter((a) => a.questionId === questionId)
    .sort((a, b) => b.votes - a.votes);
}

export function createAnswer(input: CreateAnswerInput): Answer {
  const answer: Answer = {
    id: `a${Date.now()}`,
    questionId: input.questionId,
    body: input.body,
    author: AUTHORS[0],
    createdAt: new Date().toISOString(),
    votes: 0,
  };
  answers.push(answer);
  const q = getQuestion(input.questionId);
  if (q) q.answerCount += 1;
  return answer;
}

export function getAnswer(id: string): Answer | undefined {
  return answers.find((answer) => answer.id === id);
}

export function updateAnswer(
  id: string,
  input: UpdateAnswerInput,
): Answer | undefined {
  const answer = getAnswer(id);
  if (!answer) return undefined;
  answer.body = input.body;
  return answer;
}

export function deleteAnswer(id: string): boolean {
  const answerIndex = answers.findIndex((answer) => answer.id === id);
  if (answerIndex === -1) return false;
  const [answer] = answers.splice(answerIndex, 1);
  const question = getQuestion(answer.questionId);
  if (question) question.answerCount = Math.max(0, question.answerCount - 1);
  for (let index = attachments.length - 1; index >= 0; index -= 1) {
    if (attachments[index].answerId === id) attachments.splice(index, 1);
  }
  return true;
}

export function listMyAnswers(): Answer[] {
  return answers.filter((answer) => answer.author.id === CURRENT_USER_ID);
}

export function createUpload(input: Omit<Attachment, "id" | "uploadedAt">): Attachment {
  const upload: Attachment = {
    ...input,
    id: `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    uploadedAt: new Date().toISOString(),
  };
  uploads.set(upload.id, upload);
  return upload;
}

export function attachUpload(
  uploadId: string,
  target: Pick<Attachment, "questionId" | "answerId">,
): Attachment | undefined {
  const upload = uploads.get(uploadId);
  if (!upload) return undefined;
  uploads.delete(uploadId);
  const attachment = { ...upload, ...target };
  attachments.push(attachment);
  return attachment;
}

export function listAllTags(): string[] {
  return [...TAG_POOL];
}
