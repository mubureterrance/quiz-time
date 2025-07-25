import { useState, useMemo } from "react";
import Button from "../ui/Button";

interface Quiz {
  id: string;
  title: string;
  avg: number;
  attempts: number;
}

interface Result {
  quizId: string;
  percentage: number;
}

interface QuizPerformanceTableProps {
  quizAverages: Quiz[];
  results: Result[];
  isLoading?: boolean;
  error?: string;
  rowsPerPage?: number;
}

interface ProcessedQuiz extends Quiz {
  bestScore: number;
  worstScore: number;
  actualAttempts: number;
}

const tableColumns = [
  "Quiz Title",
  "Attempts", 
  "Avg. Score",
  "Best Score",
  "Worst Score",
];

const tableHeaderClass =
  "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider";

const tableRowClass =
  "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100";

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">📊</div>
    <p className="text-gray-500 dark:text-gray-400 text-sm">
      No quiz data available
    </p>
  </div>
);

const LoadingState = () => (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
    <p className="text-gray-500 dark:text-gray-400 text-sm">
      Loading quiz data...
    </p>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="text-center py-12">
    <div className="text-red-400 text-lg mb-2">⚠️</div>
    <p className="text-red-600 dark:text-red-400 text-sm">
      Error: {error}
    </p>
  </div>
);

export default function QuizPerformanceTable({
  quizAverages,
  results,
  isLoading = false,
  error,
  rowsPerPage = 5,
}: QuizPerformanceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Memoize processed quiz data to avoid recalculation on every render
  const processedQuizzes = useMemo((): ProcessedQuiz[] => {
    return quizAverages.map((quiz) => {
      const quizResults = results.filter((r) => r.quizId === quiz.id);
      const percentages = quizResults.map((r) => r.percentage);
      
      return {
        ...quiz,
        bestScore: percentages.length ? Math.max(...percentages) : 0,
        worstScore: percentages.length ? Math.min(...percentages) : 0,
        actualAttempts: quizResults.length,
      };
    });
  }, [quizAverages, results]);

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(processedQuizzes.length / rowsPerPage));
    const validCurrentPage = Math.min(currentPage, totalPages);
    const paginatedQuizzes = processedQuizzes.slice(
      (validCurrentPage - 1) * rowsPerPage,
      validCurrentPage * rowsPerPage
    );

    return {
      totalPages,
      validCurrentPage,
      paginatedQuizzes,
    };
  }, [processedQuizzes, currentPage, rowsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
    }
  };

  // Format score display with better handling of zero values
  const formatScore = (score: number, hasAttempts: boolean): string => {
    if (!hasAttempts) return "N/A";
    return `${Math.round(score)}%`;
  };

  // Reset to page 1 when data changes
  useMemo(() => {
    setCurrentPage(1);
  }, [quizAverages.length]);

  const renderContent = () => {
    if (error) return <ErrorState error={error} />;
    if (isLoading) return <LoadingState />;
    if (processedQuizzes.length === 0) return <EmptyState />;

    return (
      <>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {tableColumns.map((col) => (
                  <th key={col} className={tableHeaderClass}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginationData.paginatedQuizzes.map((quiz) => {
                const hasAttempts = quiz.actualAttempts > 0;
                
                return (
                  <tr
                    key={quiz.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className={`${tableRowClass} font-medium`}>
                      <div className="truncate max-w-xs" title={quiz.title}>
                        {quiz.title}
                      </div>
                    </td>
                    <td className={tableRowClass}>
                      <div className="flex flex-col">
                        <span>{quiz.actualAttempts}</span>
                        {quiz.attempts !== quiz.actualAttempts && (
                          <span className="text-xs text-gray-400">
                            (Expected: {quiz.attempts})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={tableRowClass}>
                      {hasAttempts ? `${Math.round(quiz.avg)}%` : "N/A"}
                    </td>
                    <td className={tableRowClass}>
                      <span className={hasAttempts ? "text-green-600 dark:text-green-400" : ""}>
                        {formatScore(quiz.bestScore, hasAttempts)}
                      </span>
                    </td>
                    <td className={tableRowClass}>
                      <span className={hasAttempts ? "text-red-600 dark:text-red-400" : ""}>
                        {formatScore(quiz.worstScore, hasAttempts)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination Controls */}
        {paginationData.totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((paginationData.validCurrentPage - 1) * rowsPerPage) + 1} to{' '}
              {Math.min(paginationData.validCurrentPage * rowsPerPage, processedQuizzes.length)} of{' '}
              {processedQuizzes.length} quizzes
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handlePageChange(paginationData.validCurrentPage - 1)}
                disabled={paginationData.validCurrentPage === 1}
                className="px-3 py-1 text-sm rounded border bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                Prev
              </Button>

              {/* Smart pagination - show relevant page numbers */}
              {Array.from({ length: paginationData.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  const current = paginationData.validCurrentPage;
                  return (
                    page === 1 || 
                    page === paginationData.totalPages || 
                    (page >= current - 1 && page <= current + 1)
                  );
                })
                .map((page, index, filteredPages) => {
                  const prevPage = filteredPages[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;
                  
                  return (
                    <div key={page} className="flex items-center gap-2">
                      {showEllipsis && (
                        <span className="text-gray-400 px-2">...</span>
                      )}
                      <Button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 text-sm rounded border transition-colors ${
                          paginationData.validCurrentPage === page
                            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600"
                        }`}
                        aria-label={`Page ${page}`}
                        aria-current={paginationData.validCurrentPage === page ? "page" : undefined}
                      >
                        {page}
                      </Button>
                    </div>
                  );
                })}

              <Button
                onClick={() => handlePageChange(paginationData.validCurrentPage + 1)}
                disabled={paginationData.validCurrentPage === paginationData.totalPages}
                className="px-3 py-1 text-sm rounded border bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Quiz Performance Overview
          </h3>
          {!isLoading && !error && processedQuizzes.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {processedQuizzes.length} quiz{processedQuizzes.length !== 1 ? 'es' : ''}
            </div>
          )}
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
}