// src/components/userDashboard/RecentActivity.tsx
import { Clock } from "lucide-react";
import { RecentActivityCard } from "./RecentActivityCard";
import type { Quiz, UserHistory } from "../../types/quiz.types";

interface RecentActivityProps {
  history: UserHistory;
  quizzes: Quiz[];
}

export function RecentActivity({ history, quizzes }: RecentActivityProps) {
  if (!history.recentActivity.length) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-300" />
        Recent Activity
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.recentActivity.slice(0, 3).map((result, index) => {
          const quiz = quizzes.find((q) => q.id === result.quizId);
          return (
            <RecentActivityCard 
              key={`${result.quizId}-${index}`}
              result={result}
              quiz={quiz}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
}