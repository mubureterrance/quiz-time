import React from "react";
import { Navigate } from "react-router-dom";

import { useQuizzes } from "../hooks/useQuizzes";
import { useBadges } from "../hooks/useBadges";
import { useAdminGuard } from "../hooks/useAdminGuard";
import { useQuizForm } from "../hooks/useQuizForm";

import { useQuizFilters } from "../hooks/useQuizFilters";
import { useQuizOperations } from "../hooks/useQuizOperations";
import { useDeleteConfirmation } from "../hooks/useDeleteConfirmation";
import { useQuizEditor } from "../hooks/useQuizEditor";

import { QuizManagerHeader } from "../components/quiz/QuizManagerHeader.tsx";
import { QuizManagerContent } from "../components/quiz/QuizManagerContent";
import { DeleteConfirmationModal } from "../components/quiz/DeleteConfirmationModal";
import QuizFormModal from "../components/quiz/QuizFormModal";
import LoadingSpinner from "../components/quiz/LoadingSpinner";

export default function QuizManager() {
  const { shouldRedirect, loading: authLoading } = useAdminGuard();
  const {
    quizzes,
    loading,
    error,
    optimisticAdd,
    optimisticUpdate,
    optimisticRemove,
    setQuizzes,
  } = useQuizzes();
  const { badges } = useBadges();

  const quizFilters = useQuizFilters(quizzes);
  const quizEditor = useQuizEditor();

  const quizOperations = useQuizOperations({
    quizzes,
    optimisticAdd,
    optimisticUpdate,
    optimisticRemove,
    setQuizzes,
  });

  const deleteConfirmation = useDeleteConfirmation(quizOperations.handleDelete);

  const quizForm = useQuizForm({
    badges,
    editingQuiz: quizEditor.editingQuiz,
    onCreate: quizOperations.handleCreate,
    onUpdate: quizOperations.handleUpdate,
    onClose: quizEditor.closeEditor,
  });

  const handleCreateClick = () => {
    quizEditor.openCreate();
    quizForm.openCreate();
  };

  const handleEditClick = (quiz: Quiz) => {
    quizEditor.openEdit(quiz);
    quizForm.openEdit(quiz);
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen w-full">
      <div className="max-w-6xl mx-auto p-6 dark:text-gray-100">
        <QuizManagerHeader onCreateClick={handleCreateClick} />

        <QuizManagerContent
          quizzes={quizzes}
          filteredQuizzes={quizFilters.filteredQuizzes}
          badges={badges}
          loading={loading}
          error={error}
          searchTerm={quizFilters.searchTerm}
          selectedBadgeFilter={quizFilters.selectedBadgeFilter}
          deletingId={quizOperations.deletingId}
          onSearchChange={quizFilters.setSearchTerm}
          onBadgeFilterChange={quizFilters.setSelectedBadgeFilter}
          onClearFilters={quizFilters.clearFilters}
          onEdit={handleEditClick}
          onDelete={deleteConfirmation.confirmDelete}
        />

        <QuizFormModal
          open={quizForm.modalOpen}
          onClose={quizForm.closeModal}
          badges={badges}
          editingQuiz={quizEditor.editingQuiz}
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

        <DeleteConfirmationModal
          quiz={deleteConfirmation.pendingDelete}
          isDeleting={
            quizOperations.deletingId === deleteConfirmation.pendingDelete?.id
          }
          onConfirm={deleteConfirmation.executeDelete}
          onCancel={deleteConfirmation.cancelDelete}
        />
      </div>
    </div>
  );
}
