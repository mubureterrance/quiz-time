import React from "react";
import Card from "../ui/Card";

interface QuizResult {
  quizId: string;
  percentage: number;
  score: number;
  totalQuestions?: number;
  date: string;
}

interface Quiz {
  id: string;
  title: string;
}

interface UserQuizHistoryTableProps {
  results: QuizResult[];
  quizzes: Quiz[];
}

export function UserQuizHistoryTable({ results, quizzes }: UserQuizHistoryTableProps) {
  const getQuizTitle = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz?.title || "Unknown Quiz";
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                Quiz
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                Score
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {results.map((result, index) => (
              <tr
                key={`${result.quizId}-${index}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {getQuizTitle(result.quizId)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {result.quizId}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {result.percentage}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {result.score}/{result.totalQuestions || "N/A"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(result.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}