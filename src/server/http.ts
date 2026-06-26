import { NextResponse } from "next/server";

/** Simulated network latency so loading states are observable in the demo. */
export async function simulateLatency(ms = 400): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

import type { QuestionListParams, QuestionSort } from "@/features/questions/types";

/** Parse shared feed/search query params from a request URL. */
export function parseListParams(url: string): QuestionListParams {
  const { searchParams } = new URL(url);
  const sortParam = searchParams.get("sort");
  const sort: QuestionSort =
    sortParam === "most_answered" ? "most_answered" : "newest";

  return {
    search: searchParams.get("search") ?? undefined,
    tag: searchParams.get("tag") ?? undefined,
    sort,
    cursor: searchParams.get("cursor"),
    limit: searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined,
  };
}
