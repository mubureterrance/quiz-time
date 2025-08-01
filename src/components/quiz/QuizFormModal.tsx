import type { Badge } from "../../hooks/useBadges";
import type { Quiz, QuizForm, Question } from "./types";
import React from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import QuestionEditor from "./QuestionEditor";
import { Controller } from "react-hook-form";
import { EMPTY_QUESTION } from "./useQuizForm";

interface QuizFormModalProps {
  open: boolean;
  onClose: () => void;
  badges: Badge[];
  editingQuiz: Quiz | null;
  control: any;
  register: any;
  errors: any;
  fields: any[];
  append: (value?: any) => void;
  remove: (index: number) => void;
  saving: boolean;
  handleSubmit: (cb: (data: QuizForm) => void) => (e?: React.BaseSyntheticEvent) => void;
  onSubmit: (data: QuizForm) => void;
}

const QuizFormModal: React.FC<QuizFormModalProps> = ({
  open,
  onClose,
  badges,
  editingQuiz,
  control,
  register,
  errors,
  fields,
  append,
  remove,
  saving,
  handleSubmit,
  onSubmit,
}) => (
  <Modal open={open} onClose={onClose}>
    <div className="max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Quiz Title</label>
          <Input
            {...register("title")}
            id="quiz-title"
            name="title"
            placeholder="Quiz Title"
            className="w-full dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            required
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "quiz-title-error" : undefined}
          />
          {errors.title && Array.isArray(errors.title) ? (
            errors.title.map((err: any, idx: number) => (
              <p key={idx} id="quiz-title-error" className="text-red-600 dark:text-red-300 text-sm" role="alert">{err.message}</p>
            ))
          ) : errors.title ? (
            <p id="quiz-title-error" className="text-red-600 dark:text-red-300 text-sm" role="alert">{errors.title.message}</p>
          ) : null}
          <label htmlFor="quiz-badge" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Badge</label>
          <Select
            {...register("badge")}
            id="quiz-badge"
            name="badge"
            className="w-full dark:bg-gray-800 dark:text-gray-100"
            required
            aria-invalid={!!errors.badge}
            aria-describedby={errors.badge ? "quiz-badge-error" : undefined}
          >
            <option value="" className="dark:bg-gray-800 dark:text-gray-100">Select Badge</option>
            {badges.map((badge) => (
              <option key={badge.id} value={badge.id} className="dark:bg-gray-800 dark:text-gray-100">
                {badge.name}
              </option>
            ))}
          </Select>
          {errors.badge && Array.isArray(errors.badge) ? (
            errors.badge.map((err: any, idx: number) => (
              <p key={idx} id="quiz-badge-error" className="text-red-600 dark:text-red-300 text-sm" role="alert">{err.message}</p>
            ))
          ) : errors.badge ? (
            <p id="quiz-badge-error" className="text-red-600 dark:text-red-300 text-sm" role="alert">{errors.badge.message}</p>
          ) : null}
        </div>
        {/* Questions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Questions</h3>
          <div className="space-y-6">
            {fields.map((question, index) => (
              <Controller
                key={question.id}
                control={control}
                name={`questions.${index}`}
                defaultValue={question}
                render={({ field }) => (
                  <QuestionEditor
                    question={field.value}
                    index={index}
                    onUpdate={(i, fieldName, value) => {
                      field.onChange({ ...field.value, [fieldName]: value });
                    }}
                    onRemove={remove}
                    canRemove={fields.length > 1}
                  />
                )}
              />
            ))}
            {/* Show all question-level errors */}
            {errors.questions && Array.isArray(errors.questions) ? (
              errors.questions.map((err: any, idx: number) => (
                err && err.message ? (
                  <p key={idx} className="text-red-600 text-sm">{err.message}</p>
                ) : err && typeof err === 'object' ? (
                  Object.entries(err).map(([field, fieldErr]: [string, any], fidx) => (
                    fieldErr && fieldErr.message ? (
                      <p key={fidx} className="text-red-600 text-sm">Question {idx + 1} {field}: {fieldErr.message}</p>
                    ) : null
                  ))
                ) : null
              ))
            ) : errors.questions ? (
              <p className="text-red-600 text-sm">{errors.questions.message}</p>
            ) : null}
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-800"
            onClick={() => append({ ...EMPTY_QUESTION })}
          >
            + Add Question
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingQuiz
                ? "Update Quiz"
                : "Create Quiz"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  </Modal>
);

export default QuizFormModal; 