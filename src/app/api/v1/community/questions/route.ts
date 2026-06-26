import { NextRequest, NextResponse } from "next/server";
import { createQuestion, listQuestions } from "@/server/db";
import { jsonError, parseListParams, simulateLatency } from "@/server/http";
import { createQuestionSchema } from "@/features/questions/schema";

// This is a data API: never statically cache it.
export const dynamic = "force-dynamic";

/** GET /api/v1/community/questions — paginated, filterable, sortable feed. */
export async function GET(request: NextRequest) {
  await simulateLatency();
  const params = parseListParams(request.url);
  const page = listQuestions(params);
  return NextResponse.json(page);
}

/** POST /api/v1/community/questions — create a new question. */
export async function POST(request: NextRequest) {
  await simulateLatency();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = createQuestionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const question = createQuestion(parsed.data);
  return NextResponse.json(question, { status: 201 });
}
