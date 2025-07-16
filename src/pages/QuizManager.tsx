import { useState, useCallback, useMemo } from "react";
import { collection, deleteDoc, doc, setDoc, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useQuizzes } from "../hooks/useQuizzes";
import { useBadges } from "../hooks/useBadges";
import { useAdminGuard } from "../hooks/useAdminGuard";
import { Link, Navigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";

// Types
interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

interface Quiz {
  id: string;
  title: string;
  badge: string;
  questions: Question[];
}

interface QuizForm {
  title: string;
  badge: string;
  questions: Question[];
}

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
const LoadingSpinner = () => (
  <div className="flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
    <p className="text-red-600">{message}</p>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-gray-500 mb-4">
      <svg
        className="w-16 h-16 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
    <p className="text-gray-500">Create your first quiz to get started</p>
  </div>
);

const QuestionEditor = ({
  question,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  question: Question;
  index: number;
  onUpdate: (index: number, field: keyof Question, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}) => (
  <div className="border rounded-lg p-4 bg-gray-50">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-lg">Question {index + 1}</h3>
      <Button
        type="button"
        className="bg-red-400 text-white px-3 py-1 text-sm rounded hover:bg-red-500 disabled:opacity-50"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
      >
        Remove
      </Button>
    </div>

    <div className="space-y-4">
      <Input
        placeholder="Enter your question..."
        value={question.question}
        onChange={(e) => onUpdate(index, "question", e.target.value)}
        className="w-full"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {question.options.map((option, optIndex) => (
          <Input
            key={optIndex}
            placeholder={`Option ${optIndex + 1}`}
            value={option}
            onChange={(e) => {
              const newOptions = [...question.options];
              newOptions[optIndex] = e.target.value;
              onUpdate(index, "options", newOptions);
            }}
            className="w-full"
            required
          />
        ))}
      </div>

      <Select
        value={question.correctIndex}
        onChange={(e) =>
          onUpdate(index, "correctIndex", Number(e.target.value))
        }
        className="w-full"
      >
        {question.options.map((option, optIndex) => (
          <option key={optIndex} value={optIndex}>
            Correct Answer: Option {optIndex + 1}{" "}
            {option &&
              `(${option.slice(0, 30)}${option.length > 30 ? "..." : ""})`}
          </option>
        ))}
      </Select>

      <Input
        placeholder="Explanation (optional)"
        value={question.explanation}
        onChange={(e) => onUpdate(index, "explanation", e.target.value)}
        className="w-full"
      />

      <Input
        placeholder="Topic (optional)"
        value={question.topic}
        onChange={(e) => onUpdate(index, "topic", e.target.value)}
        className="w-full"
      />
    </div>
  </div>
);

const FilterControls = ({
  searchTerm,
  selectedBadgeFilter,
  badges,
  onSearchChange,
  onBadgeFilterChange,
  onClearFilters,
  totalQuizzes,
  filteredCount,
}: {
  searchTerm: string;
  selectedBadgeFilter: string;
  badges: any[];
  onSearchChange: (value: string) => void;
  onBadgeFilterChange: (value: string) => void;
  onClearFilters: () => void;
  totalQuizzes: number;
  filteredCount: number;
}) => (
  <div className="bg-white rounded-lg shadow p-4 mb-6">
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            placeholder="Search quizzes by title..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Badge Filter */}
      <div className="lg:w-64">
        <Select
          value={selectedBadgeFilter}
          onChange={(e) => onBadgeFilterChange(e.target.value)}
          className="w-full"
        >
          <option value="">All Badges</option>
          {badges.map((badge) => (
            <option key={badge.id} value={badge.id}>
              {badge.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Clear Filters Button */}
      {(searchTerm || selectedBadgeFilter) && (
        <Button
          onClick={onClearFilters}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Filters
        </Button>
      )}
    </div>

    {/* Results Summary */}
    <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
      <span>
        Showing {filteredCount} of {totalQuizzes} quizzes
        {(searchTerm || selectedBadgeFilter) && " (filtered)"}
      </span>
      {selectedBadgeFilter && (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
          Filter: {badges.find((b) => b.id === selectedBadgeFilter)?.name}
        </span>
      )}
    </div>
  </div>
);

const QuizTable = ({
  quizzes,
  badges,
  onEdit,
  onDelete,
  deletingId,
}: {
  quizzes: Quiz[];
  badges: any[];
  onEdit: (quiz: Quiz) => void;
  onDelete: (quiz: Quiz) => void;
  deletingId: string | null;
}) => {
  const getBadgeName = useCallback(
    (badgeId: string) => badges.find((b) => b.id === badgeId)?.name || badgeId,
    [badges]
  );

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No quizzes found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Badge
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Questions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {quizzes.map((quiz) => (
            <tr key={quiz.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {quiz.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {getBadgeName(quiz.badge)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {quiz.questions?.length || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  onClick={() => onEdit(quiz)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                  onClick={() => onDelete(quiz)}
                  disabled={deletingId === quiz.id}
                >
                  {deletingId === quiz.id ? "Deleting..." : "Delete"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

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
        const quizData = {
          title: form.title.trim(),
          badge: form.badge,
          questions: form.questions,
        };

        if (editingQuiz) {
          await setDoc(doc(db, "quizzes", editingQuiz.id), quizData);
        } else {
          await addDoc(collection(db, "quizzes"), quizData);
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
      await deleteDoc(doc(db, "quizzes", quizId));
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
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quizzes...</p>
        </div>
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
