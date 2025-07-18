import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import QuestionEditor from "./QuestionEditor";
import type { Quiz, QuizForm, Question } from "./types";
import React from "react";

interface QuizFormModalProps {
  open: boolean;
  onClose: () => void;
  form: QuizForm;
  formError: string;
  saving: boolean;
  badges: { id: string; name: string }[];
  editingQuiz: Quiz | null;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleQuestionChange: (index: number, field: keyof Question, value: any) => void;
  addQuestion: () => void;
  removeQuestion: (index: number) => void;
  handleSave: (e: React.FormEvent) => void;
}

const QuizFormModal: React.FC<QuizFormModalProps> = ({
  open,
  onClose,
  form,
  formError,
  saving,
  badges,
  editingQuiz,
  handleFormChange,
  handleQuestionChange,
  addQuestion,
  removeQuestion,
  handleSave,
}) => (
  <Modal open={open} onClose={onClose}>
    <div className="max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">
        {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
      </h2>
      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <Input
            name="title"
            placeholder="Quiz Title"
            value={form.title}
            onChange={handleFormChange}
            className="w-full"
            required
          />
          <Select
            name="badge"
            value={form.badge}
            onChange={handleFormChange}
            className="w-full"
            required
          >
            <option value="">Select Badge</option>
            {badges.map((badge) => (
              <option key={badge.id} value={badge.id}>
                {badge.name}
              </option>
            ))}
          </Select>
        </div>
        {/* Questions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Questions</h3>
          <div className="space-y-6">
            {form.questions.map((question, index) => (
              <QuestionEditor
                key={index}
                question={question}
                index={index}
                onUpdate={handleQuestionChange}
                onRemove={removeQuestion}
                canRemove={form.questions.length > 1}
              />
            ))}
          </div>
        </div>
        {/* Error Message */}
        {formError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{formError}</p>
          </div>
        )}
        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={addQuestion}
          >
            + Add Question
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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