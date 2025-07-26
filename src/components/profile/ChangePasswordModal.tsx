import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Modal } from "../ui/NewModal";
import { AlertMessage } from "../ui/AlertMessage";
import { PasswordField } from "./PasswordField";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import Button from "../ui/Button";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangePasswordModal = ({ isOpen, onClose, onSuccess }: ChangePasswordModalProps) => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getPasswordStrength = (pw: string) => {
    let score = 0;
    const checks = {
      length: pw.length >= 8,
      uppercase: /[A-Z]/.test(pw),
      lowercase: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw),
    };

    Object.values(checks).forEach((check) => {
      if (check) score++;
    });

    return { score, checks };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from current password.");
      setLoading(false);
      return;
    }

    const strength = getPasswordStrength(newPassword);
    if (strength.score < 2) {
      setError("Password is too weak. Please use a stronger password.");
      setLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user?.email || "", currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error("Password update error:", err);
      if (err.code === "auth/wrong-password") {
        setError("Current password is incorrect.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError("Failed to update password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = currentPassword && 
    newPassword && 
    confirmPassword && 
    newPassword === confirmPassword &&
    newPassword.length >= 8;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password">
      {error && <AlertMessage message={error} type="error" />}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="Enter current password"
          disabled={loading}
          required
        />

        <PasswordField
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="Enter new password"
          disabled={loading}
          required
          showStrength
        />

        <PasswordStrengthIndicator password={newPassword} />

        <PasswordField
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm new password"
          disabled={loading}
          required
          confirmValue={newPassword}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};