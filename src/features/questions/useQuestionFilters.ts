"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { QuestionSort } from "./types";

/**
 * The Questions feed's filter state lives entirely in the URL (search query,
 * tag, sort). This makes the feed shareable, bookmarkable and back/forward
 * friendly — see the README "State Management" section.
 *
 * This hook is the single read/write surface for that URL state so components
 * never parse `searchParams` directly.
 */
export interface QuestionFilters {
  search: string;
  tag: string;
  sort: QuestionSort;
}

const DEFAULT_SORT: QuestionSort = "newest";

export function useQuestionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: QuestionFilters = useMemo(() => {
    const sort = searchParams.get("sort");
    return {
      search: searchParams.get("search") ?? "",
      tag: searchParams.get("tag") ?? "",
      sort: sort === "most_answered" ? "most_answered" : DEFAULT_SORT,
    };
  }, [searchParams]);

  const setFilter = useCallback(
    (key: keyof QuestionFilters, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && !(key === "sort" && value === DEFAULT_SORT)) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Replace (not push) so typing in search doesn't flood history.
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.tag !== "" ||
    filters.sort !== DEFAULT_SORT;

  return { filters, setFilter, resetFilters, hasActiveFilters };
}
