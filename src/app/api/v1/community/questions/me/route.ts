import { NextResponse } from "next/server";
import { listMyQuestions } from "@/server/db";
import { simulateLatency } from "@/server/http";

export const dynamic = "force-dynamic";

/** GET /api/v1/community/questions/me - questions owned by the demo user. */
export async function GET() {
  await simulateLatency();
  return NextResponse.json(listMyQuestions());
}
