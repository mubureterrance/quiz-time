import { FinishButton } from "./FinishButton";
import { NavigationButton } from "./NavigationButton";

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  isComplete: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
}

export function QuizNavigation({
  currentQuestion,
  totalQuestions,
  isComplete,
  onPrevious,
  onNext,
  onFinish,
}: QuizNavigationProps) {
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 w-full mb-2">
      <div className="flex items-center gap-4">
        <NavigationButton
          direction="previous"
          disabled={isFirstQuestion}
          onClick={onPrevious}
        />
        <NavigationButton
          direction="next"
          disabled={isLastQuestion}
          onClick={onNext}
        />
      </div>

      <div className="flex items-center gap-2">
        <FinishButton disabled={!isComplete} onClick={onFinish} />
      </div>
    </div>
  );
}
