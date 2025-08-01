import React from "react";

const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <div className="text-gray-500 mb-4">
      <svg
        className="w-16 h-16 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
    <p className="text-gray-500">Create your first quiz to get started</p>
  </div>
);

export default EmptyState; 