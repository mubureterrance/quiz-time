import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useUserResults } from "../hooks/useUserResults";
import { useQuizzes } from "../hooks/useQuizzes";
import { useFilteredResults } from "../hooks/useFilteredResults";

import { ErrorState } from "../components/UserHistory/ErrorState";
import { EmptyState } from "../components/UserHistory/EmptyState";
import { AnalyticsCards } from "../components/UserHistory/AnalyticsCards";
import { FilterTabs } from "../components/UserHistory/FilterTabs";
import { QuizHistoryTable } from "../components/UserHistory/QuizHistoryTable";
import { PerformanceInsights } from "../components/UserHistory/PerformanceInsights";
import { Header } from "../components/UserHistory/Header";
import { LoadingState } from "../components/UserHistory/LoadingState";

export default function UserHistory() {
  const { user } = useAuth();
  const { history, loading, error } = useUserResults(user?.uid);
  const { quizzes } = useQuizzes();
  const [filter, setFilter] = useState<"all" | "recent" | "best">("all");

  const filteredResults = useFilteredResults(history?.results || [], filter);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!history || history.results.length === 0) return <EmptyState />;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen dark:text-gray-100">
      <div className="max-w-6xl mx-auto">
        <Header />
        <AnalyticsCards history={history} />
        <FilterTabs filter={filter} onFilterChange={setFilter} />
        <QuizHistoryTable results={filteredResults} quizzes={quizzes} />
        {history.results.length > 1 && <PerformanceInsights history={history} />}
      </div>
    </div>
  );
}