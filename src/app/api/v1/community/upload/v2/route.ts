import { NextRequest, NextResponse } from "next/server";
import { createUpload } from "@/server/db";
import { jsonError, simulateLatency } from "@/server/http";

export const dynamic = "force-dynamic";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** POST /api/v1/community/upload/v2 - stage one multipart file for attachment. */
export async function POST(request: NextRequest) {
  await simulateLatency();
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Expected multipart/form-data", 400);
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return jsonError("A file field is required", 400);
  }
  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return jsonError("File must be between 1 byte and 10 MB", 422);
  }

  const upload = createUpload({
    filename: file.name,
    contentType: file.type || "application/octet-stream",
    size: file.size,
  });
  return NextResponse.json(upload, { status: 201 });
}
