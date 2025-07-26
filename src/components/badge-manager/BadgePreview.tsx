import React from "react";
import type { Badge } from "./types";

interface BadgePreviewProps {
  badge: Partial<Badge>;
}

export const BadgePreview: React.FC<BadgePreviewProps> = ({ badge }) => (
  <div
    className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center"
    style={{ backgroundColor: badge.color || "#888888" }}
    title={badge.description}
  >
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </div>
);
