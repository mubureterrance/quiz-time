import Button from "../ui/Button";
import type { Quiz } from "./types";
import type { Badge } from "../../hooks/useBadges";
import React, { useState } from "react";
import { usePagination } from "../../hooks/usePagination";
import { PaginationControls } from "../ui/PaginationControls";
import { PageSizeSelector } from "../ui/PageSizeSelector";
import { PaginationInfo } from "../ui/PaginationInfo";

interface QuizTableProps {
  quizzes: Quiz[];
  badges: Badge[];
  onEdit: (quiz: Quiz) => void;
  onDelete: (quiz: Quiz) => void;
  deletingId: string | null;
}

const tableHeaderClass =
  "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider";

const tableColumns = ["Title", "Badge", "Questions", "Actions"];

const QuizTable: React.FC<QuizTableProps> = ({
  quizzes,
  badges,
  onEdit,
  onDelete,
  deletingId,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const pagination = usePagination({
    data: quizzes,
    initialPageSize: 10,
  });

  const getBadgeName = (badgeId: string) =>
    badges.find((b) => b.id === badgeId)?.name || badgeId;

  if (quizzes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">No quizzes found.</div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PaginationInfo 
          paginationInfo={{
            ...pagination.paginationInfo,
            displayEnd: Math.min(pagination.paginationInfo.displayEnd, quizzes.length)
          }}
        />
        <PageSizeSelector
          currentPageSize={pagination.itemsPerPage}
          onPageSizeChange={pagination.changePageSize}
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {tableColumns.map((col, index) => (
                <th key={index} className={tableHeaderClass}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {pagination.paginatedData.map((quiz) => (
              <tr
                key={quiz.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                  {quiz.title}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                  {getBadgeName(quiz.badge)}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                  {quiz.questions.length}
                </td>
                <td className="px-6 py-4 relative">
                  <div className="relative inline-block text-left">
                    <Button
                      className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                      onClick={() =>
                        setOpenDropdown(openDropdown === quiz.id ? null : quiz.id)
                      }
                      aria-haspopup="true"
                      aria-expanded={openDropdown === quiz.id}
                    >
                      Actions
                    </Button>
                    {openDropdown === quiz.id && (
                      <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              setOpenDropdown(null);
                              onEdit(quiz);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 disabled:opacity-50"
                            onClick={() => {
                              setOpenDropdown(null);
                              onDelete(quiz);
                            }}
                            disabled={deletingId === quiz.id}
                          >
                            {deletingId === quiz.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Page {pagination.currentPage} of {pagination.paginationInfo.totalPages}
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

export default QuizTable;