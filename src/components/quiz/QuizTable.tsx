import Button from "../ui/Button";
import type { Quiz } from "./types";

interface BadgeOption {
  id: string;
  name: string;
}

interface QuizTableProps {
  quizzes: Quiz[];
  badges: BadgeOption[];
  onEdit: (quiz: Quiz) => void;
  onDelete: (quiz: Quiz) => void;
  deletingId: string | null;
}

const QuizTable = ({ quizzes, badges, onEdit, onDelete, deletingId }: QuizTableProps) => {
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
              <td className="px-6 py-4 space-x-2">
                <Button className="bg-yellow-500" onClick={() => onEdit(quiz)}>Edit</Button>
                <Button
                  className="bg-red-500"
                  onClick={() => onDelete(quiz)}
                  disabled={deletingId === quiz.id}
                >
                  {deletingId === quiz.id ? "Deleting..." : "Delete"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizTable;
