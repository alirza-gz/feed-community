"use client";

import { useState } from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { Input } from "@/shared/components/ui/Input";

const MAX_TAGS = 5;

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

/** Controlled tag editor: type + Enter to add, max 5, click ✕ to remove. */
export function TagsInput({ value, onChange }: TagsInputProps) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const tag = draft.trim().toLowerCase();
    if (!tag) return;
    if (value.includes(tag) || value.length >= MAX_TAGS) {
      setDraft("");
      return;
    }
    onChange([...value, tag]);
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <span key={tag} className="inline-flex">
            <Badge>
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-brand-700/70 hover:text-brand-700"
                aria-label={`Remove ${tag}`}
              >
                ✕
              </button>
            </Badge>
          </span>
        ))}
      </div>

      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
          }
        }}
        onBlur={addTag}
        disabled={value.length >= MAX_TAGS}
        placeholder={
          value.length >= MAX_TAGS
            ? "Maximum 5 tags reached"
            : "Add a tag and press Enter"
        }
      />
      <p className="mt-1 text-xs text-slate-400">
        {value.length}/{MAX_TAGS} tags
      </p>
    </div>
  );
}
