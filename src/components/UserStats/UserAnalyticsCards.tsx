import React from "react";
import { BookOpen, Target, Trophy, TrendingUp } from "lucide-react";
import Card from "../ui/Card";

interface UserHistory {
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  recentActivity: any[];
}

interface UserAnalyticsCardsProps {
  history: UserHistory;
}

const ANALYTICS_CARDS = [
  {
    key: "totalQuizzes",
    label: "Total Quizzes",
    icon: BookOpen,
    bgColor: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-300",
    getValue: (history: UserHistory) => history.totalQuizzes,
  },
  {
    key: "averageScore", 
    label: "Average Score",
    icon: Target,
    bgColor: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-300",
    getValue: (history: UserHistory) => `${history.averageScore}%`,
  },
  {
    key: "bestScore",
    label: "Best Score", 
    icon: Trophy,
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
    iconColor: "text-yellow-600 dark:text-yellow-300",
    getValue: (history: UserHistory) => `${history.bestScore}%`,
  },
  {
    key: "recentActivity",
    label: "Recent Activity",
    icon: TrendingUp,
    bgColor: "bg-purple-100 dark:bg-purple-900", 
    iconColor: "text-purple-600 dark:text-purple-300",
    getValue: (history: UserHistory) => history.recentActivity.length,
  },
];

export function UserAnalyticsCards({ history }: UserAnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {ANALYTICS_CARDS.map(({ key, label, icon: Icon, bgColor, iconColor, getValue }) => (
        <Card key={key}>
          <div className="flex items-center">
            <div className={`${bgColor} p-2 rounded-lg mr-3`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {label}
              </p>
              <p className="text-2xl font-bold">
                {getValue(history)}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}