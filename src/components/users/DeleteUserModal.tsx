import { Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteUserModal({ 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteUserModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Confirm Delete
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
          >
            Delete User
          </Button>
        </div>
      </div>
    </Modal>
  );
}

