import Card from "../ui/Card";
import type { QuizResult } from "../../hooks/useUserResults";
import { QuizHistoryRow } from "./QuizHistoryRow";
import type { Quiz } from "../../types/quiz.types";
import { usePagination } from "../../hooks/usePagination";
import { PaginationControls } from "../ui/PaginationControls";
import { PageSizeSelector } from "../ui/PageSizeSelector";
import { PaginationInfo } from "../ui/PaginationInfo";

interface QuizHistoryTableProps {
  results: QuizResult[];
  quizzes: Quiz[];
}

export function QuizHistoryTable({ results, quizzes }: QuizHistoryTableProps) {
  const pagination = usePagination({
    data: results,
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
              results.length
            ),
          }}
        />
        <PageSizeSelector
          currentPageSize={pagination.itemsPerPage}
          onPageSizeChange={pagination.changePageSize}
        />
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {pagination.paginatedData.map((result, index) => (
                <QuizHistoryRow
                  key={`${result.quizId}-${index}`}
                  result={result}
                  quizzes={quizzes}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
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

function TableHeader() {
  const headers = ["Quiz", "Score", "Performance", "Date", "Actions"];

  return (
    <thead className="bg-gray-50 dark:bg-gray-800">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
