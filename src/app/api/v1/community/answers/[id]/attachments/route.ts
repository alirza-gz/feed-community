import { NextRequest, NextResponse } from "next/server";
import { attachUpload, getAnswer } from "@/server/db";
import { jsonError, simulateLatency } from "@/server/http";

export const dynamic = "force-dynamic";

/** POST /api/v1/community/answers/{id}/attachments - link a staged upload. */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await simulateLatency();
  const { id } = await params;
  if (!getAnswer(id)) return jsonError("Answer not found", 404);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const uploadId =
    typeof body === "object" && body !== null && "uploadId" in body
      ? body.uploadId
      : undefined;
  if (typeof uploadId !== "string" || uploadId.trim().length === 0) {
    return jsonError("uploadId is required", 422);
  }

  const attachment = attachUpload(uploadId, { answerId: id });
  if (!attachment) return jsonError("Upload not found or already attached", 404);
  return NextResponse.json(attachment, { status: 201 });
}
