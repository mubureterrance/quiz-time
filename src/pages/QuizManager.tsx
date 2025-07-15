import { useState } from "react";
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

const emptyQuestion = {
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  explanation: "",
  topic: "",
};

export default function QuizManager() {
  const { isAdmin, loading: authLoading, shouldRedirect } = useAdminGuard();
  const { quizzes, loading, error } = useQuizzes();
  const { badges } = useBadges();

  // Show loading or redirect if not admin
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any | null>(null);
  const [form, setForm] = useState<any>({
    title: "",
    badge: "",
    questions: [{ ...emptyQuestion }],
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const getBadgeName = (badgeId: string) =>
    badges.find((b) => b.id === badgeId)?.name || badgeId;

  const openCreate = () => {
    setEditingQuiz(null);
    setForm({
      title: "",
      badge: badges[0]?.id || "",
      questions: [{ ...emptyQuestion }],
    });
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (quiz: any) => {
    setEditingQuiz(quiz);
    setForm({
      title: quiz.title,
      badge: quiz.badge,
      questions: quiz.questions.map((q: any) => ({ ...q })),
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingQuiz(null);
    setFormError("");
  };

  const handleFormChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (idx: number, field: string, value: any) => {
    const updated = [...form.questions];
    if (field === "options") {
      updated[idx].options = value;
    } else {
      updated[idx][field] = value;
    }
    setForm({ ...form, questions: updated });
  };

  const addQuestion = () => {
    setForm({ ...form, questions: [...form.questions, { ...emptyQuestion }] });
  };

  const removeQuestion = (idx: number) => {
    if (form.questions.length === 1) return;
    setForm({
      ...form,
      questions: form.questions.filter((_: any, i: number) => i !== idx),
    });
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    if (!form.title.trim() || !form.badge || form.questions.length === 0) {
      setFormError("Title, badge, and at least one question are required.");
      setSaving(false);
      return;
    }
    for (const q of form.questions) {
      if (!q.question.trim() || q.options.some((o: string) => !o.trim())) {
        setFormError("All questions and options are required.");
        setSaving(false);
        return;
      }
    }
    try {
      if (editingQuiz) {
        await setDoc(doc(db, "quizzes", editingQuiz.id), {
          title: form.title,
          badge: form.badge,
          questions: form.questions,
        });
      } else {
        await addDoc(collection(db, "quizzes"), {
          title: form.title,
          badge: form.badge,
          questions: form.questions,
        });
      }
      closeModal();
    } catch {
      setFormError("Failed to save quiz.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (quizId: string) => {
    setDeletingId(quizId);
    try {
      await deleteDoc(doc(db, "quizzes", quizId));
    } catch {
      alert("Failed to delete quiz.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Quiz Management</h1>
          <Link to="/admin" className="text-blue-600 hover:text-blue-800">
            ← Back to Admin Dashboard
          </Link>
        </div>
        <Button className="bg-blue-600 text-white" onClick={openCreate}>
          + Add Quiz
        </Button>
      </div>
      {loading ? (
        <div>Loading quizzes...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="bg-white rounded shadow">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Badge</th>
                <th className="p-4 text-left">Questions</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{quiz.title}</td>
                  <td className="p-4">{getBadgeName(quiz.badge)}</td>
                  <td className="p-4">{quiz.questions?.length ?? 0}</td>
                  <td className="p-4 flex gap-2">
                    <Button
                      className="bg-yellow-400 text-white px-3 py-1"
                      onClick={() => openEdit(quiz)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="bg-red-500 text-white px-3 py-1"
                      onClick={() => setPendingDelete(quiz)}
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
      )}
      <Modal open={modalOpen} onClose={closeModal}>
        <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
          <h2 className="text-xl font-bold mb-4">
            {editingQuiz ? "Edit Quiz" : "Add Quiz"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
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
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
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
            <div className="space-y-6">
              {form.questions.map((q: any, idx: number) => (
                <div key={idx} className="border rounded p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Question {idx + 1}</span>
                    <Button
                      type="button"
                      className="bg-red-400 text-white px-2 py-1 text-xs"
                      onClick={() => removeQuestion(idx)}
                      disabled={form.questions.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                  <Input
                    placeholder="Question text"
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(idx, "question", e.target.value)
                    }
                    className="w-full mb-2"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {q.options.map((opt: string, oidx: number) => (
                      <Input
                        key={oidx}
                        placeholder={`Option ${oidx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...q.options];
                          newOpts[oidx] = e.target.value;
                          handleQuestionChange(idx, "options", newOpts);
                        }}
                        required
                      />
                    ))}
                  </div>
                  <Select
                    value={q.correctIndex}
                    onChange={(e) =>
                      handleQuestionChange(
                        idx,
                        "correctIndex",
                        Number(e.target.value)
                      )
                    }
                    className="w-full mb-2"
                  >
                    {q.options.map((opt: string, oidx: number) => (
                      <option key={oidx} value={oidx}>{`Correct: Option ${
                        oidx + 1
                      }`}</option>
                    ))}
                  </Select>
                  <Input
                    placeholder="Explanation"
                    value={q.explanation}
                    onChange={(e) =>
                      handleQuestionChange(idx, "explanation", e.target.value)
                    }
                    className="w-full mb-2"
                  />
                  <Input
                    placeholder="Topic"
                    value={q.topic}
                    onChange={(e) =>
                      handleQuestionChange(idx, "topic", e.target.value)
                    }
                    className="w-full"
                  />
                </div>
              ))}
              <Button
                type="button"
                className="bg-green-500 text-white"
                onClick={addQuestion}
              >
                + Add Question
              </Button>
            </div>
            {formError && (
              <div className="text-red-600 text-sm">{formError}</div>
            )}
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                className="bg-gray-400 text-white"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Quiz"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal open={!!pendingDelete} onClose={() => setPendingDelete(null)}>
        <h2 className="text-xl font-bold mb-4 text-red-600">Delete Quiz</h2>
        <p>
          Are you sure you want to delete the quiz <b>{pendingDelete?.title}</b>
          ?<br />
          This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end mt-6">
          <Button
            onClick={() => setPendingDelete(null)}
            className="bg-gray-400 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDelete(pendingDelete.id);
              setPendingDelete(null);
            }}
            className="bg-red-600 text-white"
            disabled={deletingId === pendingDelete?.id}
          >
            {deletingId === pendingDelete?.id ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
