import React from "react";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
}) => (
  <div
    className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}
  >
    <div className="flex items-center gap-2">
      <svg
        className="w-4 h-4 text-red-600 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-red-800 text-sm font-medium">{message}</span>
    </div>
  </div>
);
