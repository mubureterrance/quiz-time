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
import { z } from "zod";
import { useQuizForm } from "../components/quiz/useQuizForm";
import QuizFormModal from "../components/quiz/QuizFormModal";

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
const QuestionSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  options: z.array(z.string().min(1, "Option is required")).length(4, "Exactly 4 options required"),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string(),
  topic: z.string(),
});

const QuizFormSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  badge: z.string().min(1, "Badge selection is required"),
  questions: z.array(QuestionSchema).min(1, "At least one question is required"),
});

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

  // State management for deleting
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Quiz | null>(null);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState("");

  // Custom hook for quiz form/modal logic
  const quizForm = useQuizForm({
    badges,
    editingQuiz: null, // We'll handle edit state below
    onCreate: async (form) => await createQuiz(form),
    onUpdate: async (id, form) => await updateQuiz(id, form),
    onClose: () => setEditingQuiz(null),
  });
  // We'll need to manage editingQuiz state for edit mode
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

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
      <QuizFormModal
        open={quizForm.modalOpen}
        onClose={quizForm.closeModal}
        form={quizForm.form}
        formError={quizForm.formError}
        saving={quizForm.saving}
        badges={badges}
        editingQuiz={editingQuiz}
        handleFormChange={quizForm.handleFormChange}
        handleQuestionChange={quizForm.handleQuestionChange}
        addQuestion={quizForm.addQuestion}
        removeQuestion={quizForm.removeQuestion}
        handleSave={quizForm.handleSave}
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
