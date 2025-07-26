// src/components/userDashboard/QuizCard.tsx
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../ui/Card";
import type { Quiz, Badge, PerformanceData } from "../../types/quiz.types";

interface QuizCardProps {
  quiz: Quiz;
  badge: Badge | undefined;
  performance: PerformanceData | undefined;
}

export function QuizCard({ quiz, badge, performance }: QuizCardProps) {
  // Utility to ensure text is readable on colored backgrounds
  const getContrastYIQ = (hexcolor: string) => {
    const cleanHex = hexcolor.replace("#", "");
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  };

  const badgeColor = badge?.color || "#2563eb";
  const textColor = getContrastYIQ(badgeColor);

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold">{quiz.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          Badge: {badge ? badge.name : quiz.badge}
        </p>
        {performance && (
          <div className="mt-2 flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-300 mr-1" />
            <span className="text-green-600 dark:text-green-300 font-medium text-sm">
              Best: {performance.percentage}%
            </span>
          </div>
        )}
      </div>
      <Link
        to={`/quiz/${quiz.id}`}
        style={{ backgroundColor: badgeColor, color: textColor }}
        className="mt-4 inline-block px-4 py-2 rounded text-sm text-center transition-colors duration-200 hover:opacity-90"
      >
        {performance ? "Retake Quiz" : "Take Quiz"}
      </Link>
    </Card>
  );
}