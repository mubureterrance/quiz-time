interface NavigationButtonProps {
  direction: 'previous' | 'next';
  disabled: boolean;
  onClick: () => void;
}

export function NavigationButton({ direction, disabled, onClick }: NavigationButtonProps) {
  const isPrevious = direction === 'previous';
  const buttonText = isPrevious ? 'Previous' : 'Next';
  
  const buttonClasses = disabled
    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md transform hover:scale-105";

  const ArrowIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d={isPrevious ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} 
      />
    </svg>
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded font-medium text-xs transition-all duration-200 ${buttonClasses}`}
    >
      {isPrevious && <ArrowIcon />}
      {buttonText}
      {!isPrevious && <ArrowIcon />}
    </button>
  );
}