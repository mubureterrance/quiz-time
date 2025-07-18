import Button from "../ui/Button";
import type { Quiz } from "./types";
import type { Badge } from "../../hooks/useBadges";
import React, { useState } from "react";

interface QuizTableProps {
  quizzes: Quiz[];
  badges: Badge[];
  onEdit: (quiz: Quiz) => void;
  onDelete: (quiz: Quiz) => void;
  deletingId: string | null;
}

const QuizTable = ({ quizzes, badges, onEdit, onDelete, deletingId }: QuizTableProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const getBadgeName = (badgeId: string) =>
    badges.find((b) => b.id === badgeId)?.name || badgeId;

  if (quizzes.length === 0) {
    return <div className="text-center text-gray-500 py-10">No quizzes found.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {quizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td className="px-6 py-4">{quiz.title}</td>
              <td className="px-6 py-4">{getBadgeName(quiz.badge)}</td>
              <td className="px-6 py-4">{quiz.questions.length}</td>
              <td className="px-6 py-4 relative">
                <div className="relative inline-block text-left">
                  <Button
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                    onClick={() => setOpenDropdown(openDropdown === quiz.id ? null : quiz.id)}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === quiz.id}
                  >
                    Actions
                  </Button>
                  {openDropdown === quiz.id && (
                    <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setOpenDropdown(null);
                            onEdit(quiz);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                          onClick={() => {
                            setOpenDropdown(null);
                            onDelete(quiz);
                          }}
                          disabled={deletingId === quiz.id}
                        >
                          {deletingId === quiz.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizTable;
