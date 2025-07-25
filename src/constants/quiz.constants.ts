import type { Question, QuizForm } from "../types/quiz.types";

export const EMPTY_QUESTION: Question = {
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  explanation: "",
  topic: "",
};

export const INITIAL_FORM: QuizForm = {
  title: "",
  badge: "",
  questions: [{ ...EMPTY_QUESTION }],
};

export const TOAST_MESSAGES = {
  QUIZ_CREATED: "Quiz created",
  QUIZ_UPDATED: "Quiz updated",
  QUIZ_DELETED: "Quiz deleted",
  CREATE_ERROR: "Failed to create quiz. Please try again.",
  UPDATE_ERROR: "Failed to update quiz. Please try again.",
  DELETE_ERROR: "Failed to delete quiz. Please try again.",
} as const;