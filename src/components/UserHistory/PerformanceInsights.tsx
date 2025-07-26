import { BarChart3 } from "lucide-react";
import Card from "../ui/Card";

interface PerformanceInsightsProps {
  history: {
    averageScore: number;
    bestScore: number;
  };
}

export function PerformanceInsights({ history }: PerformanceInsightsProps) {
  const getProgressMessage = (averageScore: number) => {
    if (averageScore >= 60) return "Great job! You're performing well above average.";
    if (averageScore >= 40) return "You're making steady progress. Keep it up!";
    return "Keep practicing! Focus on areas where you can improve.";
  };

  const getRecommendation = (bestScore: number) => {
    if (bestScore >= 80) return "Excellent work! Try more challenging quizzes.";
    if (bestScore >= 60) return "Good progress! Focus on consistency.";
    return "Review the material and retake quizzes to improve your scores.";
  };

  return (
    <div className="mt-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard 
            title="Progress Trend"
            message={getProgressMessage(history.averageScore)}
          />
          <InsightCard 
            title="Recommendations"
            message={getRecommendation(history.bestScore)}
          />
        </div>
      </Card>
    </div>
  );
}

interface InsightCardProps {
  title: string;
  message: string;
}

function InsightCard({ title, message }: InsightCardProps) {
  return (
    <div>
      <h4 className="font-medium text-gray-700 mb-2 dark:text-gray-200">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-200">{message}</p>
    </div>
  );
}