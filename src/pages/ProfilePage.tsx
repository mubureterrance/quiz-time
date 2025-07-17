import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  Eye,
  EyeOff,
  Shield,
  User,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

export default function ProfilePage() {
  const { user, userProfile } = useAuth();
  const [displayName, setDisplayName] = useState(
    userProfile?.displayName || ""
  );
  const [email, setEmail] = useState(userProfile?.email || "");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Auto-clear success/error messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (pwSuccess) {
      const timer = setTimeout(() => setPwSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [pwSuccess]);

  // Track changes for unsaved changes warning
  useEffect(() => {
    const hasProfileChanges =
      displayName !== (userProfile?.displayName || "") ||
      email !== (userProfile?.email || "");
    setHasChanges(hasProfileChanges);
  }, [displayName, email, userProfile]);

  if (!userProfile) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Input validation
    if (!displayName.trim()) {
      setError("Display name is required.");
      setLoading(false);
      return;
    }

    if (displayName.trim().length < 2) {
      setError("Display name must be at least 2 characters long.");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
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
        displayName: displayName.trim(),
        email: email.trim(),
      });
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    setPwLoading(true);

    // Input validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("All password fields are required.");
      setPwLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters long.");
      setPwLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      setPwLoading(false);
      return;
    }

    if (newPassword === currentPassword) {
      setPwError("New password must be different from current password.");
      setPwLoading(false);
      return;
    }

    const strength = getPasswordStrength(newPassword);
    if (strength.score < 2) {
      setPwError("Password is too weak. Please use a stronger password.");
      setPwLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user?.email || "",
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setPwSuccess("Password updated successfully!");

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Password update error:", err);
      if (err.code === "auth/wrong-password") {
        setPwError("Current password is incorrect.");
      } else if (err.code === "auth/weak-password") {
        setPwError("Password is too weak. Please choose a stronger password.");
      } else {
        setPwError("Failed to update password. Please try again.");
      }
    } finally {
      setPwLoading(false);
    }
  };

  // Enhanced password strength logic
  function getPasswordStrength(pw: string) {
    let score = 0;
    const checks = {
      length: pw.length >= 8,
      uppercase: /[A-Z]/.test(pw),
      lowercase: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw),
      noCommon: !isCommonPassword(pw),
    };

    Object.values(checks).forEach((check) => {
      if (check) score++;
    });

    if (pw.length === 0) return { label: "", color: "", score: 0, checks };
    if (score <= 2)
      return { label: "Weak", color: "bg-red-400", score, checks };
    if (score <= 4)
      return { label: "Medium", color: "bg-yellow-400", score, checks };
    return { label: "Strong", color: "bg-green-500", score, checks };
  }

  function isCommonPassword(password: string): boolean {
    const commonPasswords = [
      "password",
      "123456",
      "12345678",
      "qwerty",
      "abc123",
      "password123",
      "admin",
      "letmein",
      "welcome",
      "monkey",
    ];
    return commonPasswords.includes(password.toLowerCase());
  }

  const pwStrength = getPasswordStrength(newPassword);

  const AlertMessage = ({
    message,
    type,
  }: {
    message: string;
    type: "success" | "error" | "info";
  }) => {
    const styles = {
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800",
      info: "bg-blue-50 border-blue-200 text-blue-800",
    };

    const icons = {
      success: <CheckCircle className="h-4 w-4" />,
      error: <AlertCircle className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />,
    };

    return (
      <div
        className={`mb-4 p-3 border rounded-lg flex items-center gap-2 ${styles[type]}`}
      >
        {icons[type]}
        <span className="text-sm font-medium">{message}</span>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="h-6 w-6" />
            Profile Settings
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Manage your account information and security settings
          </p>
        </div>

        <div className="p-6">
          {/* Profile Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <User className="h-5 w-5" />
              Profile Information
            </h2>

            {success && <AlertMessage message={success} type="success" />}
            {error && <AlertMessage message={error} type="error" />}

            {hasChanges && (
              <AlertMessage message="You have unsaved changes." type="info" />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={loading}
                    required
                    className="pl-10"
                    placeholder="Enter your display name"
                    maxLength={50}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="pl-10"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !hasChanges}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </div>

          {/* Password Section */}
          <div className="border-t pt-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Shield className="h-5 w-5" />
              Change Password
            </h2>

            {pwSuccess && <AlertMessage message={pwSuccess} type="success" />}
            {pwError && <AlertMessage message={pwError} type="error" />}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={pwLoading}
                    required
                    className="pl-10 pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={pwLoading}
                    required
                    className="pl-10 pr-10"
                    placeholder="Enter new password"
                    aria-describedby="password-strength"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Enhanced Password Strength Indicator */}
                {newPassword && (
                  <div
                    className="mt-3 p-3 bg-gray-50 rounded-lg"
                    id="password-strength"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Password Strength:
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          pwStrength.label === "Weak"
                            ? "text-red-600"
                            : pwStrength.label === "Medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {pwStrength.label}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${pwStrength.color}`}
                        style={{ width: `${(pwStrength.score / 6) * 100}%` }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <div className="grid grid-cols-2 gap-1">
                        <div
                          className={
                            pwStrength.checks?.length
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ✓ 8+ characters
                        </div>
                        <div
                          className={
                            pwStrength.checks?.uppercase
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ✓ Uppercase letter
                        </div>
                        <div
                          className={
                            pwStrength.checks?.lowercase
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ✓ Lowercase letter
                        </div>
                        <div
                          className={
                            pwStrength.checks?.number
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ✓ Number
                        </div>
                        <div
                          className={
                            pwStrength.checks?.special
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ✓ Special character
                        </div>
                        <div
                          className={
                            pwStrength.checks?.noCommon
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ✓ Not common password
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={pwLoading}
                    required
                    className="pl-10 pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword &&
                  newPassword &&
                  confirmPassword !== newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      Passwords do not match
                    </p>
                  )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  pwLoading ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                }
              >
                {pwLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
