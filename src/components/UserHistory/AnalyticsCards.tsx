import { BookOpen, Target, Trophy, TrendingUp } from "lucide-react";
import Card from "../ui/Card";

interface AnalyticsCardsProps {
  history: {
    totalQuizzes: number;
    averageScore: number;
    bestScore: number;
    recentActivity: any[];
  };
}

export function AnalyticsCards({ history }: AnalyticsCardsProps) {
  const cards = [
    {
      title: "Total Quizzes",
      value: history.totalQuizzes,
      icon: BookOpen,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Average Score",
      value: `${history.averageScore}%`,
      icon: Target,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Best Score",
      value: `${history.bestScore}%`,
      icon: Trophy,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      title: "Recent Activity",
      value: history.recentActivity.length,
      icon: TrendingUp,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <AnalyticsCard key={card.title} {...card} />
      ))}
    </div>
  );
}

// AnalyticsCard Component
interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  bgColor: string;
  iconColor: string;
}

function AnalyticsCard({ title, value, icon: Icon, bgColor, iconColor }: AnalyticsCardProps) {
  return (
    <Card>
      <div className="flex items-center">
        <div className={`${bgColor} p-2 rounded-lg mr-3`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-200">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}