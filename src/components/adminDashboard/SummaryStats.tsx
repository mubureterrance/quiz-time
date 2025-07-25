import { Users, BookOpen, TrendingUp, Target } from "lucide-react";
import StatCard from "./StatCard";

interface SummaryStatsProps {
  totalUsers: number;
  totalQuizzes: number;
  totalAttempts: number;
  averageScore: number;
}

export default function SummaryStats({
  totalUsers,
  totalQuizzes,
  totalAttempts,
  averageScore,
}: SummaryStatsProps) {
  const stats = [
    {
      icon: <Users className="w-4 h-4 text-blue-600" />,
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      iconBgColor: "bg-blue-50 dark:bg-blue-900",
    },
    {
      icon: <BookOpen className="w-4 h-4 text-green-600" />,
      label: "Total Quizzes",
      value: totalQuizzes.toLocaleString(),
      iconBgColor: "bg-green-50 dark:bg-green-900",
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-purple-600" />,
      label: "Total Attempts",
      value: totalAttempts.toLocaleString(),
      iconBgColor: "bg-purple-50 dark:bg-purple-900",
    },
    {
      icon: <Target className="w-4 h-4 text-orange-600" />,
      label: "Average Score",
      value: `${averageScore}%`,
      iconBgColor: "bg-orange-50 dark:bg-orange-900",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          iconBgColor={stat.iconBgColor}
        />
      ))}
    </div>
  );
}
