// src/pages/QuizPage.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import QuizQuestion from "../components/quiz/QuizQuestion";
import Modal from "../components/ui/Modal";
import { useQuiz } from "../hooks/useQuiz";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
};

type Quiz = {
  title: string;
  badge: string;
  questions: Question[];
};

export default function QuizPage() {
  const { quizId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { quiz, loading, error } = useQuiz(quizId);
  const [current, setCurrent] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<(number | null)[]>([]);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = React.useState(false);

  React.useEffect(() => {
    if (quiz) {
      setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    }
  }, [quiz]);

  const handleSelect = (index: number) => {
    if (selectedAnswers[current] !== null) return; // don't allow change
    const updated = [...selectedAnswers];
    updated[current] = index;
    setSelectedAnswers(updated);
    setShowAnswer(true);
  };

  const next = () => {
    setShowAnswer(false);
    if (quiz && current < quiz.questions.length - 1) setCurrent(current + 1);
  };

  const previous = () => {
    setShowAnswer(false);
    if (current > 0) setCurrent(current - 1);
  };

  const isComplete = quiz && selectedAnswers.length === quiz.questions.length && selectedAnswers.every((a) => a !== null);

  // Calculate current score for display
  const currentScore = selectedAnswers.reduce((acc: number, answer, idx) => {
    if (answer === null) return acc;
    return answer === quiz?.questions[idx].correctIndex ? acc + 1 : acc;
  }, 0);

  const handleFinish = async () => {
    if (!user || !quiz || selectedAnswers.length !== quiz.questions.length) return;
    
    const score = selectedAnswers.reduce((acc: number, answer, idx) => {
      const isCorrect = answer === quiz.questions[idx].correctIndex;
      return isCorrect ? acc + 1 : acc;
    }, 0);
    
    const percentage = Math.round((score / quiz.questions.length) * 100);
    
    await setDoc(
      doc(db, "quizResults", `${user.uid}.${quizId}`),
      {
        quizId,
        userId: user.uid,
        score,
        percentage,
        totalQuestions: quiz.questions.length,
        date: new Date().toISOString(),
      },
      { merge: true }
    );
    navigate(`/results/${quizId}`);
  };

  // Show restart confirmation
  const showRestartWarning = () => {
    setShowRestartConfirm(true);
  };

  // Restart quiz function
  const restartQuiz = () => {
    setCurrent(0);
    setSelectedAnswers(new Array(quiz?.questions.length || 0).fill(null));
    setShowAnswer(false);
    setShowRestartConfirm(false);
  };

  // Loading state with consistent design
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-300 font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Error state with consistent design
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <p className="text-center text-red-600 dark:text-red-300 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!quiz) return <div className="p-6 text-red-500">Quiz not found</div>;

  const q = quiz.questions[current];
  // Main quiz interface
  const progressPercentage = ((current + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-4xl mx-auto px-2 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 mb-4 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 w-full">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700 rounded-full"></div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wide">
                  {quiz.badge}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 leading-tight truncate">{quiz.title}</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Current Score Display */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded shadow-md text-xs font-semibold">
                <span>{currentScore}/{quiz.questions.length}</span>
              </div>
              {/* Restart Quiz button */}
              <button
                onClick={showRestartWarning}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded font-medium text-xs hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow hover:shadow-md"
              >
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Restart
                </div>
              </button>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-500">
                Q{current + 1}/{quiz.questions.length}
              </span>
              <span className="text-xs font-medium text-gray-500">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Component */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-3 sm:p-4 mb-3 w-full">
          <QuizQuestion
            question={q}
            selectedAnswer={selectedAnswers[current]}
            onSelect={handleSelect}
            showAnswer={showAnswer}
          />
        </div>

        {/* Navigation and Finish */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 w-full">
          <button
            onClick={previous}
            disabled={current === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded font-medium text-xs transition-all duration-200 ${
              current === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md transform hover:scale-105"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={next}
              disabled={current === quiz.questions.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded font-medium text-xs transition-all duration-200 ${
                current === quiz.questions.length - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md transform hover:scale-105"
              }`}
            >
              Next
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={handleFinish}
              disabled={!isComplete}
              className={`flex items-center gap-2 px-6 py-2 rounded font-semibold text-xs transition-all duration-200 ${
                isComplete
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow hover:shadow-lg transform hover:scale-105"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Finish
            </button>
          </div>
        </div>

        {/* Restart Confirmation Modal */}
        <Modal open={showRestartConfirm} onClose={() => setShowRestartConfirm(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-xs w-full mx-2">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Restart Quiz?</h3>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                Are you sure you want to restart this quiz? All your current answers will be lost and you'll start from the beginning.
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setShowRestartConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium text-xs hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={restartQuiz}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded font-medium text-xs hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow hover:shadow-lg transform hover:scale-105"
                >
                  Yes, Restart
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}