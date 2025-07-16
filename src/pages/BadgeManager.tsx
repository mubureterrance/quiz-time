import { useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useBadges, type Badge } from "../hooks/useBadges";
import { useAdminGuard } from "../hooks/useAdminGuard";
import { Link, Navigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function BadgeManager() {
  const { isAdmin, loading: authLoading, shouldRedirect } = useAdminGuard();
  const { badges, loading, error } = useBadges();
  const [form, setForm] = useState<Partial<Badge>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Show loading or redirect if not admin
  if (authLoading) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  const resetForm = () => {
    setForm({});
    setEditingId(null);
    setFormError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    if (!form.id || !form.name) {
      setFormError("ID and Name are required.");
      setSaving(false);
      return;
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(form.id)) {
      setFormError("ID must be alphanumeric, dashes or underscores only.");
      setSaving(false);
      return;
    }
    try {
      if (editingId) {
        // Update
        await updateDoc(doc(db, "badges", editingId), {
          name: form.name,
          description: form.description || "",
          color: form.color || "#888888",
        });
      } else {
        // Check for duplicate ID
        if (badges.some((b) => b.id === form.id)) {
          setFormError("Badge ID already exists.");
          setSaving(false);
          return;
        }
        await addDoc(collection(db, "badges"), {
          id: form.id,
          name: form.name,
          description: form.description || "",
          color: form.color || "#888888",
        });
      }
      resetForm();
    } catch (err: any) {
      setFormError("Failed to save badge.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (badge: Badge) => {
    setForm({ ...badge });
    setEditingId(badge.id);
    setFormError("");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this badge?")) return;
    try {
      await deleteDoc(doc(db, "badges", id));
      if (editingId === id) resetForm();
    } catch {
      setFormError("Failed to delete badge.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Badge Management
            </h1>
            <p className="text-slate-600">
              Create and manage badges for your application
            </p>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {editingId ? "Edit Badge" : "Create New Badge"}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Badge ID
                  </label>
                  <Input
                    name="id"
                    placeholder="e.g., stage-1"
                    value={form.id || ""}
                    onChange={handleChange}
                    disabled={!!editingId}
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Alphanumeric, dashes, and underscores only
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Badge Name
                  </label>
                  <Input
                    name="name"
                    placeholder="Display name"
                    value={form.name || ""}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <Input
                    name="description"
                    placeholder="Brief description"
                    value={form.description || ""}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Color
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      name="color"
                      type="color"
                      value={form.color || "#888888"}
                      onChange={handleChange}
                      className="w-12 h-12 p-1 border-2 border-slate-300 rounded-lg cursor-pointer"
                    />
                    <div className="flex-1">
                      <Input
                        name="color"
                        type="text"
                        value={form.color || "#888888"}
                        onChange={handleChange}
                        className="w-full font-mono text-sm"
                        placeholder="#888888"
                      />
                    </div>
                  </div>
                </div>

                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-red-800 text-sm font-medium">
                        {formError}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </div>
                    ) : editingId ? (
                      "Update Badge"
                    ) : (
                      "Create Badge"
                    )}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      onClick={resetForm}
                      className="px-4 bg-slate-500 hover:bg-slate-600 text-white font-medium py-2.5 rounded-lg transition-colors"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Badges List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  Existing Badges
                </h2>
                <div className="text-sm text-slate-500">
                  {badges.length} badge{badges.length !== 1 ? "s" : ""}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-slate-600">Loading badges...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-red-800 font-medium">{error}</span>
                  </div>
                </div>
              ) : badges.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">No badges yet</p>
                  <p className="text-slate-500 text-sm">
                    Create your first badge to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors group"
                    >
                      <div className="relative">
                        <div
                          className="w-12 h-12 rounded-full border-2 border-white shadow-sm flex items-center justify-center"
                          style={{ backgroundColor: badge.color || "#888888" }}
                          title={badge.description}
                        >
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 truncate">
                            {badge.name}
                          </h3>
                          <span className="px-2 py-1 text-xs font-mono text-slate-600 bg-slate-200 rounded">
                            {badge.id}
                          </span>
                        </div>
                        {badge.description && (
                          <p className="text-sm text-slate-600 truncate">
                            {badge.description}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => handleEdit(badge)}
                          className="px-3 py-1.5 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(badge.id)}
                          className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
