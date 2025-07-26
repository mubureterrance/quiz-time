import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingSpinner } from "./LoadingSpinner";
import { ColorPicker } from "./ColorPicker";
import type { BadgeFormData } from "./types";

interface BadgeFormProps {
  form: BadgeFormData;
  isEditing: boolean;
  error: string;
  isLoading: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const BadgeForm: React.FC<BadgeFormProps> = ({
  form,
  isEditing,
  error,
  isLoading,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.value);
  };

  const handleColorChange = (color: string) => {
    onChange("color", color);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
        {isEditing ? "Edit Badge" : "Create New Badge"}
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Badge ID
          </label>
          <Input
            name="id"
            placeholder="e.g., stage-1"
            value={form.id || ""}
            onChange={handleInputChange}
            disabled={isEditing}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        <ColorPicker
          label="Color"
          value={form.color || "#888888"}
          onChange={handleColorChange}
        />

        {error && <ErrorMessage message={error} />}

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Saving...
              </div>
            ) : isEditing ? (
              "Update Badge"
            ) : (
              "Create Badge"
            )}
          </Button>
          {isEditing && (
            <Button
              type="button"
              onClick={onCancel}
              className="px-4 bg-slate-500 hover:bg-slate-600 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
