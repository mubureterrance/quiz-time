import Modal from "../ui/Modal";

interface RestartConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RestartConfirmModal({ isOpen, onClose, onConfirm }: RestartConfirmModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-xs w-full mx-2">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">Restart Quiz?</h3>
          <p className="text-gray-600 mb-4 leading-relaxed text-sm">
            Are you sure you want to restart this quiz? All your current answers will be lost and you'll start from the beginning.
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium text-xs hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded font-medium text-xs hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow hover:shadow-lg transform hover:scale-105"
            >
              Yes, Restart
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}