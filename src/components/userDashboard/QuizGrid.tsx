// src/components/userDashboard/QuizGrid.tsx
import { QuizCard } from "./QuizCard";
import type { Quiz, Badge, UserHistory } from "../../types/quiz.types";

interface QuizGridProps {
  quizzes: Quiz[];
  badges: Badge[];
  history: UserHistory | null;
}

export function QuizGrid({ quizzes, badges, history }: QuizGridProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => {
          const performance = history?.performanceByQuiz[quiz.id];
          const badge = badges.find((b) => b.id === quiz.badge);

          return (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              badge={badge}
              performance={performance}
            />
          );
        })}
      </div>
    </div>
  );
}
