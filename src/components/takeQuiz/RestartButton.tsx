interface RestartButtonProps {
  onClick: () => void;
}

export function RestartButton({ onClick }: RestartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded font-medium text-xs hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow hover:shadow-md"
    >
      <div className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Restart
      </div>
    </button>
  );
}