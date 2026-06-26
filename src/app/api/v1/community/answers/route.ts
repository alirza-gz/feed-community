import { NextRequest, NextResponse } from "next/server";
import { createAnswer, getQuestion, listAnswers } from "@/server/db";
import { jsonError, simulateLatency } from "@/server/http";
import { createAnswerSchema } from "@/features/answers/schema";

export const dynamic = "force-dynamic";

/** GET /api/v1/community/answers?questionId=... — answers for a question. */
export async function GET(request: NextRequest) {
  await simulateLatency();
  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get("questionId");

  if (!questionId) {
    return jsonError("questionId query parameter is required", 400);
  }

  return NextResponse.json(listAnswers(questionId));
}

/** POST /api/v1/community/answers — add an answer (supports optimistic UI). */
export async function POST(request: NextRequest) {
  await simulateLatency(600);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = createAnswerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  if (!getQuestion(parsed.data.questionId)) {
    return jsonError("Question not found", 404);
  }

  const answer = createAnswer(parsed.data);
  return NextResponse.json(answer, { status: 201 });
}
