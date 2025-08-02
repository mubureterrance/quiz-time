import { Mail, User } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { AlertMessage } from "../ui/AlertMessage";
import { useState, useEffect } from "react";

interface ProfileFormProps {
  initialDisplayName: string;
  initialEmail: string;
  onSubmit: (displayName: string, email: string) => Promise<void>;
  loading: boolean;
  success: string;
  error: string;
  disabled: boolean; // e.g., demo/read-only
}

export const ProfileForm = ({
  initialDisplayName,
  initialEmail,
  onSubmit,
  loading,
  success,
  error,
  disabled,
}: ProfileFormProps) => {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [email, setEmail] = useState(initialEmail);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (disabled) {
      setHasChanges(false);
      return;
    }
    const hasProfileChanges =
      displayName !== initialDisplayName || email !== initialEmail;
    setHasChanges(hasProfileChanges);
  }, [displayName, email, initialDisplayName, initialEmail, disabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return; // guard against submitting when read-only
    await onSubmit(displayName.trim(), email.trim());
  };

  return (
    <>
      {disabled && (
        <div className="mb-4 px-4 py-2 bg-yellow-100 dark:bg-yellow-800 border-l-4 border-yellow-500 text-sm">
          <strong>Read-only:</strong> This profile cannot be edited.
        </div>
      )}
      {success && <AlertMessage message={success} type="success" />}
      {error && <AlertMessage message={error} type="error" />}
      {!disabled && hasChanges && (
        <AlertMessage message="You have unsaved changes." type="info" />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Display Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={loading || disabled}
              required
              className="pl-10 w-full"
              placeholder="Enter your display name"
              maxLength={50}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || disabled}
              required
              className="pl-10 w-full"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !hasChanges || disabled}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </>
  );
};
