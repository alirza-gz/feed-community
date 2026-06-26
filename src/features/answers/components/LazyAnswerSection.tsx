"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/shared/components/ui/Spinner";

/**
 * Code-splitting boundary for the answers area.
 *
 * The answers section pulls in TanStack Query mutations, the answer form and
 * optimistic-update logic — none of which are needed for the initial paint of
 * the (server-rendered) question body. We `dynamic()`-import it with
 * `ssr: false` so that JavaScript is split into its own chunk and only loaded
 * in the browser, keeping the detail page's initial bundle lean.
 */
const AnswerSection = dynamic(
  () => import("./AnswerSection").then((m) => m.AnswerSection),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center py-8">
        <Spinner className="h-6 w-6" />
      </div>
    ),
  },
);

export function LazyAnswerSection({ questionId }: { questionId: string }) {
  return <AnswerSection questionId={questionId} />;
}
