import React from "react";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
};

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
  showAnswer 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 dark:text-gray-100">
      {/* Question Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wide">
            {question.topic}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrect = question.correctIndex === i;
          
          let buttonClasses = "w-full text-left px-5 py-4 border-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-900 dark:text-gray-100";
          let iconClasses = "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center";
          
          if (showAnswer) {
            if (isCorrect) {
              buttonClasses += " bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 shadow-sm";
              iconClasses += " border-green-500 dark:border-green-400 bg-green-500 dark:bg-green-400";
            } else if (isSelected && !isCorrect) {
              buttonClasses += " bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 shadow-sm";
              iconClasses += " border-red-500 dark:border-red-400 bg-red-500 dark:bg-red-400";
            } else {
              buttonClasses += " bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300";
              iconClasses += " border-gray-300 dark:border-gray-600";
            }
          } else if (isSelected) {
            buttonClasses += " bg-blue-50 dark:bg-blue-900 border-blue-400 dark:border-blue-700 text-blue-800 dark:text-blue-300 shadow-md";
            iconClasses += " border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400";
          } else {
            buttonClasses += " bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500";
            iconClasses += " border-gray-300 dark:border-gray-600";
          }

          return (
            <button
              key={i}
              className={buttonClasses}
              onClick={() => onSelect(i)}
              disabled={showAnswer}
            >
              <span className={iconClasses}>
                {isSelected ? (
                  <span className="block w-3 h-3 bg-blue-500 dark:bg-blue-300 rounded-full"></span>
                ) : null}
              </span>
              <span className="ml-3">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showAnswer && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 border-l-4 border-amber-400 dark:border-amber-700 p-5 rounded-r-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 bg-amber-400 dark:bg-amber-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Explanation</h3>
              <p className="text-sm text-amber-700 dark:text-amber-100 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;