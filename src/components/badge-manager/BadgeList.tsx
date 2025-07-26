import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { EmptyState } from "./EmptyState";
import { BadgeItem } from "./BadgeItem";
import type { Badge } from "./types";
import { usePagination } from "../../hooks/usePagination";
import { PaginationControls } from "../ui/PaginationControls";
import { PageSizeSelector } from "../ui/PageSizeSelector";
import { PaginationInfo } from "../ui/PaginationInfo";

interface BadgeListProps {
  badges: Badge[];
  loading: boolean;
  error: string | null;
  onEdit: (badge: Badge) => void;
  onDelete: (id: string) => void;
}

export const BadgeList: React.FC<BadgeListProps> = ({
  badges,
  loading,
  error,
  onEdit,
  onDelete,
}) => {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner message="Loading badges..." />
        </div>
      );
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (badges.length === 0) {
      return (
        <EmptyState
          icon={
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
          }
          title="No badges yet"
          description="Create your first badge to get started"
        />
      );
    }

    const pagination = usePagination({
      data: badges,
      initialPageSize: 10,
    });

    return (
      <div className="space-y-4">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <PaginationInfo
            paginationInfo={{
              ...pagination.paginationInfo,
              displayEnd: Math.min(
                pagination.paginationInfo.displayEnd,
                badges.length
              ),
            }}
          />
          <PageSizeSelector
            currentPageSize={pagination.itemsPerPage}
            onPageSizeChange={pagination.changePageSize}
          />
        </div>
        <div className="space-y-3">
          {pagination.paginatedData.map((badge) => (
            <BadgeItem
              key={badge.id}
              badge={badge}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
        {/* Bottom Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.currentPage} of{" "}
            {pagination.paginationInfo.totalPages}
          </div>
          <PaginationControls
            paginationInfo={pagination.paginationInfo}
            currentPage={pagination.currentPage}
            onPageChange={pagination.goToPage}
            onFirstPage={pagination.goToFirstPage}
            onLastPage={pagination.goToLastPage}
            onNextPage={pagination.goToNextPage}
            onPreviousPage={pagination.goToPreviousPage}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Existing Badges
        </h2>
      </div>
      {renderContent()}
    </div>
  );
};
