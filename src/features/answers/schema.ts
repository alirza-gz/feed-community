import { z } from "zod";

export const createAnswerSchema = z.object({
  questionId: z.string().min(1),
  body: z
    .string()
    .trim()
    .min(20, "Answer must be at least 20 characters"),
});

export type CreateAnswerValues = z.infer<typeof createAnswerSchema>;

export const updateAnswerSchema = createAnswerSchema.pick({ body: true });
