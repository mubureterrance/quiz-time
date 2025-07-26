import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useBadges } from "../hooks/useBadges";
import { useAdminGuard } from "../hooks/useAdminGuard";
import { useBadgeForm } from "../hooks/useBadgeForm";
import { LoadingSpinner } from "../components/badge-manager/LoadingSpinner";
import { PageHeader } from "../components/badge-manager/PageHeader";
import { BadgeForm } from "../components/badge-manager/BadgeForm";
import { BadgeList } from "../components/badge-manager/BadgeList";

export default function BadgeManager() {
  const { isAdmin, loading: authLoading, shouldRedirect } = useAdminGuard();
  const { badges, loading, error } = useBadges();
  const {
    form,
    editingId,
    formError,
    saving,
    resetForm,
    handleFieldChange,
    handleSave,
    handleEdit,
    handleDelete,
  } = useBadgeForm(badges);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Badge Management"
          description="Create and manage badges for your application"
          backLink={{
            to: "/admin",
            label: "Back to Admin Dashboard"
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <BadgeForm
              form={form}
              isEditing={!!editingId}
              error={formError}
              isLoading={saving}
              onChange={handleFieldChange}
              onSubmit={handleSave}
              onCancel={resetForm}
            />
          </div>

          <div className="lg:col-span-2">
            <BadgeList
              badges={badges}
              loading={loading}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}