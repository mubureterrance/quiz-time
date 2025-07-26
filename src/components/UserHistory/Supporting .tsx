import Button from "../ui/Button";
import { Link } from "react-router-dom";

interface QuizInfoProps {
  title: string;
  badge: string;
}

export function QuizInfo({ title, badge }: QuizInfoProps) {
  return (
    <div>
      <p className="font-medium text-gray-900 dark:text-gray-100">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">Badge: {badge}</p>
    </div>
  );
}

interface ScoreDisplayProps {
  percentage: number;
  score: number;
  totalQuestions?: number;
}

export function ScoreDisplay({ percentage, score, totalQuestions }: ScoreDisplayProps) {
  return (
    <div className="text-center">
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{percentage}%</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {score}/{totalQuestions || "N/A"}
      </p>
    </div>
  );
}

interface PerformanceBadgeProps {
  performance: {
    level: string;
    color: string;
    bg: string;
    icon: React.ComponentType<any>;
  };
}

export function PerformanceBadge({ performance }: PerformanceBadgeProps) {
  const Icon = performance.icon;
  
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${performance.bg} ${performance.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {performance.level}
    </div>
  );
}

interface ActionButtonsProps {
  quizId: string;
}

export function ActionButtons({ quizId }: ActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <Link to={`/results/${quizId}`}>
        <Button className="bg-blue-600 text-white text-xs px-2 py-1 hover:bg-blue-700">
          View Details
        </Button>
      </Link>
      <Link to={`/quiz/${quizId}`}>
        <Button className="bg-green-600 text-white text-xs px-2 py-1 hover:bg-green-700">
          Retake
        </Button>
      </Link>
    </div>
  );
}
