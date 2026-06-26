import { NextRequest, NextResponse } from "next/server";
import {
  deleteQuestion,
  getQuestion,
  getRelatedQuestions,
  updateQuestion,
} from "@/server/db";
import { jsonError, simulateLatency } from "@/server/http";
import type { QuestionDetail } from "@/features/questions/types";
import { updateQuestionSchema } from "@/features/questions/schema";

export const dynamic = "force-dynamic";

/** GET /api/v1/community/questions/{id} — detail + related questions. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await simulateLatency();
  const { id } = await params;

  const question = getQuestion(id);
  if (!question) {
    return jsonError("Question not found", 404);
  }

  const detail: QuestionDetail = {
    ...question,
    related: getRelatedQuestions(id),
  };
  return NextResponse.json(detail);
}

/** PATCH /api/v1/community/questions/{id} - update a question. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await simulateLatency();
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = updateQuestionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const question = updateQuestion(id, parsed.data);
  if (!question) return jsonError("Question not found", 404);
  return NextResponse.json(question);
}

/** DELETE /api/v1/community/questions/{id} - remove a question and its answers. */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await simulateLatency();
  const { id } = await params;
  if (!deleteQuestion(id)) return jsonError("Question not found", 404);
  return new NextResponse(null, { status: 204 });
}
