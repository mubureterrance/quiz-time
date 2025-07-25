// components/HighlightCard.tsx
import { type ReactNode } from "react";

interface HighlightCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  iconBgColor: string;
  iconTextColor: string;
}

export default function HighlightCard({
  icon,
  value,
  label,
  iconBgColor,
  iconTextColor,
}: HighlightCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center min-h-0">
      <div
        className={`w-8 h-8 ${iconBgColor} rounded-lg flex items-center justify-center mb-1`}
      >
        <div className={`w-4 h-4 ${iconTextColor}`}>{icon}</div>
      </div>
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight mb-0.5">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-300 leading-tight">
        {label}
      </p>
    </div>
  );
}
