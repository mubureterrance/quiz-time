import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import type { Quiz } from '../../types/quiz.types';

interface DeleteConfirmationModalProps {
  quiz: Quiz | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  quiz,
  isDeleting,
  onConfirm,
  onCancel,
}) => (
  <Modal open={!!quiz} onClose={onCancel}>
    <div className="text-center">
      <div className="text-red-600 mb-4">
        <svg
          className="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Delete Quiz
      </h2>
      <p className="text-gray-600 dark:text-gray-200 mb-6">
        Are you sure you want to delete{" "}
        <strong>"{quiz?.title}"</strong>?
        <br />
        This action cannot be undone.
      </p>
      <div className="flex justify-center gap-3">
        <Button
          onClick={onCancel}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Quiz"}
        </Button>
      </div>
    </div>
  </Modal>
);