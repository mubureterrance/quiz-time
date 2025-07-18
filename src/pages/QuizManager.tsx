import { useState, useCallback, useMemo } from "react";
import { collection, deleteDoc, doc, setDoc, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useQuizzes } from "../hooks/useQuizzes";
import { useBadges } from "../hooks/useBadges";
import { useAdminGuard } from "../hooks/useAdminGuard";
import { Link, Navigate } from "react-router-dom";
import Modal from "../components/ui/Modal";
import type { Question, Quiz, QuizForm } from "../components/quiz/types";
import QuizTable from "../components/quiz/QuizTable";
import QuestionEditor from "../components/quiz/QuestionEditor";
import { createQuiz, updateQuiz, deleteQuiz } from "../services/quizService";
import FilterControls from "../components/quiz/FilterControls";
import LoadingSpinner from "../components/quiz/LoadingSpinner";
import EmptyState from "../components/quiz/EmptyState";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";

// Constants
const EMPTY_QUESTION: Question = {
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  explanation: "",
  topic: "",
};

const INITIAL_FORM: QuizForm = {
  title: "",
  badge: "",
  questions: [{ ...EMPTY_QUESTION }],
};

// Validation functions
const validateQuizForm = (form: QuizForm): string | null => {
  if (!form.title.trim()) return "Quiz title is required";
  if (!form.badge) return "Badge selection is required";
  if (form.questions.length === 0) return "At least one question is required";

  for (let i = 0; i < form.questions.length; i++) {
    const q = form.questions[i];
    if (!q.question.trim()) return `Question ${i + 1} text is required`;
    if (q.options.some((opt) => !opt.trim()))
      return `All options for question ${i + 1} are required`;
  }

  return null;
};

// Components

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
    <p className="text-red-600">{message}</p>
  </div>
);

export default function QuizManager() {
  const { isAdmin, loading: authLoading, shouldRedirect } = useAdminGuard();
  const { quizzes, loading, error } = useQuizzes();
  const { badges } = useBadges();

  // State management
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Quiz | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [form, setForm] = useState<QuizForm>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState("");

  // Memoized values
  const formWithDefaultBadge = useMemo(
    () => ({
      ...INITIAL_FORM,
      badge: badges[0]?.id || "",
    }),
    [badges]
  );

  // Filter and search logic
  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply badge filter
    if (selectedBadgeFilter) {
      filtered = filtered.filter((quiz) => quiz.badge === selectedBadgeFilter);
    }

    return filtered;
  }, [quizzes, searchTerm, selectedBadgeFilter]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedBadgeFilter("");
  }, []);

  // Get badge statistics
  const badgeStats = useMemo(() => {
    const stats = badges.map((badge) => ({
      ...badge,
      count: quizzes.filter((quiz) => quiz.badge === badge.id).length,
    }));
    return stats;
  }, [badges, quizzes]);

  // Event handlers
  const openCreate = useCallback(() => {
    setEditingQuiz(null);
    setForm(formWithDefaultBadge);
    setFormError("");
    setModalOpen(true);
  }, [formWithDefaultBadge]);

  const openEdit = useCallback((quiz: Quiz) => {
    setEditingQuiz(quiz);
    setForm({
      title: quiz.title,
      badge: quiz.badge,
      questions: quiz.questions.map((q) => ({ ...q })),
    });
    setFormError("");
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingQuiz(null);
    setFormError("");
  }, []);

  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleQuestionChange = useCallback(
    (index: number, field: keyof Question, value: any) => {
      setForm((prev) => {
        const updated = [...prev.questions];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, questions: updated };
      });
    },
    []
  );

  const addQuestion = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...EMPTY_QUESTION }],
    }));
  }, []);

  const removeQuestion = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError("");
      setSaving(true);

      const validationError = validateQuizForm(form);
      if (validationError) {
        setFormError(validationError);
        setSaving(false);
        return;
      }

      try {
        if (editingQuiz) {
          await updateQuiz(editingQuiz.id, form);
        } else {
          await createQuiz(form);
        }
        closeModal();
      } catch (error) {
        console.error("Error saving quiz:", error);
        setFormError("Failed to save quiz. Please try again.");
      } finally {
        setSaving(false);
      }
    },
    [form, editingQuiz, closeModal]
  );

  const handleDelete = useCallback(async (quizId: string) => {
    setDeletingId(quizId);
    try {
      await deleteQuiz(quizId);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }, []);

  const confirmDelete = useCallback((quiz: Quiz) => {
    setPendingDelete(quiz);
  }, []);

  const cancelDelete = useCallback(() => {
    setPendingDelete(null);
  }, []);

  const executeDelete = useCallback(() => {
    if (pendingDelete) {
      handleDelete(pendingDelete.id);
      setPendingDelete(null);
    }
  }, [pendingDelete, handleDelete]);

  // Loading and auth checks
  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
          <Link
            to="/admin"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>
        <Button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={openCreate}
        >
          + Create New Quiz
        </Button>
      </div>

      {/* Filter Controls */}
      <FilterControls
        searchTerm={searchTerm}
        selectedBadgeFilter={selectedBadgeFilter}
        badges={badges}
        onSearchChange={setSearchTerm}
        onBadgeFilterChange={setSelectedBadgeFilter}
        onClearFilters={clearFilters}
        totalQuizzes={quizzes.length}
        filteredCount={filteredQuizzes.length}
      />

      {/* Main Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : quizzes.length === 0 ? (
        <EmptyState />
      ) : (
        <QuizTable
          quizzes={filteredQuizzes}
          badges={badges}
          onEdit={openEdit}
          onDelete={confirmDelete}
          deletingId={deletingId}
        />
      )}

      {/* Quiz Form Modal */}
      <Modal open={modalOpen} onClose={closeModal}>
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
              <ErrorMessage message={formError} />
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
                  onClick={closeModal}
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

      {/* Delete Confirmation Modal */}
      <Modal open={!!pendingDelete} onClose={cancelDelete}>
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-4 text-gray-900">Delete Quiz</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            <strong>"{pendingDelete?.title}"</strong>?
            <br />
            This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              onClick={cancelDelete}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={executeDelete}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              disabled={deletingId === pendingDelete?.id}
            >
              {deletingId === pendingDelete?.id ? "Deleting..." : "Delete Quiz"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
