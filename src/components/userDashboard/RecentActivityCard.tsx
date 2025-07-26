// src/components/userDashboard/RecentActivityCard.tsx
import { Star, CheckCircle, Target } from "lucide-react";
import Card from "../ui/Card";
import type { Quiz, QuizResult } from "../../types/quiz.types";

interface RecentActivityCardProps {
  result: QuizResult;
  quiz: Quiz | undefined;
  index: number;
}

export function RecentActivityCard({ result, quiz, index }: RecentActivityCardProps) {
  const getPerformanceIcon = (percentage: number) => {
    if (percentage >= 80)
      return <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />;
    if (percentage >= 60)
      return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-300" />;
    return <Target className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />;
  };

  return (
    <Card key={`${result.quizId}-${index}`} className="p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm truncate">
          {quiz?.title || "Unknown Quiz"}
        </h3>
        {getPerformanceIcon(result.percentage)}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300">{result.percentage}%</span>
        <span className="text-gray-500 dark:text-gray-400">
          {new Date(result.date).toLocaleDateString()}
        </span>
      </div>
    </Card>
  );
}
