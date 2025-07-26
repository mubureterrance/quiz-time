import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useQuiz } from "../hooks/useQuiz";
import { useQuizState } from "../hooks/useQuizState";
import { QuizHeader } from "../components/takeQuiz/QuizHeader";
import { QuizProgress } from "../components/takeQuiz/QuizProgress";
import { QuizNavigation } from "../components/takeQuiz/QuizNavigation";
import { RestartConfirmModal } from "../components/takeQuiz/RestartConfirmModal";
import { ErrorState } from "../components/ui/ErrorState";
import QuizQuestion from "../components/quiz/QuizQuestion";
import { LoadingState } from "../components/ui/LoadingState";

export default function QuizPage() {
  const { quizId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { quiz, loading, error } = useQuiz(quizId);

  const {
    currentQuestion,
    selectedAnswers,
    showAnswer,
    showRestartConfirm,
    setShowRestartConfirm,
    handleSelect,
    goToNext,
    goToPrevious,
    restart,
    isComplete,
    currentScore,
  } = useQuizState(quiz?.questions.length || 0);

  const handleFinish = async () => {
    if (!user || !quiz || selectedAnswers.length !== quiz.questions.length)
      return;

    const score = selectedAnswers.reduce((acc: number, answer, idx) => {
      return answer === quiz.questions[idx].correctIndex ? acc + 1 : acc;
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

  const showRestartWarning = () => setShowRestartConfirm(true);
  const hideRestartModal = () => setShowRestartConfirm(false);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!quiz) return <ErrorState message="Quiz not found" />;

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-4xl mx-auto px-2 py-4 sm:py-6">
        <QuizHeader
          title={quiz.title}
          badge={quiz.badge}
          currentScore={currentScore}
          totalQuestions={quiz.questions.length}
          currentQuestion={currentQuestion}
          onRestart={showRestartWarning}
        />

        <QuizNavigation
          currentQuestion={currentQuestion}
          totalQuestions={quiz.questions.length}
          isComplete={isComplete}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onFinish={handleFinish}
        />

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-3 sm:p-4 mb-3 w-full">
          <QuizQuestion
            question={currentQuestionData}
            selectedAnswer={selectedAnswers[currentQuestion]}
            onSelect={handleSelect}
            showAnswer={showAnswer}
          />
        </div>

        <RestartConfirmModal
          isOpen={showRestartConfirm}
          onClose={hideRestartModal}
          onConfirm={restart}
        />
      </div>
    </div>
  );
}
