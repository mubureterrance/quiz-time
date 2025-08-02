import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { User, Shield } from "lucide-react";
import { ProfileForm } from "../components/profile/ProfileForm";
import { ChangePasswordModal } from "../components/profile/ChangePasswordModal";
import Button from "../components/ui/Button";
import { AlertMessage } from "../components/ui/AlertMessage";

const DEMO_EMAIL = "buddy@quiztime.bw";

export default function ProfilePage() {
  const { userProfile } = useAuth();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const isDemo = userProfile?.email === DEMO_EMAIL;

  // Auto-clear success/error messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(() => setPasswordSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordSuccess]);

  if (!userProfile) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = async (displayName: string, email: string) => {
    if (isDemo) {
      setError("Demo account is read-only. Profile cannot be modified.");
      setLoading(false);
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    // Input validation
    if (!displayName) {
      setError("Display name is required.");
      setLoading(false);
      return;
    }

    if (displayName.length < 2) {
      setError("Display name must be at least 2 characters long.");
      setLoading(false);
      return;
    }

    if (!email) {
      setError("Email is required.");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      await updateDoc(doc(db, "users", userProfile.uid), {
        displayName,
        email,
      });
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSuccess = () => {
    setPasswordSuccess("Password updated successfully!");
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="h-6 w-6" />
              Profile Settings
            </h1>
            <p className="text-blue-100 dark:text-blue-200 text-sm mt-1">
              Manage your account information and security settings
            </p>
          </div>

          <div className="p-6">
            {/* Password Success Message */}
            {passwordSuccess && (
              <div className="mb-6">
                <AlertMessage message={passwordSuccess} type="success" />
              </div>
            )}

            {/* Profile Information Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <User className="h-5 w-5" />
                Profile Information
              </h2>
              {isDemo && (
                <div className="mb-4 px-4 py-2 bg-yellow-100 dark:bg-yellow-800 border-l-4 border-yellow-500 text-sm">
                  <strong>Demo account:</strong> profile and password changes
                  are disabled.
                </div>
              )}

              <ProfileForm
                initialDisplayName={userProfile.displayName || ""}
                initialEmail={userProfile.email || ""}
                onSubmit={handleProfileUpdate}
                loading={loading}
                success={success}
                error={error}
                disabled={isDemo}
              />
            </div>

            {/* Security Section */}
            <div className="border-t pt-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <Shield className="h-5 w-5" />
                Security
              </h2>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      Password
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Change your account password to keep your account secure
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      if (!isDemo) setPasswordModalOpen(true);
                    }}
                    className="bg-blue-600 text-white hover:bg-blue-700 ml-4"
                    disabled={isDemo}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
}
