"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/Button";
import { Input, Textarea } from "@/shared/components/ui/Input";
import { useUiStore } from "@/shared/store/ui-store";
import { createQuestionSchema, type CreateQuestionValues } from "../schema";
import { useCreateQuestion } from "../queries";
import { TagsInput } from "./TagsInput";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

/**
 * Create-question form. Validation is driven by the SAME zod schema used by
 * the API route, so client and server rules can never diverge.
 */
export function CreateQuestionForm() {
  const router = useRouter();
  const pushToast = useUiStore((s) => s.pushToast);
  const { mutateAsync, isPending } = useCreateQuestion();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateQuestionValues>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: { title: "", description: "", tags: [] },
    mode: "onBlur",
  });

  const title = useWatch({ control, name: "title" }) ?? "";
  const description = useWatch({ control, name: "description" }) ?? "";

  async function onSubmit(values: CreateQuestionValues) {
    try {
      const created = await mutateAsync(values);
      pushToast("Your question was posted");
      router.push(`/questions/${created.id}`);
    } catch {
      pushToast("Failed to post question", "error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
        >
          Title
        </label>
        <p className="mb-1 text-xs text-slate-400">
          Be specific — 10 to 120 characters. ({title.length}/120)
        </p>
        <Input
          id="title"
          {...register("title")}
          placeholder="e.g. How do I implement infinite scroll in Next.js?"
          aria-invalid={!!errors.title}
        />
        <FieldError message={errors.title?.message} />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
        >
          Description
        </label>
        <p className="mb-1 text-xs text-slate-400">
          Explain your problem in detail — at least 50 characters. (
          {description.length})
        </p>
        <Textarea
          id="description"
          rows={8}
          {...register("description")}
          placeholder="Describe what you've tried and what you expected to happen…"
          aria-invalid={!!errors.description}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div>
        <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
          Tags
        </span>
        <p className="mb-1 text-xs text-slate-400">
          Add up to 5 tags to describe what your question is about.
        </p>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagsInput value={field.value} onChange={field.onChange} />
          )}
        />
        <FieldError message={errors.tags?.message} />
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Posting…" : "Post question"}
        </Button>
      </div>
    </form>
  );
}
