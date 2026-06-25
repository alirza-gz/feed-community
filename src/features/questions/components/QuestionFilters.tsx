"use client";

import { useEffect, useState } from "react";
import { Input, Select } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useTags } from "../queries";
import { useQuestionFilters } from "../useQuestionFilters";

/**
 * Search / tag / sort controls. All state is written to the URL via
 * `useQuestionFilters`. The search box keeps a local, debounced draft so we
 * don't rewrite the URL (and refetch) on every keystroke — local state is the
 * right tool for in-progress, not-yet-committed input.
 */
export function QuestionFilters() {
  const { filters, setFilter, resetFilters, hasActiveFilters } =
    useQuestionFilters();
  const { data: tags } = useTags();

  return (
    <QuestionFiltersForm
      key={JSON.stringify(filters)}
      filters={filters}
      setFilter={setFilter}
      resetFilters={resetFilters}
      hasActiveFilters={hasActiveFilters}
      tags={tags}
    />
  );
}

function QuestionFiltersForm({
  filters,
  setFilter,
  resetFilters,
  hasActiveFilters,
  tags,
}: ReturnType<typeof useQuestionFilters> & {
  tags?: string[];
}) {
  const [searchDraft, setSearchDraft] = useState(filters.search);
  const debouncedSearch = useDebouncedValue(searchDraft, 350);

  // Commit the debounced draft to the URL.
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilter("search", debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          🔍
        </span>
        <Input
          type="search"
          placeholder="Search questions..."
          aria-label="Search questions"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        aria-label="Filter by tag"
        value={filters.tag}
        onChange={(e) => setFilter("tag", e.target.value)}
        className="sm:w-44"
      >
        <option value="">All tags</option>
        {tags?.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </Select>

      <Select
        aria-label="Sort questions"
        value={filters.sort}
        onChange={(e) => setFilter("sort", e.target.value)}
        className="sm:w-44"
      >
        <option value="newest">Newest</option>
        <option value="most_answered">Most answered</option>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Clear
        </Button>
      )}
    </div>
  );
}
