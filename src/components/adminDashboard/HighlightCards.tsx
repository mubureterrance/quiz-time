// components/HighlightCards.tsx
import { Flame, Trophy, Frown } from "lucide-react";

interface HighlightProps {
  mostPopular?: any;
  mostPopularAttempts?: number;
  bestQuiz?: { title: string; avg: number };
  worstQuiz?: { title: string; avg: number };
}

export default function HighlightCards({
  mostPopular,
  mostPopularAttempts,
  bestQuiz,
  worstQuiz,
}: HighlightProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-2">
          <Flame className="w-5 h-5 text-red-500 mr-2" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Most Popular Quiz</h3>
        </div>
        <p className="text-gray-900 dark:text-white text-sm">
          {mostPopular || "N/A"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {mostPopularAttempts ? `${mostPopularAttempts} attempts` : "No attempts recorded"}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4">
        <div className="flex items-center mb-2">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Best Performing Quiz</h3>
        </div>
        <p className="text-gray-900 dark:text-white text-sm">
          {bestQuiz?.title || "N/A"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {bestQuiz ? `${bestQuiz.avg}% average score` : "No data"}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4">
        <div className="flex items-center mb-2">
          <Frown className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Worst Performing Quiz</h3>
        </div>
        <p className="text-gray-900 dark:text-white text-sm">
          {worstQuiz?.title || "N/A"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {worstQuiz ? `${worstQuiz.avg}% average score` : "No data"}
        </p>
      </div>
    </div>
  );
}
