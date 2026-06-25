import { z } from "zod";

/**
 * Single source of truth for question validation. Used by both the client
 * form (react-hook-form resolver) and the server route handler, so the rules
 * can never drift between the two.
 *
 * Rules (from the scenario):
 *  - Title: 10–120 characters
 *  - Description: minimum 50 characters
 *  - Maximum 5 tags
 */
export const createQuestionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, "Title must be at least 10 characters")
    .max(120, "Title must be at most 120 characters"),
  description: z
    .string()
    .trim()
    .min(50, "Description must be at least 50 characters"),
  tags: z
    .array(z.string().trim().min(1))
    .max(5, "You can add at most 5 tags")
    .default([]),
});

export type CreateQuestionValues = z.infer<typeof createQuestionSchema>;

export const updateQuestionSchema = createQuestionSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one field to update",
  });
