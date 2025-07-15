import { useState } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useBadges, type Badge } from "../hooks/useBadges";
import { useAdminGuard } from "../hooks/useAdminGuard";
import { Link, Navigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function BadgeManager() {
  const { isAdmin, loading: authLoading, shouldRedirect } = useAdminGuard();
  const { badges, loading, error } = useBadges();

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
  const [form, setForm] = useState<Partial<Badge>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

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
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Badge Management</h1>
        <Link to="/admin" className="text-blue-600 hover:text-blue-800">
          ← Back to Admin Dashboard
        </Link>
      </div>
      <form onSubmit={handleSave} className="mb-6 space-y-4 bg-white p-4 rounded shadow">
        <div className="flex gap-4">
          <Input
            name="id"
            placeholder="ID (e.g. stage-1)"
            value={form.id || ""}
            onChange={handleChange}
            disabled={!!editingId}
            className="w-1/3"
            required
          />
          <Input
            name="name"
            placeholder="Name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-1/3"
            required
          />
          <Input
            name="color"
            type="color"
            value={form.color || "#888888"}
            onChange={handleChange}
            className="w-1/6 h-10 p-0 border-none"
          />
        </div>
        <Input
          name="description"
          placeholder="Description"
          value={form.description || ""}
          onChange={handleChange}
          className="w-full"
        />
        {formError && <div className="text-red-600 text-sm">{formError}</div>}
        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="bg-blue-600 text-white">
            {editingId ? "Update Badge" : "Add Badge"}
          </Button>
          {editingId && (
            <Button type="button" onClick={resetForm} className="bg-gray-400 text-white">
              Cancel
            </Button>
          )}
        </div>
      </form>
      <h2 className="text-xl font-semibold mb-2">Existing Badges</h2>
      {loading ? (
        <div>Loading badges...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="space-y-2">
          {badges.map((badge) => (
            <div key={badge.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded shadow">
              <span
                className="inline-block w-8 h-8 rounded-full border"
                style={{ backgroundColor: badge.color || "#888888" }}
                title={badge.description}
              ></span>
              <div className="flex-1">
                <div className="font-bold">{badge.name}</div>
                <div className="text-xs text-gray-500">{badge.id}</div>
                {badge.description && <div className="text-sm text-gray-700">{badge.description}</div>}
              </div>
              <Button onClick={() => handleEdit(badge)} className="bg-yellow-400 text-white px-3 py-1">Edit</Button>
              <Button onClick={() => handleDelete(badge.id)} className="bg-red-500 text-white px-3 py-1">Delete</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 