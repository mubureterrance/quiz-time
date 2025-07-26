import React from "react";
import { ScoreDisplay } from "./ScoreDisplay";
import { RestartButton } from "./RestartButton";
import { QuizProgress } from "./QuizProgress";

interface QuizHeaderProps {
  title: string;
  badge: string;
  currentScore: number;
  totalQuestions: number;
  currentQuestion: number;
  onRestart: () => void;
}

export function QuizHeader({
  title,
  badge,
  currentScore,
  totalQuestions,
  currentQuestion,
  onRestart,
}: QuizHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 mb-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 w-full">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700 rounded-full"></div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wide">
              {badge}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 leading-tight truncate">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <ScoreDisplay current={currentScore} total={totalQuestions} />
          <RestartButton onClick={onRestart} />
        </div>
      </div>
      <QuizProgress
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
      />
    </div>
  );
}
