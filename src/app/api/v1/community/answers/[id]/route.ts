import { NextRequest, NextResponse } from "next/server";
import { deleteAnswer, updateAnswer } from "@/server/db";
import { jsonError, simulateLatency } from "@/server/http";
import { updateAnswerSchema } from "@/features/answers/schema";

export const dynamic = "force-dynamic";

/** PATCH /api/v1/community/answers/{id} - update answer text. */
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

  const parsed = updateAnswerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const answer = updateAnswer(id, parsed.data);
  if (!answer) return jsonError("Answer not found", 404);
  return NextResponse.json(answer);
}

/** DELETE /api/v1/community/answers/{id} - remove an answer. */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await simulateLatency();
  const { id } = await params;
  if (!deleteAnswer(id)) return jsonError("Answer not found", 404);
  return new NextResponse(null, { status: 204 });
}
