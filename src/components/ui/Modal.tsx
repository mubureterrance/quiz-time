import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children, className = "" }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`bg-white dark:bg-gray-900 rounded shadow-lg p-6 relative dark:text-gray-100 ${className}`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 