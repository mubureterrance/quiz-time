interface FinishButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export function FinishButton({ disabled, onClick }: FinishButtonProps) {
  const buttonClasses = disabled
    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
    : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow hover:shadow-lg transform hover:scale-105";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-6 py-2 rounded font-semibold text-xs transition-all duration-200 ${buttonClasses}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      Finish
    </button>
  );
}