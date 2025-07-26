const TopicBadge: React.FC<{ topic: string }> = ({ topic }) => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
    <span className="text-sm font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wide">
      {topic}
    </span>
  </div>
);

export const QuestionHeader: React.FC<{ question: string; topic: string }> = ({ 
  question, 
  topic 
}) => (
  <div className="space-y-2">
    <TopicBadge topic={topic} />
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
      {question}
    </h2>
  </div>
);

const OptionIcon: React.FC<{ 
  isSelected: boolean; 
  isCorrect: boolean; 
  showAnswer: boolean; 
}> = ({ isSelected, isCorrect, showAnswer }) => {
  let iconClasses = "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center";
  
  if (showAnswer) {
    if (isCorrect) {
      iconClasses += " border-green-500 dark:border-green-400 bg-green-500 dark:bg-green-400";
    } else if (isSelected && !isCorrect) {
      iconClasses += " border-red-500 dark:border-red-400 bg-red-500 dark:bg-red-400";
    } else {
      iconClasses += " border-gray-300 dark:border-gray-600";
    }
  } else if (isSelected) {
    iconClasses += " border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400";
  } else {
    iconClasses += " border-gray-300 dark:border-gray-600";
  }

  return (
    <span className={iconClasses}>
      {isSelected && (
        <span className="block w-3 h-3 bg-blue-500 dark:bg-blue-300 rounded-full"></span>
      )}
    </span>
  );
};

const getOptionButtonClasses = (
  isSelected: boolean, 
  isCorrect: boolean, 
  showAnswer: boolean
): string => {
  const baseClasses = "w-full text-left px-5 py-4 border-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-900 dark:text-gray-100 flex items-center";
  
  if (showAnswer) {
    if (isCorrect) {
      return `${baseClasses} bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 shadow-sm`;
    } else if (isSelected && !isCorrect) {
      return `${baseClasses} bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 shadow-sm`;
    } else {
      return `${baseClasses} bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300`;
    }
  } else if (isSelected) {
    return `${baseClasses} bg-blue-50 dark:bg-blue-900 border-blue-400 dark:border-blue-700 text-blue-800 dark:text-blue-300 shadow-md`;
  } else {
    return `${baseClasses} bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500`;
  }
};

const QuizOption: React.FC<{
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  showAnswer: boolean;
  onSelect: (index: number) => void;
}> = ({ option, index, isSelected, isCorrect, showAnswer, onSelect }) => {
  const buttonClasses = getOptionButtonClasses(isSelected, isCorrect, showAnswer);

  return (
    <button
      className={buttonClasses}
      onClick={() => onSelect(index)}
      disabled={showAnswer}
    >
      <OptionIcon 
        isSelected={isSelected} 
        isCorrect={isCorrect} 
        showAnswer={showAnswer} 
      />
      <span className="ml-3">{option}</span>
    </button>
  );
};

export const OptionsList: React.FC<{
  options: string[];
  selectedAnswer: number | null;
  correctIndex: number;
  showAnswer: boolean;
  onSelect: (index: number) => void;
}> = ({ options, selectedAnswer, correctIndex, showAnswer, onSelect }) => (
  <div className="space-y-3">
    {options.map((option, index) => (
      <QuizOption
        key={index}
        option={option}
        index={index}
        isSelected={selectedAnswer === index}
        isCorrect={correctIndex === index}
        showAnswer={showAnswer}
        onSelect={onSelect}
      />
    ))}
  </div>
);

const InfoIcon: React.FC = () => (
  <div className="w-6 h-6 bg-amber-400 dark:bg-amber-600 rounded-full flex items-center justify-center">
    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  </div>
);

export const ExplanationPanel: React.FC<{ explanation: string }> = ({ explanation }) => (
  <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 border-l-4 border-amber-400 dark:border-amber-700 p-5 rounded-r-lg">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">
        <InfoIcon />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
          Explanation
        </h3>
        <p className="text-sm text-amber-700 dark:text-amber-100 leading-relaxed">
          {explanation}
        </p>
      </div>
    </div>
  </div>
);