// src/components/userDashboard/QuizGrid.tsx
import { QuizCard } from "./QuizCard";
import type { Quiz, Badge, UserHistory } from "../../types/quiz.types";
import { usePagination } from "../../hooks/usePagination";
import { PaginationControls } from "../ui/PaginationControls";
import { PageSizeSelector } from "../ui/PageSizeSelector";
import { PaginationInfo } from "../ui/PaginationInfo";

interface QuizGridProps {
  quizzes: Quiz[];
  badges: Badge[];
  history: UserHistory | null;
}

export function QuizGrid({ quizzes, badges, history }: QuizGridProps) {
  const pagination = usePagination({
    data: quizzes,
    initialPageSize: 6,
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
              quizzes.length
            ),
          }}
        />
        <PageSizeSelector
          currentPageSize={pagination.itemsPerPage}
          onPageSizeChange={pagination.changePageSize}
        />
      </div>
      <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pagination.paginatedData.map((quiz) => {
          const performance = history?.performanceByQuiz[quiz.id];
          const badge = badges.find((b) => b.id === quiz.badge);

          return (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              badge={badge}
              performance={performance}
            />
          );
        })}
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
}
