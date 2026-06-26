import { NextResponse } from "next/server";
import { listAllTags } from "@/server/db";
import { simulateLatency } from "@/server/http";

export const dynamic = "force-dynamic";

/** GET /api/v1/community/tags — list of tags available for filtering. */
export async function GET() {
  await simulateLatency(200);
  return NextResponse.json(listAllTags());
}
