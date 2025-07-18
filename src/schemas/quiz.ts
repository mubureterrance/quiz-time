import { z } from "zod";

export const QuestionSchema = z.object({
    question: z.string().min(1, "Question text is required"),
    options: z.array(z.string().min(1, "Option is required")).length(4, "Exactly 4 options required"),
    correctIndex: z.number().int().min(0).max(3),
    explanation: z.string(),
    topic: z.string(),
});

export const QuizFormSchema = z.object({
    title: z.string().min(1, "Quiz title is required"),
    badge: z.string().min(1, "Badge selection is required"),
    questions: z.array(QuestionSchema).min(1, "At least one question is required"),
}); 