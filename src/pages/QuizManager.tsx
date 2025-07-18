import { useState, useCallback, useMemo } from "react";
import { useQuizzes } from "../hooks/useQuizzes";
import { useBadges } from "../hooks/useBadges";
import { useAdminGuard } from "../hooks/useAdminGuard";
import { Link, Navigate } from "react-router-dom";
import Modal from "../components/ui/Modal";
import type { Question, Quiz, QuizForm } from "../components/quiz/types";
import QuizTable from "../components/quiz/QuizTable";
import { createQuiz, updateQuiz, deleteQuiz } from "../services/quizService";
import FilterControls from "../components/quiz/FilterControls";
import LoadingSpinner from "../components/quiz/LoadingSpinner";
import EmptyState from "../components/quiz/EmptyState";
import Button from "../components/ui/Button";
import { useQuizForm } from "../components/quiz/useQuizForm";
import QuizFormModal from "../components/quiz/QuizFormModal";
import toast from "react-hot-toast";

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

// Define zod schemas for Question and QuizForm

// Components

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
    <p className="text-red-600">{message}</p>
  </div>
);

export default function QuizManager() {
  const { isAdmin, loading: authLoading, shouldRedirect } = useAdminGuard();
  const { quizzes, loading, error, optimisticAdd, optimisticUpdate, optimisticRemove, setQuizzes } = useQuizzes();
  const { badges } = useBadges();

  // State management for deleting
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Quiz | null>(null);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState("");

  // Custom hook for quiz form/modal logic
  // Optimistic delete
  const handleDelete = useCallback(async (quizId: string) => {
    setDeletingId(quizId);
    const prevQuizzes = quizzes;
    optimisticRemove(quizId);
    try {
      await deleteQuiz(quizId);
      toast.success("Quiz deleted");
    } catch (error) {
      setQuizzes(prevQuizzes);
      toast.error("Failed to delete quiz. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }, [quizzes, optimisticRemove, setQuizzes]);

  // Optimistic create
  const optimisticCreate = async (form: QuizForm) => {
    // Generate a temporary id for the new quiz
    const tempId = "temp-" + Math.random().toString(36).substr(2, 9);
    const optimisticQuiz = { ...form, id: tempId };
    const prevQuizzes = quizzes;
    optimisticAdd(optimisticQuiz);
    try {
      const docRef = await createQuiz(form);
      // Replace temp quiz with real quiz
      optimisticRemove(tempId);
      const newQuiz = { ...form, id: docRef.id };
      optimisticAdd(newQuiz);
      toast.success("Quiz created");
    } catch (error) {
      setQuizzes(prevQuizzes);
      toast.error("Failed to create quiz. Please try again.");
    }
  };

  // Optimistic update
  const optimisticUpdateQuiz = async (id: string, form: QuizForm) => {
    const prevQuizzes = quizzes;
    const updatedQuiz = { ...form, id };
    optimisticUpdate(updatedQuiz);
    try {
      await updateQuiz(id, form);
      toast.success("Quiz updated");
    } catch (error) {
      setQuizzes(prevQuizzes);
      toast.error("Failed to update quiz. Please try again.");
    }
  };

  // Pass these to useQuizForm
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const quizForm = useQuizForm({
    badges,
    editingQuiz, // <-- pass the real value!
    onCreate: optimisticCreate,
    onUpdate: optimisticUpdateQuiz,
    onClose: () => setEditingQuiz(null),
  });
  // We'll need to manage editingQuiz state for edit mode
  // Memoized values
  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes;
    if (searchTerm.trim()) {
      filtered = filtered.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
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
  const openCreate = () => {
    setEditingQuiz(null);
    quizForm.openCreate();
  };
  const openEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    quizForm.openEdit(quiz);
  };
  // Pass editingQuiz to QuizFormModal

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
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen w-full">
      <div className="max-w-6xl mx-auto p-6 dark:text-gray-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Quiz Management</h1>
            <Link
              to="/admin"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              ← Back to Admin Dashboard
            </Link>
          </div>
          <Button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
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
        <QuizFormModal
          open={quizForm.modalOpen}
          onClose={quizForm.closeModal}
          badges={badges}
          editingQuiz={editingQuiz}
          control={quizForm.control}
          register={quizForm.register}
          errors={quizForm.errors}
          fields={quizForm.fields}
          append={quizForm.append}
          remove={quizForm.remove}
          saving={quizForm.saving}
          handleSubmit={quizForm.handleSubmit}
          onSubmit={quizForm.onSubmit}
        />
        {/* Delete Confirmation Modal (unchanged) */}
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
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Delete Quiz</h2>
            <p className="text-gray-600 dark:text-gray-200 mb-6">
              Are you sure you want to delete{" "}
              <strong>"{pendingDelete?.title}"</strong>?
              <br />
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                onClick={cancelDelete}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={executeDelete}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50"
                disabled={deletingId === pendingDelete?.id}
              >
                {deletingId === pendingDelete?.id ? "Deleting..." : "Delete Quiz"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
