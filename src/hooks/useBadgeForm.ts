import { useState } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Badge, BadgeFormData } from '../components/badge-manager/types';

export const useBadgeForm = (badges: Badge[]) => {
  const [form, setForm] = useState<BadgeFormData>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setForm({});
    setEditingId(null);
    setFormError("");
  };

  const handleFieldChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (formData: BadgeFormData): string | null => {
    if (!formData.id || !formData.name) {
      return "ID and Name are required.";
    }
    
    if (!/^[a-zA-Z0-9-_]+$/.test(formData.id)) {
      return "ID must be alphanumeric, dashes or underscores only.";
    }
    
    if (!editingId && badges.some((b) => b.id === formData.id)) {
      return "Badge ID already exists.";
    }
    
    return null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const validationError = validateForm(form);
    if (validationError) {
      setFormError(validationError);
      setSaving(false);
      return;
    }

    try {
      const badgeData = {
        name: form.name!,
        description: form.description || "",
        color: form.color || "#888888",
      };

      if (editingId) {
        await updateDoc(doc(db, "badges", editingId), badgeData);
      } else {
        await addDoc(collection(db, "badges"), {
          id: form.id!,
          ...badgeData,
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

  return {
    form,
    editingId,
    formError,
    saving,
    resetForm,
    handleFieldChange,
    handleSave,
    handleEdit,
    handleDelete,
  };
};