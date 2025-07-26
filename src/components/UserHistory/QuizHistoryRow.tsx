
import type { QuizResult } from "../../hooks/useUserResults";
import type { Quiz } from "../../types/quiz.types";
import { getPerformanceLevel } from "../../utils/performanceUtils";
import { ActionButtons, PerformanceBadge, QuizInfo, ScoreDisplay } from "./Supporting ";


interface QuizHistoryRowProps {
  result: QuizResult;
  quizzes: Quiz[];
}

export function QuizHistoryRow({ result, quizzes }: QuizHistoryRowProps) {
  const getQuizData = (quizId: string, field: 'title' | 'badge') => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz?.[field] || (field === 'title' ? "Unknown Quiz" : "Unknown Badge");
  };

  const performance = getPerformanceLevel(result.percentage);
  const PerformanceIcon = performance.icon;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-4 py-3">
        <QuizInfo 
          title={getQuizData(result.quizId, 'title')}
          badge={getQuizData(result.quizId, 'badge')}
        />
      </td>
      <td className="px-4 py-3">
        <ScoreDisplay 
          percentage={result.percentage}
          score={result.score}
          totalQuestions={result.totalQuestions}
        />
      </td>
      <td className="px-4 py-3">
        <PerformanceBadge performance={performance} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
        {new Date(result.date).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <ActionButtons quizId={result.quizId} />
      </td>
    </tr>
  );
}