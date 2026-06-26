import { NextResponse } from "next/server";
import { listMyAnswers } from "@/server/db";
import { simulateLatency } from "@/server/http";

export const dynamic = "force-dynamic";

/** GET /api/v1/community/answers/me - answers owned by the demo user. */
export async function GET() {
  await simulateLatency();
  return NextResponse.json(listMyAnswers());
}
