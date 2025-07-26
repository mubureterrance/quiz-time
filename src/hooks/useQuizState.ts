import React from "react";

export function useQuizState(totalQuestions: number, correctAnswers: number[] = []) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<(number | null)[]>([]);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = React.useState(false);

  React.useEffect(() => {
    setSelectedAnswers(new Array(totalQuestions).fill(null));
  }, [totalQuestions]);

  const handleSelect = React.useCallback((index: number) => {
    if (selectedAnswers[currentQuestion] !== null) return;
        
    const updated = [...selectedAnswers];
    updated[currentQuestion] = index;
    setSelectedAnswers(updated);
    setShowAnswer(true);
  }, [selectedAnswers, currentQuestion]);

  const goToNext = React.useCallback(() => {
    setShowAnswer(false);
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }, [currentQuestion, totalQuestions]);

  const goToPrevious = React.useCallback(() => {
    setShowAnswer(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }, [currentQuestion]);

  const restart = React.useCallback(() => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(totalQuestions).fill(null));
    setShowAnswer(false);
    setShowRestartConfirm(false);
  }, [totalQuestions]);

  const isComplete = selectedAnswers.length === totalQuestions &&
                     selectedAnswers.every((answer) => answer !== null);

  // Fixed currentScore calculation
  const currentScore = selectedAnswers.reduce((acc: number, answer, idx) => {
    return answer !== null && answer === correctAnswers[idx] ? acc + 1 : acc;
  }, 0);

  return {
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
    currentScore
  };
}