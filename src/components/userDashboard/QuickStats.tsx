// src/components/userDashboard/QuickStats.tsx
import { BookOpen, Target, Trophy, TrendingUp } from "lucide-react";
import { QuickStatsCard } from "./QuickStatsCard";
import type { UserHistory } from "../../types/quiz.types";

interface QuickStatsProps {
  history: UserHistory;
}

export function QuickStats({ history }: QuickStatsProps) {
  const statsConfig = [
    {
      icon: BookOpen,
      label: "Quizzes Taken",
      value: history.totalQuizzes,
      iconColor: "text-blue-600 dark:text-blue-300",
      iconBgColor: "bg-blue-100 dark:bg-blue-900"
    },
    {
      icon: Target,
      label: "Average Score",
      value: `${history.averageScore}%`,
      iconColor: "text-green-600 dark:text-green-300",
      iconBgColor: "bg-green-100 dark:bg-green-900"
    },
    {
      icon: Trophy,
      label: "Best Score",
      value: `${history.bestScore}%`,
      iconColor: "text-yellow-600 dark:text-yellow-300",
      iconBgColor: "bg-yellow-100 dark:bg-yellow-900"
    },
    {
      icon: TrendingUp,
      label: "Recent Activity",
      value: history.recentActivity.length,
      iconColor: "text-purple-600 dark:text-purple-300",
      iconBgColor: "bg-purple-100 dark:bg-purple-900"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statsConfig.map((stat, index) => (
        <QuickStatsCard key={index} {...stat} />
      ))}
    </div>
  );
}