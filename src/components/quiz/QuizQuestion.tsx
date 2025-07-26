import React from "react";
import type { Question } from "../../types/quiz.types";
import {
  ExplanationPanel,
  OptionsList,
  QuestionHeader,
} from "../QuizQuestion/Sub-components";

type QuizQuestionProps = {
  question: Question;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  showAnswer: boolean;
};

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswer,
  onSelect,
  showAnswer,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-6 dark:text-gray-100">
      <QuestionHeader question={question.question} topic={question.topic} />

      <OptionsList
        options={question.options}
        selectedAnswer={selectedAnswer}
        correctIndex={question.correctIndex}
        showAnswer={showAnswer}
        onSelect={onSelect}
      />

      {showAnswer && <ExplanationPanel explanation={question.explanation} />}
    </div>
  );
};

export default QuizQuestion;
