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
    <div className=" bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Question Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
            {question.topic}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrect = question.correctIndex === i;
          
          let buttonClasses = "w-full text-left px-5 py-4 border-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
          let iconClasses = "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center";
          
          if (showAnswer) {
            if (isCorrect) {
              buttonClasses += " bg-green-50 border-green-300 text-green-800 shadow-sm";
              iconClasses += " border-green-500 bg-green-500";
            } else if (isSelected && !isCorrect) {
              buttonClasses += " bg-red-50 border-red-300 text-red-800 shadow-sm";
              iconClasses += " border-red-500 bg-red-500";
            } else {
              buttonClasses += " bg-gray-50 border-gray-200 text-gray-600";
              iconClasses += " border-gray-300";
            }
          } else if (isSelected) {
            buttonClasses += " bg-blue-50 border-blue-400 text-blue-800 shadow-md";
            iconClasses += " border-blue-500 bg-blue-500";
          } else {
            buttonClasses += " bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300";
            iconClasses += " border-gray-300";
          }

          return (
            <button
              key={i}
              className={buttonClasses}
              onClick={() => onSelect(i)}
              disabled={selectedAnswer !== null}
            >
              <div className="flex items-center gap-4">
                <div className={iconClasses}>
                  {((showAnswer && isCorrect) || (isSelected && !showAnswer)) && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                  {showAnswer && isSelected && !isCorrect && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="flex-1 text-sm leading-relaxed">
                  {option}
                </span>
                {showAnswer && isCorrect && (
                  <div className="text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {showAnswer && isSelected && !isCorrect && (
                  <div className="text-red-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showAnswer && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-5 rounded-r-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 mb-2">Explanation</h3>
              <p className="text-sm text-amber-700 leading-relaxed">
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