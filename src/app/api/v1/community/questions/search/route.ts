import { NextRequest, NextResponse } from "next/server";
import { listQuestions } from "@/server/db";
import { parseListParams, simulateLatency } from "@/server/http";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/community/questions/search — dedicated search endpoint.
 * Shares the same page shape as the feed so the client can reuse the
 * infinite-query infrastructure. Kept separate to mirror the suggested API
 * and to allow search-specific behaviour (e.g. ranking) to diverge later.
 */
export async function GET(request: NextRequest) {
  await simulateLatency();
  const params = parseListParams(request.url);
  const page = listQuestions(params);
  return NextResponse.json(page);
}
